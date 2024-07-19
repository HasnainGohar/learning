import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { createLeaveRequest } from '../../../../redux/actions/employeeActions'
import { getLeaveTitle } from '../../../../redux/actions/adminActions'


// Components
import BackHeader from '../../../../components/BackHeader'
import CreateData from '../../../../components/CreateData'
import LoadingIndicator from '../../../../components/LoadingIndicator'

const AddLeaveScreen = (props) => {

  const {
    requestLeave,
    getLeaveTitle,
    leaveTitles,
  } = props


  const toast = useToast()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      await getLeaveTitle()
    } catch (error) {
      toast.show({
        title: 'Error',
        description: 'An Error Occured, Try Again Later!'
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <Box variant={'container'} safeAreaTop >
      <BackHeader>Add Leave</BackHeader>
      <LoadingIndicator loading={loading} >
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Stack mx={4} mt={2} >
            <CreateData
              saveFunction={requestLeave}
              inputs={[
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
                {
                  label: 'Leave Type',
                  selectLabel: 'title',
                  type: 'select',
                  key: 'titleId',
                  required: true,
                  values: leaveTitles
                },
                {
                  label: 'Reason',
                  key: 'description',
                  line: 4
                }
              ]}
              datePickers={[
                { fromDate: false },
                { toDate: false },
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
    leaveTitles: state.admin.leaves.titles
  }
}

const mapDispatchToProps = dispatch => {
  return {
    requestLeave: (data) => dispatch(createLeaveRequest(data)),
    getLeaveTitle: (data) => dispatch(getLeaveTitle(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLeaveScreen)