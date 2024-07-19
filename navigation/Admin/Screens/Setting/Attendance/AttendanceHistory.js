import React, { useEffect, useState } from 'react'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Icon, FlatList, Text, Button, Stack, Menu, useToast, Input } from 'native-base'

// Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Redux 
import { connect } from 'react-redux'
import { getAllAttendance, getAllEmployees } from '../../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../../components/BackHeader'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import AttendanceCard from '../../../../../components/Cards/AttendanceCard'


const AttendanceHistory = (props) => {

    const {
        attendance,
        getAllAttendance,
        employees,
        getAllEmployees,
        sites
    } = props

    const toast = useToast()
    const navigation = useNavigation()


    const [loading, setLoading] = useState(false)
    const [sortedBy, setSortedBy] = useState();
    const [show, setShow] = useState(false)
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})
    const [searchTerm, setSearchTerm] = useState('');

    navigation.addListener('focus', () => {
        setFilter(false)
        setFilterValues({})
        setSearchTerm('')
    })


    const loadAttendance = async (params) => {
        setLoading(true)
        try {
            await getAllAttendance(params)
            await getAllEmployees({})
        } catch (e) {
            console.log(e)
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAttendance(
            {
                fromDate: new Date(),
                toDate: new Date(),
                id: null,
                siteId: 0
            }
        )
    }, [])


    const renderAttendanceList = () => {
        let filteredAttendance = attendance;

        if (searchTerm) {
            filteredAttendance = filteredAttendance.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (sortedBy) {
            case 'name':
                return filteredAttendance.sort((a, b) => a.name.localeCompare(b.name));
            case 'checkInTime':
                return filteredAttendance.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));
            case 'checkOutTime':
                return filteredAttendance.sort((a, b) => new Date(b.checkOutTime) - new Date(a.checkOutTime));
            default:
                return filteredAttendance;
        }
    };


    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Attendance</BackHeader>
            <Stack space={4}>
                <ListingOptionsCard
                    totalResults={attendance.length}
                    onFilterPress={() => setShow(true)}
                    filter={filter}
                    sort={<Menu trigger={triggerProps => {
                        return <Button
                            variant={'ghost'}
                            size={'sm'}
                            leftIcon={<Icon as={MaterialCommunityIcons} name={'sort'} />}
                            {...triggerProps}
                        >Sort</Button>
                    }} >
                        <Menu.Item onPress={() => setSortedBy('name')}  >Sort by Name</Menu.Item>
                        <Menu.Item onPress={() => setSortedBy('checkInTime')}   >Sort by checkInTime</Menu.Item>
                        <Menu.Item onPress={() => setSortedBy('checkOutTime')}   >Sort by checkOutTime</Menu.Item>
                    </Menu>}
                />

                <Input
                    mx={4}
                    mb={2}
                    placeholder='Serach'
                    rightElement={<Icon as={MaterialCommunityIcons} name='account-search-outline' size={'lg'} mr={2} />}
                    onChangeText={(text) => setSearchTerm(text)}
                />

            </Stack>

            <LoadingIndicator loading={loading} >
                <FlatList
                    data={renderAttendanceList()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <AttendanceCard data={item} key={index} />
                    )}
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={<Box mb={'72'}></Box>}
                    refreshing={loading}
                    onRefresh={() =>
                        loadAttendance({
                            fromDate: new Date(),
                            toDate: new Date(),
                            id: null,
                        })
                    }
                />
            </LoadingIndicator>

            <FilterModal
                show={show}
                setShow={setShow}
                inputs={[
                    {
                        label: 'Site',
                        type: 'select',
                        values: sites,
                        selectLabel: 'name',
                        key: 'siteId',
                        value: filterValue.siteId
                    },
                    {
                        label: 'Employee',
                        type: 'searchDrowpdown',
                        key: 'id',
                        values: employees,
                        selectLabel: 'name',
                        value: filterValue.id
                    },
                    {
                        label: 'From Date',
                        type: 'datetime',
                        mode: 'date',
                        key: 'fromDate',
                        value: filterValue.fromDate

                    },
                    {
                        label: 'To Date',
                        type: 'datetime',
                        mode: 'date',
                        key: 'toDate',
                        value: filterValue.toDate
                    }
                ]}
                datePickers={[
                    { fromDate: false },
                    { toDate: false }
                ]}
                onFilter={(values) => (
                    loadAttendance(values),
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
        </Box>
    )
}


const mapStateToProps = state => {
    return {
        attendance: state.admin.attendance,
        employees: state.admin.employees,
        sites: state.admin.sites
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllAttendance: (data) => dispatch(getAllAttendance(data)),
        getAllEmployees: (data) => dispatch(getAllEmployees(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceHistory)

