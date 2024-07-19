import React, { memo, useCallback, useContext } from 'react'
import { Linking } from 'react-native'

// React Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Pressable, Center, Heading, Stack, Icon, ScrollView, HStack, Card, Divider, Avatar, Text, Image, Button, Fab, FlatList } from 'native-base'

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

// Context API
import AuthGlobal from '../../../../context/store/AuthGlobal'
import { logoutUser } from '../../../../context/actions/Auth.actions'

// Redux
import { connect } from 'react-redux'
import { clearState } from '../../../../redux/actions/employeeActions'

const SettingScreen = (props) => {

    const { clearState } = props

    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    // const isSchedule = context.stateUser.user.viewScheduleModule == 'True' ? true : false
    const isSchedule = true

    const menu = [
        ...(isSchedule ? [
            {
                title: 'Attendance',
                iconType: <Ionicons />,
                iconName: 'today-outline',
                screen: 'Attendance Screen'
            }
        ] : []),
        {
            title: 'Leaves',
            iconType: <Ionicons />,
            iconName: 'today-outline',
            screen: 'Employee Leave'
        },
        {
            title: 'Loan',
            iconType: <MaterialCommunityIcons />,
            iconName: 'account-cash-outline',
            screen: 'Employee Loan Screen'
        },
        {
            title: 'Task',
            iconType: <MaterialIcons />,
            iconName: 'assignment',
            screen: 'Task Screen'
        },
        {
            title: 'Biometric',
            iconType: <MaterialCommunityIcons />,
            iconName: 'fingerprint',
            screen: 'Biometric Screen'
        },
        {
            title: 'Account Center',
            iconType: <MaterialCommunityIcons />,
            iconName: 'account-circle-outline',
            screen: 'Account Screen'
        },
    ]

    const MenuItem = memo(({ item, index, totalItems }) => {
        return (
            <>
                <Button
                    justifyContent="flex-start"
                    variant={'ghost'}
                    borderTopRadius={index === 0 ? 15 : 0}
                    borderBottomRadius={0}
                    leftIcon={<Icon as={item.iconType} name={item.iconName} mr={2} />}
                    onPress={() => navigation.navigate(item.screen)}
                >
                    {item.title}
                </Button>
                <Divider opacity={0.5} />
            </>
        );
    })

    return (
        <Box variant={'container'} safeAreaTop >
            <Stack space={4} >
                <Box variant={'card'} mt={6} mx={4} p={2} >
                    <HStack space={4} alignItems={'center'} >
                        <Avatar bgColor={'gray.300'} >
                            <Icon as={AntDesign} name={'user'} size={'xl'} color={'trueGray.800'} />
                        </Avatar>
                        <Stack >
                            <Text fontWeight={'600'} fontSize={18} color={'primary.600'} >{context.stateUser.user.UserFirstName} {context.stateUser.user.UserLastName}</Text>
                            <Text fontSize={14} >{context.stateUser.user.CompanyName}</Text>
                        </Stack>
                    </HStack>
                </Box>

                <Box variant={'card'} mx={4} p={0} >
                    {menu.map((item, index) => (
                        <MenuItem key={index} item={item} index={index} totalItems={menu.length} />
                    ))}
                    <Button
                        justifyContent="flex-start"
                        variant={'ghost'}
                        borderRadius={0}
                        borderBottomRadius={15}
                        leftIcon={<Icon as={MaterialCommunityIcons} name={'logout'} mr={2} />}
                        onPress={() => (
                            logoutUser(context.dispatch),
                            clearState()
                        )}
                    >Logout</Button>
                </Box>
            </Stack>
            <Fab
                bottom={7}
                size={'lg'}
                renderInPortal={false}
                label="Raise a ticket"
                onPress={() => Linking.openURL('https://workforceverse.atlassian.net/servicedesk/customer/portal/1/group/1/create/1')}
            />
        </Box>
    )
}

const mapStateToProps = state => {
    return {

    }
}
const mapDispatchToProps = dispatch => {
    return {
        clearState: () => dispatch(clearState())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)