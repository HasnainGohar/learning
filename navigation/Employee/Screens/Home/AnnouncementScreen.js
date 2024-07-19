import React, { useEffect, useState } from 'react'

// Native Base
import { Box, Center, FlatList, Heading, IconButton, Icon, Stack, Text, useToast, Modal, Menu, Button } from 'native-base'

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'


// Components
import LoadingIndicator from '../../../../components/LoadingIndicator'
import BackHeader from '../../../../components/BackHeader'


// Redux 
import { connect } from 'react-redux'
import { updateAnnouncementStatus } from '../../../../redux/actions/employeeActions'
import { getAllAnnouncement } from '../../../../redux/actions/adminActions'

const AnnouncementScreen = (props) => {

  const {
    updateAnnouncement,
    getAllAnnouncemet,
    announcements

  } = props


  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [loadAnnouncements, setLoadAnnouncements] = useState(false)
  const [details, setDetails] = useState()


  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoadAnnouncements(true)
    try {
      getAllAnnouncemet()
    } catch (error) {
      console.log(error)
    } finally {
      setLoadAnnouncements(false)
    }
  }

  const updateStatus = async (data) => {
    setDetails({
      title: data.title,
      description: data.description,
      id: data.id,
      status: data.status
    })
    setLoading(true)
    try {
      !data.status && await updateAnnouncement({
        id: data.id,
        status: true
      })
    } catch (e) {
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
       <BackHeader>Announcement</BackHeader>
      <LoadingIndicator loading={loading} >
          <FlatList
            data={announcements}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Box variant={'card'} mx={4} my={2} >
                <Stack space={1} >
                  <Heading size={'sm'} >{item.title}</Heading>
                  <Text>{item.description}</Text>
                </Stack>
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
                  <Menu.Item onPress={() => updateStatus(item)} >Details</Menu.Item>
                </Menu>
              </Box>
            )}
            keyExtractor={(item) => item.id}
            ListFooterComponent={<Box mb={'32'} ></Box>}
            refreshing={loading}
          // onRefresh={loadAnnouncements}
          />

        {details && (
          <Modal
            isOpen={Boolean(details)}
            style={{
              display: null,
              alignItems: 'stretch',
              justifyContent: 'space-between'
            }}
            _backdrop={{
              opacity: 1,
              backgroundColor: '#fff'
            }} >
            <Box mt={'16'} mx={4}>
              <Stack space={4}>
                <IconButton
                  alignSelf={'flex-end'}
                  size={'sm'}
                  icon={<Icon as={AntDesign} name={'close'} />}
                  onPress={() => setDetails(null)}
                />
                <Center >
                  <Heading>{details.title}</Heading>
                </Center>
                <Text>
                  {details.description}
                </Text>
              </Stack>
            </Box>
          </Modal>
        )}
      </LoadingIndicator>

    </Box>
  )
}


const mapStateToProps = state => {
  return {
    announcements: state.admin.announcements

  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllAnnouncemet: () => dispatch(getAllAnnouncement()),
    updateAnnouncement: (data) => dispatch(updateAnnouncementStatus(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementScreen)

