import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, useWindowDimensions } from 'react-native';

import { Avatar, Badge, Box, Fab, FlatList, HStack, Heading, Icon, IconButton, Menu, Modal, Stack, Text, View, Button, useToast, Spinner } from 'native-base'

// React Natvigation
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

//Context
import moment from 'moment';
import AuthGlobal from '../../../../context/store/AuthGlobal';
import baseURL from '../../../../assets/common/baseURL';
// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

import Entypo from 'react-native-vector-icons/Entypo';

// Components
import ListingOptionsCard from '../../../../components/ListingOptionsCard';
import FilterModal from '../../../../components/FilterModal';
import LoadingIndicator from '../../../../components/LoadingIndicator';

// Redux
import { connect } from 'react-redux';
import {
    getAllSites, getAllEmployees, getRequestOffTypes,
    getRequestOffList, deleteRequestTimeOff,
    getRequestShiftList, getRequestOpenShiftList
} from '../../../../redux/actions/adminActions';
import TimeOffList from './routes/TimeOffList';
import RequestShiftList from './routes/RequestShiftList';
import OpenShiftList from './routes/OpenShiftList';


const RequestTimeOffScreen = (props) => {

    const {
        sites, employees, getSites, getEmployees, getOffRequestTypes,
        requestTypes, requestList, getRequestOffList, deleteRequest,
        schedules, getShiftRquestList, shiftList, getRequestOpenShiftList, openShiftList
    } = props


    const toast = useToast()

    const layout = useWindowDimensions()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)


    const [index, setIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [filterLoading, setFilterLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})
    const [refetch, setRefetch] = useState(0)
    const [deleteID, setDeleteID] = useState(null)
    const [routes] = useState([
        { key: 'first', title: 'TIME OFF' },
        { key: 'second', title: 'SHIFT' },
        { key: 'third', title: 'OPENSHIFT' },
    ])

    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
    })

    useEffect(() => {
        loadData()
    }, [refetch])


    const loadData = async () => {
        setLoading(true)
        try {
            await getRequestOffList({})
            await getShiftRquestList()
            await getRequestOpenShiftList({})
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


    const totalResults = () => {
        switch (index) {
            case 0:
                return requestList?.length
            case 1:
                return shiftList?.length
            case 2:
                return openShiftList?.length
        }
    }


    const renderScene = SceneMap({
        first: TimeOffList,
        second: RequestShiftList,
        third: OpenShiftList,
    })


    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            tabStyle={{ backgroundColor: '#a754ee' }}
        />
    );


    return (

        <Box variant={'container'} safeAreaTop>
            <Stack my={2}>
                <ListingOptionsCard
                    totalResults={totalResults()}
                    onFilterPress={() => {
                        setShow(true)
                        loadFilterData()
                    }}
                    filter={filter}
                />
            </Stack>
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />

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
                    {
                        label: 'Time Off Types',
                        values: requestTypes,
                        type: 'searchDrowpdown',
                        selectLabel: 'typeName',
                        key: 'typeId',
                        value: filterValue.typeId
                    },
                    {
                        label: 'User',
                        type: 'searchDrowpdown',
                        values: employees,
                        selectLabel: 'name',
                        key: 'id',
                        value: filterValue.id
                    },
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
                        <Heading>Delete Position</Heading>
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
        requestList: state.admin.request.offTimeList,
        shiftList: state.admin.request.shiftRequestList,
        openShiftList: state.admin.request.shiftRequestList
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getSites: data => dispatch(getAllSites(data)),
        getEmployees: data => dispatch(getAllEmployees(data)),
        getOffRequestTypes: () => dispatch(getRequestOffTypes()),
        getShiftRquestList: () => dispatch(getRequestShiftList()),
        getRequestOffList: data => dispatch(getRequestOffList(data)),
        deleteRequest: data => dispatch(deleteRequestTimeOff(data)),
        getRequestOpenShiftList: data => dispatch(getRequestOpenShiftList(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestTimeOffScreen)
