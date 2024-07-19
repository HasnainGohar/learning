import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { createLoan, getAllEmployees, getLoanTitle, updateLoan } from '../../../../../redux/actions/adminActions'


// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import withDataLoader from '../../../../../components/withDataLoader'

const AddLoanScreen = (props) => {

    const {
        route,
        employees,
        titles,
        getAllTitles,
        getAllEmployees,
        createLoan,
        updateLoan
    } = props

    const { updateData } = route.params
    const toast = useToast()

    const [loading, setLoading] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            await getAllEmployees({})
            await getAllTitles()
        } catch (e) {
            // console.log(e)
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
            label: 'Employee',
            type: 'select',
            values: employees,
            selectLabel: 'name',
            key: 'id',
            required: true
        },

        {
            label: 'Loan Amount',
            key: 'amount',
            keyboard: 'numeric',
            required: true

        },
        {
            label: 'Loan Title',
            type: 'select',
            values: titles,
            selectLabel: 'title',
            key: 'titleId',
            required: true
        },
        {
            label: 'Tenure',
            key: 'tenure',
            keyboard: 'numeric',
            required: true
        },
        {
            label: 'Status',
            selectLabel: 'title',
            type: 'select',
            key: 'status',
            required: true,
            values: [{
                status: 'Pending',
                title: 'Pending'
            },
            {
                status: 'Approved',
                title: 'Approved'
            },
            {
                status: 'Paid',
                title: 'Paid'
            }]
        },
    ]


    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null


    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>{updateData ? 'Update' : 'Add'} Loan</BackHeader>
            <LoadingIndicator loading={loading} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} mt={2} >
                        {
                            !updateData ? (
                                <CreateData
                                    saveFunction={createLoan}
                                    inputs={inputs}
                                />
                            ) : (
                                <UpdateComponent
                                    saveFunction={updateLoan}
                                    inputs={inputs}
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
        employees: state.admin.employees,
        titles: state.admin.loans.titles
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getAllEmployees: (data) => dispatch(getAllEmployees(data)),
        createLoan: (data) => dispatch(createLoan(data)),
        getAllTitles: () => dispatch(getLoanTitle()),
        updateLoan: (data) => dispatch(updateLoan(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLoanScreen)