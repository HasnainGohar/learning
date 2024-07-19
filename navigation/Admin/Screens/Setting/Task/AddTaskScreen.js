import React, { useEffect, useState } from 'react'

// Native Base
import { Box, ScrollView, Stack, useToast, } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { updateTask, createTask, getAllEmployees, taskDetails } from '../../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import withDataLoader from '../../../../../components/withDataLoader'


const AddTaskScreen = (props) => {

    const {
        route,
        createTask,
        updateTask,
        employees,
        getAllEmployees,
        getTaskDetails,
        details,
    } = props

    const { updateData } = route.params

    const toast = useToast()

    const [loading, setLoading] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            await getAllEmployees({})
            updateData && await getTaskDetails(updateData)
        } catch (e) {
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const inputs = [
        {
            label: 'Employees',
            type: 'multiSelect',
            key: 'id',
            values: employees,
            selectLabel: 'name',
            required: true,
            updateKey: 'id'

        },
        {
            label: 'Documents',
            type: 'document',
            key: 'document',
            multi: true
        },
        {
            label: 'Title',
            key: 'name',
            required: true

        },
        {
            label: 'Description',
            key: 'description',
        },
        {
            label: 'From Date',
            key: 'fromDate',
            type: 'datetime',
            mode: 'date',
            required: true

        },
        {
            label: 'To Date',
            key: 'toDate',
            type: 'datetime',
            mode: 'date',
            required: true

        },
    ]

    const UpdateComponent = updateData ? withDataLoader(CreateData, details) : null


    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>{!updateData ? 'Add' : 'Update'} Task</BackHeader>
            <LoadingIndicator loading={loading} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} mt={2} >
                        {
                            !updateData ? (
                                <CreateData
                                    saveFunction={createTask}
                                    inputs={inputs}
                                    datePickers={{
                                        toDate: false,
                                        fromDate: false
                                    }}
                                />
                            ) : (
                                <UpdateComponent
                                    saveFunction={updateTask}
                                    inputs={inputs}
                                    datePickers={{
                                        toDate: false,
                                        fromDate: false
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
        sites: state.admin.sites,
        roles: state.admin.roles,
        employees: state.admin.employees,
        details: state.admin.taskDetails
    }
}
const mapDispatchToProps = dispatch => {
    return {
        createTask: (data) => dispatch(createTask(data)),
        getTaskDetails: data => dispatch(taskDetails(data)),
        getAllEmployees: (data) => dispatch(getAllEmployees(data)),
        updateTask: (data) => dispatch(updateTask(data))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskScreen)