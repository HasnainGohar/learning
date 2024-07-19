import React, { useEffect, useState } from 'react'

// Native Base
import { Box, HStack, Stack, Switch, Text, useToast } from 'native-base'

import { useNavigation } from '@react-navigation/native'


// Redux
import { connect } from 'react-redux'
import { createShift, getAllEmployees, getRequestOffTypes, createRequestTimeOff, updateRequestTimeOff } from '../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../components/BackHeader'
import CreateData from '../../../../components/CreateData'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import withDataLoader from '../../../../components/withDataLoader'
import SearchDropdown from '../../../../components/SearchDropdown'

const AddRequestScreen = (props) => {

  const { getemployees, employees, route, requestTypes, getRequestTypes, createRequest, updateRequest } = props

  const { updateData } = route.params


  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [switchValue, setsetSwitchValue] = useState(updateData ? updateData.allDay : false)
  const [fields, setFields] = useState(updateData ? updateData : {})



  useEffect(() => {
    loadData()
  }, [])


  const loadData = async () => {
    setLoading(true)
    try {
      await getemployees({})
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
                <SearchDropdown
                  list={employees}
                  key={'id'}
                  setFields={setFields}
                  label={'name'}
                  fieldKey={'id'}
                />
                {/* <SearchDropdown
                        list={item.values}
                        key={item.key}
                        setFields={setFields}
                        label={item.selectLabel}
                        fieldKey={item.key}
                        selectedValue={item.value}

                    /> */}
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                  <Text>All Day</Text>
                  <Switch value={switchValue} onValueChange={() => setsetSwitchValue(!switchValue)} />
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
                    id: fields.id
                  })}
                />

              </Stack>
            ) : (
              <Stack space={3}>
                <SearchDropdown
                  list={employees}
                  key={'id'}
                  setFields={setFields}
                  label={'name'}
                  fieldKey={'id'}
                  selectedValue={updateData.id}
                />
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                  <Text>All Day</Text>
                  <Switch value={switchValue} onValueChange={() => setsetSwitchValue(!switchValue)} />
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
                  saveFunction={(val) => {
                    updateRequest({
                      ...val,
                      allDay: switchValue,
                      id: fields.id,

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
    sites: state.admin.sites,
    employees: state.admin.employees,
    requestTypes: state.admin.request.requestTypes
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createShift: (data) => dispatch(createShift(data)),
    getemployees: (data) => dispatch(getAllEmployees(data)),
    getRequestTypes: () => dispatch(getRequestOffTypes()),
    createRequest: data => dispatch(createRequestTimeOff(data)),
    updateRequest: data => dispatch(updateRequestTimeOff(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRequestScreen)