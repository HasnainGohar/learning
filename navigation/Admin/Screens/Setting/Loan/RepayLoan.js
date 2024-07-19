import React, { useState } from 'react'

//native base
import { Box, Stack, } from 'native-base'

import CreateData from '../../../../../components/CreateData'
import BackHeader from '../../../../../components/BackHeader'
import { repayLoan } from '../../../../../redux/actions/adminActions'
import { connect } from 'react-redux'

const RepayLoan = (props) => {

  const {
    route,
    updateLoan,
  } = props

  const { id } = route.params

  const [loading, setLoading] = useState(false)

  const inputs = [
    {
      label: 'Loan Amount',
      key: 'amount',
      keyboard: 'numeric'
    },
    {
      label: 'Repay Date',
      key: 'fromDate',
      mode: 'date',
      type: 'datetime'

    }
  ]

  return (
    <Box variant={'container'} safeAreaTop >
      <Stack space={4} mx={4} >
        <BackHeader>Repay Info</BackHeader>
        <CreateData
          inputs={inputs}
          datePickers={[
            { fromDate: false }
          ]}
          saveFunction={(data) => updateLoan({
            id,
            ...data
          })}
        />
      </Stack>
    </Box>
  )
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateLoan: (data) => dispatch(repayLoan(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RepayLoan)
