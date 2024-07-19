import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

// Native Base
import { Box, FlatList, Button, Stack, Text, useToast, Menu, Icon } from 'native-base'

// Icon
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Redux 
import { connect } from 'react-redux'
import { getUserAttendance } from '../../../redux/actions/employeeActions'

// Components
import moment from 'moment'
import LoadingIndicator from '../../../components/LoadingIndicator'
import AttendanceCard from '../../../components/Cards/AttendanceCard'
import BackHeader from '../../../components/BackHeader'
import ListingOptionsCard from '../../../components/ListingOptionsCard'
import FilterModal from '../../../components/FilterModal'

const AttendanceScreen = (props) => {

    const {
        route,
        attendance,
        getAllAttendance
    } = props

    const { filterFor } = route.params

    const toast = useToast()

    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})

    useEffect(() => {
        loadAttendance({})
    }, [])

    const loadAttendance = async (params) => {
        setLoading(true)
        try {
            await getAllAttendance({
                fromDate: params.fromDate ? params.fromDate : null,
                toDate: params.toDate ? params.toDate : null,
                week: filterFor == 'Week' ? true : false,
                month: filterFor == 'Month' ? `${moment(new Date()).format('MM')}` : 0,
                year: filterFor == 'Year' ? `${moment(new Date()).format('YYYY')}` : 0,
            })
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


    const renderAttendance = attendance.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Attendance</BackHeader>

            <ListingOptionsCard
                totalResults={attendance.length}
                onFilterPress={() => setShow(true)}
                filter={filter}
            />
            <LoadingIndicator loading={loading} >
                <Stack space={4} mt={2} >
                    <FlatList
                        data={renderAttendance}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <AttendanceCard data={item} key={index} />
                        )}
                        keyExtractor={(item) => item.id}
                        refreshing={loading}
                        ListFooterComponent={<Box pb={40} />}
                        onRefresh={() => loadAttendance({})}
                    />
                </Stack>
            </LoadingIndicator>
            <FilterModal
                show={show}
                setShow={setShow}
                inputs={[
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
            />
        </Box>
    )
}


const mapStateToProps = state => {
    return {
        attendance: state.employee.attendance
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllAttendance: (data) => dispatch(getUserAttendance(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceScreen)

