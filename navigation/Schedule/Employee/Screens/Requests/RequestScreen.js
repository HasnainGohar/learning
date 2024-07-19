import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, useWindowDimensions } from 'react-native';

import { Avatar, Badge, Box, Fab, FlatList, HStack, Heading, Icon, IconButton, Menu, Modal, Stack, Text, View, Button, useToast } from 'native-base'

// React Natvigation
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

//Context
import moment from 'moment';
import AuthGlobal from '../../../../../context/store/AuthGlobal';
import baseURL from '../../../../../assets/common/baseURL';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

// Components
import ListingOptionsCard from '../../../../../components/ListingOptionsCard';
import FilterModal from '../../../../../components/FilterModal';
import LoadingIndicator from '../../../../../components/LoadingIndicator';

// Redux
import { connect } from 'react-redux';
// import { getAllSites, getAllEmployees, getRequestOffTypes, getRequestOffList, deleteRequestTimeOff } from '../../../../redux/actions/adminActions';
import { getAllTimeOffList, deleteTimeOff } from '../../../../../redux/actions/employeeActions';

const RequestScreen = (props) => {

    const { sites, employees, getSites, getEmployees, getOffRequestTypes, requestTypes, requestList, getRequestOffList, deleteRequest, schedules } = props


    const toast = useToast()

    const layout = useWindowDimensions()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)


    const [loading, setLoading] = useState(false)
    const [filterLoading, setFilterLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'first', title: 'TIME OFF' },
        { key: 'second', title: 'SHIFT' },
        { key: 'third', title: 'OPENSHIFT' },
    ])
    const [show, setShow] = useState(false)
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})
    const [refetch, setRefetch] = useState(0)
    const [deleteID, setDeleteID] = useState(null)


    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
    })

    useEffect(() => {
        loadData()
    }, [refetch])


    const loadData = async () => {
        setLoading(true)
        try {
            await getRequestOffList({
                timeOffType: 0,
                employeeId: 0,
                status: ''
            })
            ge
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const loadFilterData = async () => {
        setFilterLoading(true)
        try {
            await getSites({})
            await getEmployees({})
            await getOffRequestTypes()
        } catch (error) {
            console.log(error)
        } finally {
            setFilterLoading(false)
        }
    }

    const onDelete = async () => {
        console.log(deleteID)
        setDeleteLoading(true)
        try {
            await deleteRequest(deleteID)
            setDeleteID(null)
        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setDeleteLoading(false)
        }
    }

    const FirstRoute = () => {

        return (
            <>
                {
                    requestList.length > 0 ?
                        <FlatList
                            data={requestList}
                            keyExtractor={(item) => item.leaveId}
                            renderItem={({ item }) => (
                                <Box variant={'card'} mx={4} mt={3} p={0} >
                                    <HStack space={2}>
                                        <Stack width={70} alignItems={'center'} justifyContent={'center'} backgroundColor={'#36294f'} borderTopLeftRadius={14} borderLeftRadius={14} >
                                            <Avatar
                                                source={{ uri: `${baseURL}${item.image.substring(2)}` }}
                                            />
                                        </Stack>
                                        <Stack ml={-2} width={1} backgroundColor={'#9580d6'} />
                                        <Stack py={2}  >
                                            <Heading size={'sm'} >{item.employeeName}</Heading>
                                            {
                                                item.allDay ?
                                                    <Text fontSize={14} >{moment(item.startDate).format('ddd MMM DD')}{item.startDate == item.endDate ? ' (All Day)' : ` - ${moment(item.endDate).format('ddd MMM DD')}`}</Text> :
                                                    <Text fontSize={14} >{moment(item.shiftDate).format('ddd MMM DD')} , {moment(item.startTime).format('h:ma')}-{moment(item.endTime).format('h:ma')}</Text>

                                            }
                                            <Text>{item.leaveType} </Text>
                                        </Stack>
                                    </HStack>
                                    <Badge position={'absolute'} right={2} bottom={2} borderRadius={'15'} colorScheme={item.status == 'Approved' ? 'success' : 'error'}>{`${item.status}`}</Badge>

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
                                        {/* {context.stateUser.user.CanUpdateSite == 'True' && } */}
                                        <Menu.Item onPress={() => navigation.navigate('Add Request Screen', { updateData: item })} >Edit</Menu.Item>
                                        <Menu.Item onPress={() => setDeleteID(item.leaveId)} >Delete</Menu.Item>
                                        {/* {context.stateUser.user.CanDeleteSite == 'True' && } */}
                                    </Menu>
                                </Box>

                            )}
                            ListFooterComponent={<Box mb={'16'} ></Box>}
                            showsVerticalScrollIndicator={false}
                        />
                        // <AgendaList
                        //     sections={Object.keys(requestList).map((date) => ({ title: date, data: requestList[date].length > 0 ? requestList[date] : [{}] }))}
                        //     renderItem={({ item }) => (
                        //         <Box  >
                        //             <HStack space={2}>
                        //                 <Stack width={70} alignItems={'center'} justifyContent={'center'} backgroundColor={'#36294f'} borderTopLeftRadius={14} borderLeftRadius={14} >
                        //                     <Avatar
                        //                         // source={{ uri: `${baseURL}${item.image.substring(2)}` }}
                        //                     />
                        //                 </Stack>
                        //                 <Stack ml={-2} width={1} backgroundColor={'#9580d6'} />
                        //                 <Stack py={2}  >
                        //                     <Heading size={'sm'} >{item.employeeName}</Heading>
                        //                     {
                        //                         item.allDay ?
                        //                             <Text fontSize={14} >{moment(item.startDate).format('ddd MMM DD')}{item.startDate == item.endDate ? ' (All Day)' : ` - ${moment(item.endDate).format('ddd MMM DD')}`}</Text> :
                        //                             <Text fontSize={14} >{moment(item.shiftDate).format('ddd MMM DD')} , {moment(item.startTime).format('h:ma')}-{moment(item.endTime).format('h:ma')}</Text>

                        //                     }
                        //                     <Text>{item.leaveType} </Text>
                        //                 </Stack>
                        //             </HStack>
                        //             <Badge position={'absolute'} right={2} bottom={2} borderRadius={'15'} colorScheme={item.status == 'Approved' ? 'success' : 'error'}>{`${item.status}`}</Badge>

                        //             <Menu
                        //                 w={'32'}
                        //                 placement='left'
                        //                 trigger={triggerProps => {
                        //                     return <IconButton
                        //                         icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                        //                         position={'absolute'}
                        //                         right={2}
                        //                         top={2}
                        //                         size={'sm'}
                        //                         {...triggerProps}
                        //                     />
                        //                 }}
                        //             >
                        //                 {/* {context.stateUser.user.CanUpdateSite == 'True' && } */}
                        //                 <Menu.Item onPress={() => navigation.navigate('Add Request Screen', { updateData: item })} >Edit</Menu.Item>
                        //                 <Menu.Item onPress={() => setDeleteID(item.leaveId)} >Delete</Menu.Item>
                        //                 {/* {context.stateUser.user.CanDeleteSite == 'True' && } */}
                        //             </Menu>
                        //         </Box>
                        //     )
                        //     }
                        // />
                        :
                        <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Heading my={2}>Time Off Requests</Heading>
                            <Text mx={4} textAlign={'center'}>
                                Review a nd approve time off requests  for your employees. To update approval settings, visit our web app
                            </Text>
                        </Box >
                }
            </>


        )
    }

    const SecondRoute = () => (
        <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Heading my={2}>Shift Requests</Heading>
            <Text mx={4} textAlign={'center'}>
                Let employee drop or swap shifts based on the settings you define. You can change these settings from our web app.
            </Text>
        </Box>
    );

    const ThirdRoute = () => (
        <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Heading my={2}>OpenShift Requests</Heading>
            <Text mx={4} textAlign={'center'}>
                Let employee request to pick up shift that are not yet assigned using OpenShifts. Ypu can disable or restrict OpenShifts from our web app.
            </Text>
        </Box>
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            tabStyle={{ backgroundColor: '#a754ee' }}
        />
    );


    return (

        <Box variant={'container'}>
            <Stack my={2}>
                <ListingOptionsCard
                    totalResults={requestList.length}
                    onFilterPress={() => {
                        setShow(true)
                        loadFilterData()
                    }}
                    filter={filter}
                />
            </Stack>
            <LoadingIndicator loading={loading}>
                <TabView
                    navigationState={{ index, routes }}
                    renderTabBar={renderTabBar}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                />
            </LoadingIndicator>
            <FilterModal
                show={show}
                setShow={setShow}
                inputs={[
                    {
                        label: 'Schedules',
                        type: 'searchDrowpdown',
                        values: schedules,
                        key: 'scheduleId',
                        selectLabel: 'name'
                    },
                    {
                        label: 'Status',
                        type: 'searchDrowpdown',
                        key: 'statusId',
                        values: [
                            {
                                statusId: 1,
                                status: 'All Status'
                            },
                            {
                                statusId: 2,
                                status: 'Pending Approval'
                            },
                            {
                                statusId: 3,
                                status: 'Approved'
                            },
                            {
                                statusId: 3,
                                status: 'Expired'
                            },
                            {
                                statusId: 4,
                                status: 'Denied'
                            },
                            {
                                statusId: 5,
                                status: 'Canceled'
                            },
                        ],
                        selectLabel: 'status',
                        value: filterValue.statusId
                    },
                    // {
                    //     label: 'Time Off Types',
                    //     values: requestTypes,
                    //     type: 'searchDrowpdown',
                    //     selectLabel: 'typeName',
                    //     key: 'typeId',
                    //     value: filterValue.typeId
                    // },
                    // {
                    //     label: 'User',
                    //     type: 'searchDrowpdown',
                    //     values: employees,
                    //     selectLabel: 'name',
                    //     key: 'id',
                    //     value: filterValue.id
                    // },
                ]}
                datePickers={[
                    { fromDate: false },
                    { toDate: false }
                ]}
                onFilter={(values) => (
                    setFilterValues(values),
                    setFilter(true)
                )}
                setFilter={setFilter}
                clearFilter={{
                    name: '',
                    fromDate: new Date(),
                    toDate: new Date()
                }}
            />

            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Request</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Request?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {
                index == 0 &&
                < Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Request Screen", { updateData: null })}
                />
            }
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        sites: state.admin.sites,
        employees: state.admin.employees,
        schedules: state.admin.schedules,
        requestTypes: state.admin.request.requestTypes,
        requestList: state.employee.schedule.requests.timeOff
    }
}
const mapDispatchToProps = dispatch => {
    return {

        getSites: data => dispatch(getAllSites(data)),
        // getEmployees: data => dispatch(getAllEmployees(data)),
        getOffRequestTypes: () => dispatch(getRequestOffTypes()),
        getRequestOffList: data => dispatch(getAllTimeOffList(data)),
        deleteRequest: data => dispatch(deleteTimeOff(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestScreen)
