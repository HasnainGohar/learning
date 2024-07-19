import React, { useState, memo, useContext, useEffect } from 'react'

// React navigation
import { useNavigation } from '@react-navigation/native'

// Navtive base
import {
    Box,
    Button,
    Divider,
    Heading,
    HStack,
    Icon,
    IconButton,
    Modal,
    Pressable,
    Spinner,
    Stack,
    Text,
    useToast,
    FormControl,
    Input,
    Avatar,
} from 'native-base'

// Context
import AuthGlobal from '../../../../../context/store/AuthGlobal'
import baseURL from '../../../../../assets/common/baseURL'

// Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'


// Custom component
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import BackHeader from '../../../../../components/BackHeader'

// Redux
import { connect } from 'react-redux'
import { UpdatePassword } from '../../../../../redux/actions/commonActions'
import { getUserDetails } from '../../../../../redux/actions/employeeActions'

const AccountScreen = (props) => {

    const { changePassword, userDetails, user } = props

    const navigation = useNavigation()
    const context = useContext(AuthGlobal)
    const toast = useToast()

    const [loading, setLoading] = useState(false)
    const [loadingPassword, setLoadingPassword] = useState(false)
    const [modalData, setModalData] = useState()
    const [isVisible, setVisible] = useState(false);

    const [fields, setFields] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    }),
        [fieldError, setFieldError] = useState({});

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const res = await userDetails(context.stateUser.userID)
        } catch (error) {
            console.log(error)
        }
    }

    const menu = [
        {
            title: 'Change password',
            leftIconType: <MaterialCommunityIcons />,
            leftIcon: 'shield-outline',
            screen: 'Change password'
        },
        {
            title: 'Personal details',
            leftIconType: <MaterialCommunityIcons />,
            leftIcon: 'card-account-details-outline',
            screen: 'Personal details'
        },
    ]

    const handleChange = (key, text) => {
        setFields({
            ...fields,
            [key]: text,
        });

        if (key !== 'password') {
            setFieldError(current => {
                const { [key]: tmp, ...rest } = current;
                return rest;
            });
        } else {
            setFieldError(current => {
                const { password: tmp, confirmPassword: tmp1, ...rest } = current;
                return rest;
            });
        }
    };

    const validateFields = () => {
        if (fields.oldPassword == '') {
            setFieldError({
                ...fieldError,
                oldPassword: 'Required',
            });
            return false;
        } else if (fields.password.length <= 6) {
            setFieldError({
                ...fieldError,
                password: 'Password must be greater than 6 digits',
            });
            return false;
        } else if (fields.password.length > 20) {
            setFieldError({
                ...fieldError,
                password: 'Password cannot be greater than 20 digits',
            });
            return false;
        } else if (fields.confirmPassword == '') {
            setFieldError({
                ...fieldError,
                confirmPassword: 'Required',
            });
            return false;
        } else if (fields.password != fields.confirmPassword) {
            setFieldError({
                ...fieldError,
                confirmPassword: 'Password does not Match',
            });
            return false;
        }
        return true;
    };

    const handlePassword = async () => {
        if (!validateFields()) {
            return false
        }
        setLoadingPassword(true)
        try {
            const res = await changePassword({
                userId: context.stateUser.userID,
                oldPassword: fields.oldPassword,
                newPassword: fields.password
            })
            if (res) {
                toast.show({
                    description: 'Password update successfully'
                })
                setModalData(null)
            }
        } catch (error) {

        } finally {
            setLoadingPassword(false)
        }
    }


    const MenuItem = memo(({ item, index, totalItems }) => {

        return (
            <>
                <Pressable
                    flexDirection={'row'}
                    justifyContent={"space-between"}
                    alignItems={'center'}
                    space={2} my={3}
                    onPress={() => setModalData(item)}
                >
                    <HStack space={2}>
                        <Icon as={item.leftIconType} name={item.leftIcon} mr={2} size={'md'} color={'primary.600'} />
                        <Text  fontSize={14} color={'primary.600'} >{item.title}</Text>
                    </HStack>
                    <Icon as={MaterialIcons} name={'keyboard-arrow-right'} mr={2} size={'md'} color={'primary.600'} />
                </Pressable >

            </>
        );
    })

    console.log(user)
    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <BackHeader>Account Center</BackHeader>
                <Stack space={4} mx={4} mt={2}>
                    <Box variant={'card'}>
                        {menu.map((item, index) => (
                            <MenuItem key={index} item={item} index={index} totalItems={menu.length} />
                        ))}
                    </Box>
                </Stack>
                {
                    modalData && <Modal
                        isOpen={Boolean(modalData)}
                        style={{
                            display: null,
                            alignItems: 'stretch',
                            justifyContent: 'space-between'
                        }}
                        _backdrop={{
                            opacity: 1,
                            backgroundColor: '#fff'
                        }} >
                        <Box mt={'16'} mx={4} >
                            <HStack alignItems={'center'} justifyContent={'space-between'} >
                                <Heading>{modalData.screen}</Heading>
                                <IconButton
                                    size={'sm'}
                                    icon={<Icon as={AntDesign} name={'close'} />}
                                    onPress={() => setModalData(null)}
                                />
                            </HStack>
                            {modalData.screen === 'Change password' && (
                                <Stack mt={6} space={5} >
                                    <FormControl isInvalid={'oldPassword' in fieldError}>
                                        <Input
                                            size={'lg'}
                                            isDisabled={loading}
                                            placeholder={'Current Password'}
                                            type={'password'}
                                            onChangeText={text => handleChange('oldPassword', text)}
                                        />
                                        <FormControl.ErrorMessage>
                                            {fieldError.oldPassword}
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={'password' in fieldError}>
                                        <Input
                                            size={'lg'}
                                            isDisabled={loading}
                                            placeholder={'New Password'}
                                            type={isVisible ? 'text' : 'password'}
                                            onChangeText={text => handleChange('password', text)}
                                            rightElement={
                                                <Pressable onPress={() => setVisible(prev => !prev)}>
                                                    <Icon
                                                        as={Ionicons}
                                                        name={isVisible ? 'eye-outline' : 'eye-off-outline'}
                                                        size={'lg'}
                                                        color={'grey'}
                                                        right={2}
                                                    />
                                                </Pressable>
                                            }
                                        />
                                        <FormControl.ErrorMessage>
                                            {fieldError.password}
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={'confirmPassword' in fieldError}>
                                        <Input
                                            size={'lg'}
                                            isDisabled={loading}
                                            placeholder={'Confirm Password*'}
                                            type={isVisible ? 'text' : 'password'}
                                            onChangeText={text => handleChange('confirmPassword', text)}
                                        />
                                        <FormControl.ErrorMessage>
                                            {fieldError.confirmPassword}
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <Button variant={'subtle'} onPress={handlePassword} isDisabled={loadingPassword}>Save</Button>
                                </Stack>
                            )}
                            {modalData.screen === 'Personal details' && (
                                <Stack space={4} mx={1} mt={2} >
                                    {/* <Text>{user.name}</Text> */}
                                    <Box variant={'card'} >
                                        <HStack space={4} alignItems={'center'} >
                                            <Avatar source={{ uri: `${baseURL}${user?.photo?.substring(2)}` }} />
                                            <Stack >
                                                <Heading size={'sm'} >{user.name}</Heading>
                                                {/* {user.jobTitle != "" && <Text>{user.positionName}</Text>} */}
                                                <Text fontSize={12} >{user.email}</Text>
                                            </Stack>
                                        </HStack>
                                    </Box>

                                    <Box variant={'card'} >
                                        <Stack space={2} >
                                            <HStack space={2} alignItems={'center'} >
                                                <Icon as={MaterialCommunityIcons} name={'phone'} color={'primary.600'} />
                                                <Text>{user.phone}</Text>
                                            </HStack>
                                            <HStack space={2} alignItems={'center'} >
                                                <Icon as={MaterialCommunityIcons} name={'map-marker'} color={'primary.600'} />
                                                <Text>{user.address}</Text>
                                            </HStack>
                                        </Stack>
                                    </Box>

                                    <Box variant={'card'} >
                                        <Stack space={2} >
                                            <HStack justifyContent={'space-between'} alignItems={'center'} >
                                                <Text>Start Time</Text>
                                                {/* <Text>{moment(user.startTime).format("hh:mm")}</Text> */}
                                                {/* <Text>{user.startTime}</Text> */}
                                            </HStack>
                                            <HStack justifyContent={'space-between'} alignItems={'center'} >
                                                <Text>Working Hours</Text>
                                                <Text>{user.workingHours}</Text>
                                            </HStack>
                                        </Stack>
                                    </Box>
                                </Stack>
                            )}
                        </Box>

                    </Modal>
                }

            </LoadingIndicator>
        </Box >
    )
}
const mapStateToProps = state => {
    return {
        user: state.employee.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        changePassword: (data) => dispatch(UpdatePassword(data)),
        userDetails: (data) => dispatch(getUserDetails(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen)