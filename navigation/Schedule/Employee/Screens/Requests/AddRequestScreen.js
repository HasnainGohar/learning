import React, { useEffect, useState } from 'react'

// Native Base
import { Box, HStack, Stack, Switch, Text, useToast } from 'native-base'

import { useNavigation } from '@react-navigation/native'


// Redux
import { connect } from 'react-redux'
import { createTimeOff, updateTimeOff, UpdateLoanRequest } from '../../../../../redux/actions/employeeActions'
import { getRequestOffTypes } from '../../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import withDataLoader from '../../../../../components/withDataLoader'
import SearchDropdown from '../../../../../components/SearchDropdown'

const AddRequestScreen = (props) => {

  const { route, requestTypes, getRequestTypes, createRequest, updateRequest } = props

  // console.log(requestTypes)

  const { updateData } = route.params


  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [switchValue, setSwitchValue] = useState(updateData ? updateData.allDay : false);

  // const [fields, setFields] = useState(updateData ? updateData : {})



  useEffect(() => {
    loadData()
  }, [])


  const loadData = async () => {
    setLoading(true)
    try {
      await getRequestTypes()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  const inputs = [
    {
      label: 'Type',
      values: requestTypes,
      type: 'select',
      selectLabel: 'typeName',
      key: 'typeId'
    },
    ...(!switchValue ? [{
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
    ] : [
      {
        label: 'Start Date',
        key: 'startDate',
        type: 'datetime',
        mode: 'date',
        required: true
      },
      {
        label: 'End Date',
        key: 'endDate',
        type: 'datetime',
        mode: 'date',
        required: true
      },
    ]),

    {
      label: 'Message',
      key: 'message',
      line: 4
    }
  ]


  const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null

  return (
    <Box variant={'container'} safeAreaTop >
      <BackHeader> Request Time Off</BackHeader>
      <LoadingIndicator loading={loading} >
        <Stack mx={4} mt={2} >
          {
            !updateData ? (
              <Stack space={3}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                  <Text>All Day</Text>
                  <Switch value={switchValue} onValueChange={() => setSwitchValue(!switchValue)} />
                </HStack>
                <CreateData
                  inputs={inputs}
                  datePickers={{
                    date: false,
                    startDate: false,
                    endDate: false,
                    startTime: false,
                    endTime: false
                  }}
                  saveFunction={(val) => createRequest({
                    ...val,
                    allDay: switchValue,
                  })}
                />
              </Stack>
            ) : (
              <Stack space={3}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                  <Text>All Day</Text>
                  <Switch value={switchValue} onValueChange={() => setSwitchValue(!switchValue)} />
                </HStack>
                <UpdateComponent
                  inputs={inputs}
                  datePickers={{
                    date: false,
                    startDate: false,
                    endDate: false,
                    startTime: false,
                    endTime: false
                  }}
                  saveFunction={(val)=>{
                    updateRequest({
                      ...val,
                      allDay:switchValue,
                    })
                  }}
                />
              </Stack>
            )
          }
        </Stack>
      </LoadingIndicator>
    </Box>
  )
}

const mapStateToProps = state => {
  return {
    positions: state.admin.positions,
    // sites: state.admin.sites,
    // employees: state.admin.employees,
    requestTypes: state.admin.shiftRquest.requestTypes
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createRequest: (data) => dispatch(createTimeOff(data)),
    getRequestTypes: () => dispatch(getRequestOffTypes()),
    updateRequest: data => dispatch(updateTimeOff(data)),
    // getemployees: (data) => dispatch(UpdateLoanRequest(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRequestScreen)