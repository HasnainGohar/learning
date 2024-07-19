import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { getLoanTitle } from '../../../../../redux/actions/adminActions'
import { createLoanRequest } from '../../../../../redux/actions/employeeActions'


// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'

const AddLoanScreen = (props) => {

  const {
    titles,
    getAllTitles,
    requestLoan,
  } = props

  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      await getAllTitles()
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
      <BackHeader>Add Loan</BackHeader>
      <LoadingIndicator loading={loading} > 
          <Stack mx={4} mt={2} >
            <CreateData
              saveFunction={requestLoan}
              inputs={[
                {
                  label: 'Loan Amount',
                  key: 'amount',
                  keyboard: 'numeric'
                },
                {
                  label: 'loanDate',
                  key: 'loanDate',
                  mode: 'date',
                  type: 'datetime'
                },
                {
                  label: 'Loan Title',
                  type: 'select',
                  values: titles,
                  selectLabel: 'title',
                  key: 'titleId',
                },
                {
                  label: 'Tenure(months)',
                  key: 'reason',
                  keyboard: 'numeric'
                },
              ]}
              datePickers={[
                { loanDate: false }
              ]}
            />
          </Stack>
      </LoadingIndicator>
    </Box>
  )
}

const mapStateToProps = state => {
  return {
    titles: state.admin.loans.titles
  }
}
const mapDispatchToProps = dispatch => {
  return {
    requestLoan: (data) => dispatch(createLoanRequest(data)),
    getAllTitles: () => dispatch(getLoanTitle())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLoanScreen)