import React, { useEffect, useState, useContext } from 'react'
import { Box, Fab, FlatList, Heading, Icon, IconButton, Menu, Modal, Stack, Text, useToast, Button } from 'native-base'

// Raect Navigation
import { useNavigation } from '@react-navigation/native'

// Context 
import AuthGlobal from '../../../context/store/AuthGlobal'

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'

// Redux
import { connect } from 'react-redux'
import { getAllSchdeules, deleteSchedule } from '../../../redux/actions/adminActions'

// Components
import LoadingIndicator from '../../../components/LoadingIndicator'
import BackHeader from '../../../components/BackHeader'


const ScheduleScreen = (props) => {

  const { getSchdules, deleteSchedule, schedules } = props

  const toast = useToast()
  const navigation = useNavigation()
  const context = useContext(AuthGlobal)

  const [loading, setLoading] = useState(false)
  const [refetch, setRefetch] = useState(0)
  const [deleteID, setDeleteID] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)



  navigation.addListener('focus', () => {
    setRefetch(prev => prev + 1)
  })


  useEffect(() => {
    loadData()
  }, [refetch])




  const loadData = async (params) => {
    setLoading(true)
    try {
      await getSchdules({})

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

  const onDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteSchedule(deleteID)
      setDeleteID(null)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Error',
        description: 'An Error Occured, Try Again Later!'
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <Box variant={'container'} safeAreaTop >
      <BackHeader>
        Schedules
      </BackHeader>
      <LoadingIndicator loading={loading}>
        <FlatList
          data={schedules}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Box variant={'card'} mx={4} mt={3} >
              <Stack space={1} >
                <Heading size={'sm'} >{item.name}</Heading>
                <Text>{item.site}</Text>
              </Stack>
              {
                (context.stateUser.user.CanUpdateSchedule == 'True' || context.stateUser.user.CanDeleteSchedule == 'True') &&
                <Menu
                  w={'32'}
                  placement='left'
                  trigger={triggerProps => {
                    return <IconButton
                      icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                      position={'absolute'}
                      right={2}
                      top={2}
                      size={'sm'}
                      {...triggerProps}
                    />
                  }}
                >
                  {context.stateUser.user.CanUpdateSchedule == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Schedule Screen', { updateData: item })} >Edit</Menu.Item>}
                  {context.stateUser.user.CanDeleteSchedule == 'True' && <Menu.Item onPress={() => setDeleteID(item.scheduleId)} >Delete</Menu.Item>}
                </Menu>
              }
            </Box>
          )}
          keyExtractor={(item) => item.positionId}
          ListFooterComponent={<Box mb={'32'} ></Box>}
          refreshing={loading}
        />


      </LoadingIndicator>

      {
        context.stateUser.user.CanAddSchedule == 'True' &&
        < Fab
          renderInPortal={false}
          icon={<Icon as={AntDesign} name={'plus'} />}
          onPress={() => navigation.navigate("Add Schedule Screen", { updateData: null })}
        />

      }

      <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
        <Modal.Content>
          <Modal.Header>
            <Heading>Delete Position</Heading>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Text>Are you sure want to delete this Position?</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

    </Box>
  )
}

const mapStateToProps = state => {
  return {
    schedules: state.admin.schedules
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getSchdules: data => dispatch(getAllSchdeules(data)),
    deleteSchedule: data => dispatch(deleteSchedule(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen)

