import React, { useEffect, useState } from 'react'

// Native Base

import { Box, Stack, useToast } from 'native-base'

//Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import SearchDropdown from '../../../../../components/SearchDropdown'

//redux
import { connect } from 'react-redux'
import { getAllSites, getAllEmployees } from '../../../../../redux/actions/adminActions'

const ExportScreen = (props) => {

    const {
        sites,
        employees,
        getAllSites,
        getAllEmployees,
    } = props

    // console.log(employees)

    const toast = useToast()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadSites()
    }, [])


    const loadSites = async () => {
        setLoading(true)
        try {
            await getAllSites({
                fromDate: null,
                toDate: null,
                name: null
            })
            await getAllEmployees({
                firstName: null,
                fromDate: null,
                toDate: null,
                siteId: null,
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


    return (
        <Box variant={'container'}>
            <Stack mx={4} space={3} mt={4} >
                <BackHeader>Reports</BackHeader>

                <CreateData
                    inputs={[
                        {
                            label: 'Company Name',
                            type: 'select',
                            values: sites,
                            selectLabel: 'name',
                            key: 'companyId',
                            required: true
                        },
                        {
                            label: 'Site',
                            type: 'select',
                            values: sites,
                            selectLabel: 'name',
                            key: 'siteId',
                            required: true
                        },
                        {
                            label: 'Employee',
                            type: 'select',
                            values: employees,
                            selectLabel: 'name',
                            key: 'id',
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
                    ]}
                    datePickers={{
                        toDate: false,
                        fromDate: false
                    }}

                />

                {/* <SearchDropdown
                    data={employees}
                /> */}
            </Stack>

        </Box>
    )
}


const mapStateToProps = state => {
    return {
        sites: state.admin.sites,
        employees: state.admin.employees,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllSites: (data) => dispatch(getAllSites(data)),
        getAllEmployees: (data) => dispatch(getAllEmployees(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportScreen)
