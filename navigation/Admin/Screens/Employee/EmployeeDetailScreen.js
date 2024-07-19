import React, { useContext, useEffect, useState } from 'react'

// React navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Box, FlatList, Heading, HStack, Icon, Image, Pressable, ScrollView, Stack, Switch, Text, useToast, Button, Menu, IconButton, Modal } from 'native-base'

// Icons
import MaterailCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

// Components
import BackHeader from '../../../../components/BackHeader'
import baseURL from '../../../../assets/common/baseURL'

import moment from 'moment'
// API
import API from '../../../../utils/API'
import AuthGlobal from '../../../../context/store/AuthGlobal'

// Redux
import { connect } from 'react-redux'
import { deleteEmployeeDocuments, getEmployeeByEmployeeId } from '../../../../redux/actions/adminActions'

// Component
import LoadingIndicator from '../../../../components/LoadingIndicator'

const EmployeeDetailScreen = (props) => {

    const { getDetails, employee, route, deleteDoc } = props

    const { data } = route.params

    const toast = useToast()
    const conetext = useContext(AuthGlobal)
    const navigation = useNavigation()


    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteID, setDeleteID] = useState(false)
    const [docType, setDocType] = useState('')
    const [refetch, setRefetch] = useState(0)

    navigation.addListener('focus', () => (
        setRefetch(prv => prv + 1)
    ))

    useEffect(() => {
        loadData()
    }, [refetch])

    const loadData = async () => {
        setLoading(false)
        try {
            const res = await getDetails(data.id)
        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }



    const handleDelete = async = () => {

        setDeleteLoading(true)
        try {
            const res = deleteDoc({
                deleteID: deleteID,
                docName: docType
            })
            setDeleteID(null)
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteLoading(false)

        }
    }

    const navigateToUpdateScreen = (educationItem, menu) => {
        const updateData = {
            ...data,
            educationDetail: educationItem,
        };

        navigation.navigate('Add Employee Screen', { updateData, showDetails: menu });
    }

    console.log(employee.passportDetail)

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Employee Detail</BackHeader>
            <LoadingIndicator loading={loading} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    flex={1}
                >
                    <Stack space={4} mx={4} mt={2} mb={4} >
                        <Box variant={'card'} >
                            <HStack space={4} alignItems={'center'} >
                                <Avatar source={{ uri: `${baseURL}${employee?.image?.substring(2)}` }} />    
                                <Stack >
                                    <Heading size={'sm'} >{employee?.name}</Heading>
                                    {employee?.jobTitle != "" && <Text>{employee?.positionName}</Text>}
                                    <Text fontSize={12} >{employee?.email}</Text>
                                </Stack>
                            </HStack>
                            <Menu
                                w={'32'}
                                placement='left'
                                trigger={triggerProps => {
                                    return <IconButton
                                        icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                                        position={'absolute'}
                                        right={2}
                                        top={2}
                                        size={'sm'}
                                        {...triggerProps}
                                    />
                                }}
                            >
                                {conetext.stateUser.user.CanUpdateEmployee == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Employee Screen', { updateData: employee })} >Edit</Menu.Item>}
                            </Menu>
                        </Box>

                        <Box variant={'card'} >
                            <Stack space={2} >
                                <HStack justifyContent={'space-between'} space={2} alignItems={'center'} >
                                    <Icon as={Ionicons} name={'business-outline'} color={'primary.600'} />
                                    <Text>{employee?.siteName}</Text>
                                </HStack>
                                <HStack justifyContent={'space-between'} space={2} alignItems={'center'} >
                                    <Icon as={MaterailCommunityIcons} name={'phone'} color={'primary.600'} />
                                    <Text>{employee?.phone}</Text>
                                </HStack>
                                <HStack justifyContent={'space-between'} space={2} alignItems={'center'} >
                                    <Icon as={MaterailCommunityIcons} name={'map-marker'} color={'primary.600'} />
                                    <Text>{employee?.address}</Text>
                                </HStack>
                                <HStack justifyContent={'space-between'} alignItems={'center'} >
                                    <Heading size={'xs'}>Start Time</Heading>
                                    <Text>{moment(employee?.startTime).format("hh:mm a")}</Text>
                                </HStack>
                                <HStack justifyContent={'space-between'} alignItems={'center'} >
                                    <Heading size={'xs'}>Working Time</Heading>
                                    <Text>{employee?.workingHours}(hr)</Text>
                                </HStack>
                            </Stack>
                        </Box>
                        {
                            employee?.educationDetail?.length >= 1 &&
                            <>
                                <Heading size={'md'}>
                                    Educational Deatils
                                </Heading>
                                {
                                    employee?.educationDetail?.map((item) => (
                                        <Box variant={'card'}>
                                            <Stack space={2}>
                                                <Heading size={'md'}>
                                                    {item.degree}
                                                </Heading>
                                                <HStack justifyContent={'space-between'} alignItems={'center'} >
                                                    <Heading size={'xs'}>Qualification</Heading>
                                                    <Text>{item.qualification}</Text>
                                                </HStack>
                                                <HStack justifyContent={'space-between'} alignItems={'center'} >
                                                    <Heading size={'xs'}>Grade</Heading>
                                                    <Text>{item.grade}</Text>
                                                </HStack>
                                                <Image style={{ height: 100, width: 100, backgroundColor: 'gray' }} my={1} resizeMode='contain' source={{ uri: `https://ausztechattendance-bucket.s3.amazonaws.com/${item.imagePath}` }} alt='degree images' />
                                            </Stack>
                                            <Menu
                                                w={'32'}
                                                placement='left'
                                                trigger={triggerProps => {
                                                    return <IconButton
                                                        icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                                                        position={'absolute'}
                                                        right={2}
                                                        top={2}
                                                        size={'sm'}
                                                        {...triggerProps}
                                                    />
                                                }}
                                            >
                                                {conetext.stateUser.user.CanUpdateEmployee == 'True' && <Menu.Item onPress={() => navigateToUpdateScreen(item, 'educationDetails')}>Edit</Menu.Item>}
                                                {conetext.stateUser.user.CanDeleteEmployee == 'True' && <Menu.Item onPress={() => { setDeleteID(item.educationId), setDocType('Education') }}>Delete</Menu.Item>}
                                            </Menu>
                                        </Box>
                                    ))
                                }
                            </>
                        }
                        {
                            employee?.bankDetail?.bankName &&
                            <>

                                <Box variant={'card'} >
                                    <Stack space={2} >
                                        <Heading size={'md'}>
                                            Bank Deatils
                                        </Heading>
                                        <HStack justifyContent={'space-between'} space={2} alignItems={'center'} >
                                            <Heading size={'xs'}>
                                                Bank Name
                                            </Heading>
                                            <Text>{employee?.bankDetail?.bankName}</Text>
                                        </HStack>
                                        <HStack justifyContent={'space-between'} space={2} alignItems={'center'} >
                                            <Heading size={'xs'}>
                                                Account Holder Name
                                            </Heading>
                                            <Text>{employee?.bankDetail?.accountHolderName}</Text>
                                        </HStack>
                                        <HStack justifyContent={'space-between'} space={2} alignItems={'center'} >
                                            <Heading size={'xs'}>
                                                Account Number
                                            </Heading>
                                            <Text>{employee?.bankDetail?.accountNumber}</Text>
                                        </HStack>
                                        <HStack justifyContent={'space-between'} alignItems={'center'} >
                                            <Heading size={'xs'}>Salary Date</Heading>
                                            <Text>{moment(employee?.bankDetail?.salaryDate).format('DD-MM-YYYY')}</Text>
                                        </HStack>
                                    </Stack>
                                    <Menu
                                        w={'32'}
                                        placement='left'
                                        trigger={triggerProps => {
                                            return <IconButton
                                                icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                                                position={'absolute'}
                                                right={2}
                                                top={2}
                                                size={'sm'}
                                                {...triggerProps}
                                            />
                                        }}
                                    >
                                        {conetext.stateUser.user.CanUpdateEmployee == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Employee Screen', { updateData: employee, showDetails: 'bankDetails' })}>Edit</Menu.Item>}
                                        {conetext.stateUser.user.CanDeleteEmployee == 'True' && <Menu.Item onPress={() => { setDeleteID(employee?.bankDetail?.bankDetailId), setDocType('Bank') }} >Delete</Menu.Item>}
                                    </Menu>
                                </Box>
                            </>
                        }

                        {
                            employee?.passportDetail?.nationality &&
                            <>
                                <Box variant={'card'}>
                                    <Stack space={2} >
                                        <Heading size={'md'}>
                                            Passport Details
                                        </Heading>
                                        <HStack justifyContent={'space-between'} alignItems={'center'} >
                                            <Heading size={'xs'}>
                                                Nationality:
                                            </Heading>
                                            <Text>{employee?.passportDetail?.nationality}</Text>
                                        </HStack>
                                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                                            <Heading size={'xs'}>
                                                Issue Date:
                                            </Heading>
                                            <Text>
                                                {moment(employee?.passportDetail?.issueDate).format('DD-MM-YYYY')}
                                            </Text>
                                        </HStack>
                                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                                            <Heading size={'xs'}>
                                                Expiry Date:
                                            </Heading>
                                            <Text>
                                                {moment(employee?.passportDetail?.expiryDate).format('DD-MM-YYYY')}
                                            </Text>
                                        </HStack>
                                        <HStack space={3} flexWrap={'wrap'} alignItems={'center'}>
                                            {
                                                employee?.passportDetail?.images?.map((item) => (
                                                    <Image style={{ height: 100, width: 100, backgroundColor: 'gray' }} my={1} resizeMode='contain' source={{ uri: `https://ausztechattendance-bucket.s3.amazonaws.com/${item}` }} alt='passport images' />

                                                ))
                                            }
                                        </HStack>
                                    </Stack>
                                    <Menu
                                        w={'32'}
                                        placement='left'
                                        trigger={triggerProps => {
                                            return <IconButton
                                                icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                                                position={'absolute'}
                                                right={2}
                                                top={2}
                                                size={'sm'}
                                                {...triggerProps}
                                            />
                                        }}
                                    >
                                        {conetext.stateUser.user.CanUpdateEmployee == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Employee Screen', { updateData: employee, showDetails: 'passportDetails' })}>Edit</Menu.Item>}
                                        {conetext.stateUser.user.CanDeleteEmployee == 'True' && <Menu.Item onPress={() => { setDeleteID(employee.passportDetail.documentId), setDocType('Passport') }} >Delete</Menu.Item>}
                                    </Menu>
                                </Box>
                            </>
                        }
                        {
                            employee?.visaDetail?.expiryDate &&
                            <>

                                <Box variant={'card'}>
                                    <Heading size={'md'}>
                                        Visa Details
                                    </Heading>
                                    <Stack space={2} >
                                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                                            <Heading size={'xs'}>
                                                Status:
                                            </Heading>
                                            <Text>
                                                {employee?.visaDetail.status}
                                            </Text>
                                        </HStack>
                                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                                            <Heading size={'xs'}>
                                                Issue Date:
                                            </Heading>
                                            <Text>
                                                {moment(employee?.visaDetail?.issueDate).format('DD-MM-YYYY')}
                                            </Text>
                                        </HStack>
                                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                                            <Heading size={'xs'}>
                                                Expiry Date:
                                            </Heading>
                                            <Text>
                                                {moment(employee?.visaDetail?.expiryDate).format('DD-MM-YYYY')}

                                            </Text>
                                        </HStack>
                                        <HStack space={3} flexWrap={'wrap'} alignItems={'center'}>
                                            {
                                                employee?.visaDetail?.images?.map((item) => (
                                                    <Image
                                                        style={{ height: 100, width: 100, backgroundColor: 'gray' }}
                                                        my={1} resizeMode='contain'
                                                        source={{ uri: `https://ausztechattendance-bucket.s3.amazonaws.com/${item}` }}
                                                        alt='visa images'
                                                    />

                                                ))
                                            }
                                        </HStack>
                                    </Stack>
                                    <Menu
                                        w={'32'}
                                        placement='left'
                                        trigger={triggerProps => {
                                            return <IconButton
                                                icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                                                position={'absolute'}
                                                right={2}
                                                top={2}
                                                size={'sm'}
                                                {...triggerProps}
                                            />
                                        }}
                                    >
                                        {conetext.stateUser.user.CanUpdateEmployee == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Employee Screen', { updateData: employee, showDetails: 'visaDetails' })}>Edit</Menu.Item>}
                                        {conetext.stateUser.user.CanDeleteEmployee == 'True' && <Menu.Item onPress={() => { setDeleteID(employee?.visaDetail?.documentId), setDocType('Visa') }} >Delete</Menu.Item>}

                                    </Menu>
                                </Box>
                            </>
                        }

                        {
                            employee?.complinceDocuments?.length >= 1 &&
                            <>
                                <Heading size={'md'}>
                                    Complince Documents
                                </Heading>
                                {
                                    employee?.complinceDocuments?.map((item) => (
                                        <Box variant={'card'}>
                                            <Stack space={2}>
                                                <Heading size={'md'}>
                                                    {item.status}
                                                </Heading>
                                                <HStack justifyContent={'space-between'} alignItems={'center'} >
                                                    <Heading size={'xs'}>Category</Heading>
                                                    <Text>{item.category}</Text>
                                                </HStack>
                                                <HStack justifyContent={'space-between'} alignItems={'center'} >
                                                    <Heading size={'xs'}>Notification</Heading>
                                                    <Text>{item?.notification?.map((item) => item).join(', ')}</Text>
                                                </HStack>
                                                <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                    <Heading size={'xs'}>
                                                        Issue Date:
                                                    </Heading>
                                                    <Text>
                                                        {moment(item.issueDate).format('DD-MM-YYYY')}
                                                    </Text>
                                                </HStack>
                                                <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                    <Heading size={'xs'}>
                                                        Expiry Date:
                                                    </Heading>
                                                    <Text>
                                                        {moment(item.expiryDate).format('DD-MM-YYYY')}
                                                    </Text>
                                                </HStack>
                                                {/* <HStack space={3} flexWrap={'wrap'} alignItems={'center'}>
                                                {
                                                    item?.images?.map((item) => (
                                                        <Image style={{ height: 100, width: 100, backgroundColor: 'gray' }} my={1} resizeMode='contain' source={{ uri: `https://ausztechattendance-bucket.s3.amazonaws.com/${item}` }} alt='passport images' />

                                                    ))
                                                }
                                            </HStack> */}
                                            </Stack>
                                            <Menu
                                                w={'32'}
                                                placement='left'
                                                trigger={triggerProps => {
                                                    return <IconButton
                                                        icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                                                        position={'absolute'}
                                                        right={2}
                                                        top={2}
                                                        size={'sm'}
                                                        {...triggerProps}
                                                    />
                                                }}
                                            >
                                                {conetext.stateUser.user.CanUpdateEmployee == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Employee Screen', {
                                                    updateData: {
                                                        ...employee,
                                                        complinceDocuments: item
                                                    },
                                                    showDetails: 'additionalDetails'
                                                })}>
                                                    Edit</Menu.Item>}
                                                {conetext.stateUser.user.CanDeleteEmployee == 'True' && <Menu.Item onPress={() => { setDeleteID(item.documentId), setDocType('Additional') }}>Delete</Menu.Item>}
                                            </Menu>
                                        </Box>
                                    ))
                                }
                            </>
                        }
                    </Stack>
                </ScrollView>
            </LoadingIndicator>

            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Employee Details</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Deatil?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={handleDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        employee: state.admin.employeeDetails
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getDetails: (data) => dispatch(getEmployeeByEmployeeId(data)),
        deleteDoc: (data) => dispatch(deleteEmployeeDocuments(data))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetailScreen)