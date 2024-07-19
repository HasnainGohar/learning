import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, Fab, ScrollView, Stack, useToast } from 'native-base'


// Redux
import { connect } from 'react-redux'
import { createShift, getAllEmployees, getAllPositions, getAllSchdeules, getAllSites, updateShift } from '../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../components/BackHeader'
import CreateData from '../../../../components/CreateData'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import withDataLoader from '../../../../components/withDataLoader'

const AddShiftScreen = (props) => {

    const { positions, getPositions, sites, createShift, getSites, schedules, getSchedule, employees, getEmployees, updateShift, route } = props
    const { updateData } = route.params

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadData()
    }, [])


    const loadData = async () => {
        setLoading(true)
        try {
            await getPositions({})
            await getSites({})
            await getSchedule({})
            await getEmployees({})
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    const inputs = [
        {
            label: 'Date',
            key: 'shiftDate',
            type: 'datetime',
            mode: 'date',
            required: true

        },
        {
            label: 'Start Time',
            key: 'startTime',
            type: 'datetime',
            mode: 'time',
            required: true

        },
        {
            label: 'End Time',
            key: 'endTime',
            type: 'datetime',
            mode: 'time',
            required: true

        },
        {
            label: 'Position',
            type: 'select',
            values: positions,
            selectLabel: 'name',
            key: 'positionId',
        },
        {
            label: 'Unpaid Break (minutes)',
            key: 'unpaidBreak',
            keyboard: 'numeric',
        },
        {
            label: 'Job Site',
            type: 'select',
            values: sites,
            selectLabel: 'name',
            key: 'siteId',
        },
        {
            label: 'Schedule',
            type: 'select',
            values: schedules,
            selectLabel: 'name',
            key: 'scheduleId',
            required: true
        },
        {
            label: 'Assign To',
            type: 'select',
            values: employees,
            selectLabel: 'name',
            key: 'id',
        },
        {
            label: 'How many shifts',
            key: 'numberOfShifts',
            keyboard: 'numeric',
        },

        {
            label: 'Shift Task Lists',
            key: 'shiftTask',
            type: 'select'
        },
        {
            label: 'Message',
            key: 'message',
        },
        {
            label: 'Shift Notes',
            key: 'shiftNotes',
        },
        // {
        //     label: 'Shifts Task',
        //     key: 'shiftNo',
        //     keyboard: 'numeric',
        // },
    ]

    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>{!updateData ? 'Add' : 'Update'} Shift</BackHeader>
            <LoadingIndicator loading={loading} >
                <ScrollView
                    mb={10}
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} mt={2} >
                        {
                            !updateData ? (
                                <CreateData
                                    saveFunction={createShift}
                                    inputs={inputs}
                                    datePickers={{
                                        date: false,
                                        startTime: false,
                                        endTime: false
                                    }}
                                />
                            ) : (
                                <UpdateComponent
                                    saveFunction={updateShift}
                                    inputs={inputs}
                                    datePickers={{
                                        date: false,
                                        startTime: false,
                                        endTime: false
                                    }}
                                />
                            )
                        }
                    </Stack>
                </ScrollView>
            </LoadingIndicator>

        </Box>
    )
}

const mapStateToProps = state => {
    return {
        positions: state.admin.positions,
        sites: state.admin.sites,
        schedules: state.admin.schedules,
        employees: state.admin.employees
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getSites: (data) => dispatch(getAllSites(data)),
        createShift: (data) => dispatch(createShift(data)),
        updateShift: data => dispatch(updateShift(data)),
        getSchedule: data => dispatch(getAllSchdeules(data)),
        getPositions: data => dispatch(getAllPositions(data)),
        getEmployees: data => dispatch(getAllEmployees(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddShiftScreen)
