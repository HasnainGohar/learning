import React, { useContext, useEffect, useState } from 'react'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Box, Button, IconButton, FlatList, Heading, HStack, Stack, Text, useToast, Fab, Icon, Modal, Menu } from 'native-base'

// Context 
import AuthGlobal from '../../../../../context/store/AuthGlobal'
import baseURL from '../../../../../assets/common/baseURL'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import moment from 'moment'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import BackHeader from '../../../../../components/BackHeader'

// Redux 
import { connect } from 'react-redux'
import { deleteUser, getAllSites, getAllUsers } from '../../../../../redux/actions/adminActions'


const UserScreen = (props) => {

    const {
        users,
        getAllUsers,
        getAllSites,
        sites,
        deleteUser
    } = props



    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)


    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteID, setDeleteID] = useState(false)
    const [show, setShow] = useState(false)
    const [refetch, setRefetch] = useState(0)
    const [sortedBy, setSortedBy] = useState()
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})

    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
        setFilter(false)
        setFilterValues({})
    })

    const loadUsers = async (params) => {
        setLoading(true)
        try {
            const res = await getAllUsers({
                siteId: params.siteId ? params.siteId : null,
                firstName: params.firstName ? params.firstName : null,
                fromDate: params.fromDate ? params.fromDate : null,
                toDate: params.toDate ? params.toDate : null,
            })

        } catch (e) {
            console.log(e, 'user')
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }

    const loadData = async () => {
        setLoading(true)
        try {
            await getAllSites({
                name: null,
                fromDate: null,
                toDate: null,
            })
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
            await deleteUser(deleteID)
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteID(null)
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        loadUsers({
            siteId: null,
            firstName: null,
            fromDate: null,
            toDate: null,
        })
        loadData()

    }, [refetch])

    const renderUsers = () => {
        switch (sortedBy) {
            case 'date':
                return users.sort((a, b) => new Date(b.DOC) - new Date(a.DOC));
            case 'name':
                return users.sort((a, b) => a.firstName.localeCompare(b.firstName));
            default:
                return users
        }
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Users</BackHeader>

            <ListingOptionsCard
                totalResults={users.length}
                filter={filter}
                onFilterPress={() => setShow(true)}
                sort={
                    <Menu trigger={triggerProps => {
                        return <Button
                            variant={'ghost'}
                            size={'sm'}
                            leftIcon={<Icon as={MaterialCommunityIcons} name={'sort'} />}
                            {...triggerProps}
                        >Sort</Button>
                    }} >
                        <Menu.Item onPress={() => setSortedBy('name')}  >Sort by Name</Menu.Item>
                        <Menu.Item onPress={() => setSortedBy('date')}   >Sort by Date</Menu.Item>
                    </Menu>
                }
            />
            <LoadingIndicator loading={loading} >
                <FlatList
                    data={renderUsers()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Box variant={'card'} mx={4} mt={3} p={0} >
                            <HStack space={2} >
                                <Stack width={70} alignItems={'center'} justifyContent={'center'} backgroundColor={'#36294f'} borderTopLeftRadius={14} borderLeftRadius={14} >
                                    <Avatar
                                    source={{ uri: `${baseURL}${item.image.substring(2)}` }}
                                    >
                                    </Avatar>
                                </Stack>
                                <Stack ml={-2} width={1} backgroundColor={'#9580d6'} />
                                <Stack py={2}>
                                    <Heading size={'sm'} >{item.firstName} {item.lastName}</Heading>
                                    <Text fontSize={12} >{item.email}</Text>
                                    <Text fontSize={12} >{item.phone}</Text>
                                </Stack>
                            </HStack>

                            {(context.stateUser.user.CanUpdateUser == 'True' || context.stateUser.user.CanDeleteUser == 'True') &&
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
                                    {/* <Menu.Item>Details</Menu.Item> */}
                                    {context.stateUser.user.CanUpdateUser == 'True' && <Menu.Item onPress={() => navigation.navigate('Add User Screen', { updateData: item })} >Edit</Menu.Item>}
                                    {context.stateUser.user.CanDeleteUser == 'True' && <Menu.Item onPress={() => setDeleteID(item.id)} >Delete</Menu.Item>}
                                </Menu>
                            }
                        </Box>
                    )}
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={<Box mb={'40'} ></Box>}
                    refreshing={loading}
                    onRefresh={() => loadUsers({
                        siteId: null,
                        firstName: null,
                        fromDate: null,
                        toDate: null,
                    })}
                />
                <FilterModal
                    show={show}
                    setShow={setShow}
                    inputs={[
                        {
                            label: 'Site',
                            type: 'select',
                            values: sites,
                            selectLabel: 'name',
                            key: 'siteId',
                            value: filterValue.siteId
                        },
                        {
                            label: 'User Name',
                            key: 'firstName',
                            value: filterValue.firstName
                        },
                        {
                            label: 'From Date',
                            type: 'datetime',
                            mode: 'date',
                            key: 'fromDate',
                            value: filterValue.fromDate
                        },
                        {
                            label: 'To Date',
                            type: 'datetime',
                            mode: 'date',
                            key: 'toDate',
                            value: filterValue.toDate

                        }
                    ]}
                    datePickers={[
                        { fromDate: false },
                        { toDate: false },
                    ]}
                    onFilter={(values) => (
                        loadUsers(values),
                        setFilterValues(values),
                        setFilter(true)
                    )}
                    setFilter={setFilter}
                />

                <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                    <Modal.Content>
                        <Modal.Header>
                            <Heading>Delete User</Heading>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <Text>Are you sure want to delete this user?</Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </LoadingIndicator>
            {
                context.stateUser.user.CanAddUser == 'True' &&
                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add User Screen", { updateData: null })}
                />
            }
        </Box >
    )
}


const mapStateToProps = state => {
    return {
        users: state.admin.users,
        sites: state.admin.sites
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllUsers: (data) => dispatch(getAllUsers(data)),
        getAllSites: (data) => dispatch(getAllSites(data)),
        deleteUser: (data) => dispatch(deleteUser(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)

