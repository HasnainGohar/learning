import React, { useEffect, useState } from 'react'
import { Box, Stack, useToast } from 'native-base'

// Copmonnents
import LoadingIndicator from '../../../components/LoadingIndicator'
import CreateData from '../../../components/CreateData'
import BackHeader from '../../../components/BackHeader'
import withDataLoader from '../../../components/withDataLoader'

// Redux
import { connect } from 'react-redux'
import { createSchedule, getAllSites, updateSchedule } from '../../../redux/actions/adminActions'

const AddScheduleScreen = (props) => {

  const { sites, getSites, createSchedule, updateSchedule, route } = props

  const { updateData } = route.params

  const toast = useToast()

  const [loading, setLoading] = useState(false)


  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      await getSites({})
    } catch (error) {
      toast.show({
        title: 'Error',
        description: 'An Error Occured, Try Again Later!'
      })
    } finally {
      setLoading(false)
    }
  }

  const inputs = [
    {
      label: 'Name',
      key: 'name',
    },
    {
      label: 'Site',
      key: 'siteId',
      type: 'select',
      selectLabel: 'name',
      values: sites
    }
  ]


  const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null


  return (
    <Box variant={'container'}>
      <BackHeader>
        {updateData ? 'Update' : 'Add'} Schedule
      </BackHeader>
      <Stack mx={4} mt={2} >
        {
          !updateData ? (
            <CreateData
              saveFunction={createSchedule}
              inputs={inputs}
            />
          ) : (
            <UpdateComponent
              saveFunction={updateSchedule}
              inputs={inputs}
            />
          )
        }
      </Stack>
    </Box>
  )
}

const mapStateToProps = state => {
  return {
    sites: state.admin.sites
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getSites: data => dispatch(getAllSites(data)),
    createSchedule: data => dispatch(createSchedule(data)),
    updateSchedule: data => dispatch(updateSchedule(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddScheduleScreen)
