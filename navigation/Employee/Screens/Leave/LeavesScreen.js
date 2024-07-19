import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'

// Native Base
import { Avatar, Badge, Box, Center, Divider, FlatList, Heading, HStack, Stack, Text, useToast, Fab, Icon } from 'native-base'

// Redux 
import { connect } from 'react-redux'
import { getAllRequestLeaves } from '../../../../redux/actions/employeeActions'

// Components
import moment from 'moment'
import BackHeader from '../../../../components/BackHeader'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import LeaveCard from '../../../../components/Cards/LeaveCard'

const LeaveScreen = (props) => {

  const {
    leaves,
    getAllLeaves
  } = props

  const toast = useToast()
  const navigation = useNavigation()

  const [loading, setLoading] = useState(false)
  const [refetch, setRefetch] = useState(0)

  navigation.addListener('focus', () => {
    setRefetch(prev => prev + 1)
  })

  const loadLeaves = async () => {
    setLoading(true)
    try {
      await getAllLeaves()
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
    loadLeaves()
  }, [refetch])

  return (
    <Box variant={'container'} safeAreaTop >
      <BackHeader >Employees Leaves</BackHeader>

      <LoadingIndicator loading={loading} >

        <FlatList
          data={leaves}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Box variant={'card'} mx={4} my={2}  >
              <LeaveCard data={item} key={index} isAdmin={false} />
            </Box>
          )}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={() => loadLeaves()}
          ListFooterComponent={<Box pb={60} />}
        />

      </LoadingIndicator>

      <Fab
        renderInPortal={false}
        icon={<Icon as={AntDesign} name={'plus'} />}
        onPress={() => navigation.navigate("Employee Add Leave Screen")}
      />
    </Box>
  )
}


const mapStateToProps = state => {
  return {
    leaves: state.employee.leaves
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllLeaves: (data) => dispatch(getAllRequestLeaves(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaveScreen)

