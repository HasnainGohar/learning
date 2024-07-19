import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import { Dimensions } from 'react-native'

// Navigation
import { useFocusEffect, useNavigation } from '@react-navigation/native'

// Native Base
import { Badge, Box, Button, Divider, Heading, HStack, Icon, IconButton, ScrollView, Stack, Text, useTheme, useToast, Modal, Input, Spinner, FlatList, Menu, leftIcon, Fab } from 'native-base'

// Native Base
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Date Time
import moment from 'moment'

// Redux
import { connect } from 'react-redux'
import { deleteRole, getAllRoles } from '../../../../../redux/actions/adminActions'


// Custom Component
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import BackHeader from '../../../../../components/BackHeader'
import AuthGlobal from '../../../../../context/store/AuthGlobal'

const RoleScreen = (props) => {

    const { getAllRoles, roles, deleteRole } = props

    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState(false)
    const [show, setShow] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [sortBy, setSortedBy] = useState()
    const [filterValue, setFilterValues] = useState({})
    const [refetch, setRefetch] = useState(0)

    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
    })


    const LoadData = async () => {
        setLoading(true)
        try {
            await getAllRoles({
                roleId: 0
            })
        } catch (error) {
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        LoadData()
    }, [refetch])

    const onDelete = async () => {
        setDeleteLoading(true)
        try {
            await deleteRole(deleteID)
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
        <Box variant={'container'} >
            <BackHeader>
                Role Screen
            </BackHeader>

            <ListingOptionsCard
                totalResults={roles.length}
                onFilterPress={() => setShow(true)}
                filter={filter}
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
            <LoadingIndicator loading={loading}>
                <FlatList
                    data={roles}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Box mx={4} variant={'card'} mt={3}  >
                            <Heading size={'sm'}> {item.name}</Heading>
                            <Text>{item.description}</Text>
                            {
                                (context.stateUser.user.CanUpdateRole == 'True' || context.stateUser.user.CanDeleteRole == 'True') &&
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
                                    {/* <Menu.Item onPress={() => navigation.navigate('Add Role Screen', { updateData: item })} >Edit</Menu.Item> */}
                                    {context.stateUser.user.CanUpdateRole == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Role Screen', { updateData: item })} >Edit</Menu.Item>}
                                    {context.stateUser.user.CanDeleteRole == 'True' && <Menu.Item onPress={() => setDeleteID(item.roleId)} >Delete</Menu.Item>}
                                </Menu>
                            }
                        </Box>
                    )}
                    keyExtractor={(item) => item.roleId}
                    ListFooterComponent={<Box mb={'32'} ></Box>}

                />
            </LoadingIndicator>

            {
                context.stateUser.user.CanAddRole == 'True' &&
                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Role Screen", { updateData: null })}
                />
            }

            <FilterModal
                show={show}
                setShow={setShow}
                inputs={[
                    {
                        label: 'Site',
                    },
                    {
                        label: 'From Date',

                    },
                ]}
                datePickers={[
                    { fromDate: false },
                    { toDate: false }
                ]}
                onFilter={(values) => (
                    // loadData(values),
                    setFilterValues(values),
                    setFilter(true)
                )}
                setFilter={setFilter}
            />

            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Role</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Role?</Text>
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
        roles: state.admin.roles
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllRoles: (data) => dispatch(getAllRoles(data)),
        deleteRole: (data) => dispatch(deleteRole(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleScreen)

