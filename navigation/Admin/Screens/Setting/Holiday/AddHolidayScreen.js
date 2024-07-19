import React, { useContext, useEffect, useState } from 'react'



// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { createPublicHolidays, updatePublicHolidays } from '../../../../../redux/actions/adminActions'


// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import withDataLoader from '../../../../../components/withDataLoader'

const AddHolidayScreen = (props) => {
    const {
        route,
        createHoliday,
        updateHoliday
    } = props

    const { updateData } = route.params

    const [loading, setLoading] = useState(false)

    const inputs = [
        {
            label: 'Holiday Name',
            key: 'name',
            required: true

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
        {
            label: 'Description',
            key: 'description',
            required: true
        },
    ]

    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null

    return (
        <Box variant={'conatiner'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <BackHeader>{updateData ? 'Update' : 'Add'} Holiday</BackHeader>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} mt={3} space={3} >
                        {
                            !updateData ? (
                                <CreateData
                                    saveFunction={createHoliday}
                                    inputs={inputs}
                                    datePickers={[
                                        { toDate: false },
                                        { fromDate: false }
                                    ]}
                                />
                            ) : (
                                <UpdateComponent
                                    saveFunction={updateHoliday}
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
        holidays: state.admin.holidays
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createHoliday: (data) => dispatch(createPublicHolidays(data)),
        updateHoliday: (data) => dispatch(updatePublicHolidays(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddHolidayScreen)
