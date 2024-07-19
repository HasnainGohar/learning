import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { createLeave, getAllEmployees, getLeaveTitle } from '../../../../../redux/actions/adminActions'


// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'

const AddLeaveScreen = (props) => {

    const {
        getAllEmployees,
        employees,
        createLeave,
        getLeaveTitle,
        leaveTitles

    } = props

    const [loading, setLoading] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            await getAllEmployees({})
            await getLeaveTitle({})
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

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Add Leave</BackHeader>
            <LoadingIndicator loading={loading} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} mt={2} >
                        <CreateData
                            saveFunction={createLeave}
                            inputs={[
                                {
                                    label: 'Employee',
                                    type: 'select',
                                    values: employees,
                                    selectLabel: 'name',
                                    key: 'id',
                                    required: true

                                },
                                {
                                    label: 'Leave Type',
                                    selectLabel: 'title',
                                    type: 'select',
                                    key: 'titleId',
                                    required: true,
                                    values: leaveTitles
                                },
                                {
                                    label: 'FromDate',
                                    key: 'fromDate',
                                    type: 'datetime',
                                    mode: 'date',
                                    required: true

                                },
                                {
                                    label: 'ToDate',
                                    key: 'toDate',
                                    type: 'datetime',
                                    mode: 'date',
                                    required: true
                                },
                            ]}
                            datePickers={[
                                { fromDate: false },
                                { toDate: false }
                            ]}

                        />
                    </Stack>
                </ScrollView>
            </LoadingIndicator>
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        employees: state.admin.employees,
        leaveTitles: state.admin.leaves.titles

    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllEmployees: (data) => dispatch(getAllEmployees(data)),
        getLeaveTitle: (data) => dispatch(getLeaveTitle(data)),
        createLeave: (data) => dispatch(createLeave(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLeaveScreen)