import React, { useContext, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

//Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Badge, Box, Center, Divider, Fab, FlatList, Heading, IconButton, Icon, Stack, Text, useToast, Modal, Menu, Button, HStack } from 'native-base'

//context
import AuthGlobal from '../../../../../context/store/AuthGlobal'


// Icons
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'


// Components
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import BackHeader from '../../../../../components/BackHeader'


// Redux 
import { connect } from 'react-redux'
import { deleteAnnouncement, getAllAnnouncement } from '../../../../../redux/actions/adminActions'

const AnnouncementScreen = (props) => {

    const {
        announcements,
        getAllAnnouncement,
        deleteAnnouncement
    } = props

    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)


    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [data, setData] = useState()
    const [deleteID, setDeleteID] = useState(null)
    const [refetch, setRefetch] = useState(0)

    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
    })

    const loadAnnouncements = async () => {
        setLoading(true)
        try {
            await getAllAnnouncement()
        } catch (e) {
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
            await deleteAnnouncement(deleteID)
            setDeleteID(null)
        } catch (error) {
            // console.log(error)
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setDeleteLoading(false)
        }
    }


    useEffect(() => {
        loadAnnouncements()
    }, [refetch])

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Announcement</BackHeader>
            <LoadingIndicator loading={loading} >
                <FlatList
                    data={announcements}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Box variant={'card'} mx={4} mt={3} >
                            <Stack space={1} >
                                <Heading size={'sm'} >{item.title}</Heading>
                                <Text>{item.description}</Text>
                            </Stack>
                            {
                                (context.stateUser.user.CanUpdateAnnouncement == 'True' || context.stateUser.user.CanDeleteAnnouncement == 'True') &&
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
                                    <Menu.Item onPress={() => setData({
                                        title: item.title,
                                        description: item.description
                                    })} >Details</Menu.Item>
                                    <Menu.Item onPress={() => navigation.navigate('Add Announcement Screen', { updateData: item })} >Edit</Menu.Item>
                                    <Menu.Item onPress={() => setDeleteID(item.id)} >Delete</Menu.Item>
                                </Menu>
                            }
                        </Box>
                    )}
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={<Box mb={'32'} ></Box>}
                    refreshing={loading}
                    onRefresh={loadAnnouncements}
                />

            </LoadingIndicator>

            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Announcement</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Announcement?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {data && (
                <Modal
                    isOpen={Boolean(data)}
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
                                onPress={() => setData(null)}
                            />
                            <Center >
                                <Heading>{data.title}</Heading>
                            </Center>
                            <Text>
                                {data.description}
                            </Text>
                        </Stack>
                    </Box>
                    {/* <Button
                            variant={'subtle'}
                            colorScheme={'error'}
                            mb={2}
                            onPress={() => onRead(data.id)}
                        >Read</Button> */}

                </Modal>
            )}
            
            {
                context.stateUser.user.CanAddAnnouncement &&
                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Announcement Screen", { updateData: null })}
                />
            }
        </Box >
    )
}


const mapStateToProps = state => {
    return {
        announcements: state.admin.announcements
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllAnnouncement: (data) => dispatch(getAllAnnouncement(data)),
        deleteAnnouncement: (data) => dispatch(deleteAnnouncement(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementScreen)

