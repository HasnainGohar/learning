import React, { useState, useContext } from 'react'

// Native Base
import { Box, ScrollView, Stack } from 'native-base'


// Redux
import { connect } from 'react-redux'
import { updateCompanyDetails } from '../../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import withDataLoader from '../../../../../components/withDataLoader'

const UpdateCompanyScreen = (props) => {

    const { updateCompany, route } = props
    const { updateData } = route.params

    console.log(updateData)


    const [loading, setLoading] = useState(false)

    const inputs = [
        {
            label: 'Compnay Logo',
            type: 'image',
            key: 'companyLogo'
        },
        {
            label: 'Company Name',
            key: 'companyName'
        },
        {
            label: 'Company Code',
            key: 'companyCode'
        },
        {
            label: 'Email',
            key: 'companyEmail'
        },
        {
            label: 'Phone Number',
            keyboard: 'phone-pad',
            key: 'companyMobile'
        },
        {
            label: 'Address',
            key: 'companyAddress1'
        },
        {
            label: 'City',
            key: 'companyCity'
        },
        {
            label: 'Country',
            key: 'companyCountry'
        },
        {
            label: 'Description',
            key: 'companyNote'
        },
        {
            label: 'Start Time',
            type: 'datetime',
            key: 'startTime',
            mode: 'time',
            required: true,

        },
        {
            label: 'End Time',
            type: 'datetime',
            key: 'endTime',
            mode: 'time',
            required: true,

        },
        {
            checkBoxLabel: 'Take attendance image',
            key: 'takeImage',
            type: 'checkbox',
        },
        {
            checkBoxLabel: 'use Location on Attendance',
            key: 'useLocation',
            type: 'checkbox',  
        }
    ]

    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null

    return (
        <Box variant={'conatiner'} safeAreaTop >
            <BackHeader>Update Company </BackHeader>
            <LoadingIndicator loading={loading} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} mt={2} mb={16}>
                        <UpdateComponent
                            saveFunction={updateCompany}
                            inputs={inputs}
                            datePickers={[
                                { startTime: false },
                                { endTime: false }
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

    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateCompany: (data) => dispatch(updateCompanyDetails(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateCompanyScreen)