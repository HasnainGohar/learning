import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

//Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Badge, Box, Center, Divider, Fab, FlatList, Heading, IconButton, Icon, Stack, Text, useToast, Modal, Menu, Button, HStack } from 'native-base'


// Icons
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


// Components
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import BackHeader from '../../../../../components/BackHeader'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import AuthGlobal from '../../../../../context/store/AuthGlobal'

// Redux 
import { connect } from 'react-redux'
import { deletePosition, getAllPositions } from '../../../../../redux/actions/adminActions'

const PositionScreen = (props) => {

    const { positions, getAllPositions, deletePosition } = props



    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [refetch, setRefetch] = useState(0)
    const [show, setShow] = useState(false)
    const [sortedBy, setSortedBy] = useState('')
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})

    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
        setFilter(false)
        setFilterValues({})
    })

    const loadPositions = async (values) => {
        setLoading(true)
        try {
            await getAllPositions(values)
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
            await deletePosition(deleteID)
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


    useEffect(() => {
        loadPositions({
            positionId: 0,
            name: '',
        })
    }, [refetch])

    const renderPositions = () => {
        switch (sortedBy) {
            case 'date':
                return positions.sort((a, b) => new Date(b.DOC) - new Date(a.DOC));
            case 'name':
                return positions.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return positions
        }
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Positions</BackHeader>
            <ListingOptionsCard
                totalResults={positions.length}
                filter={filter}
                onFilterPress={() => setShow(true)}
                sort={<Menu trigger={triggerProps => {
                    return <Button
                        variant={'ghost'}
                        size={'sm'}
                        leftIcon={<Icon as={MaterialCommunityIcons} name={'sort'} />}
                        {...triggerProps}
                    >Sort</Button>
                }} >
                    <Menu.Item onPress={() => setSortedBy('name')}  >Sort by Name</Menu.Item>
                    <Menu.Item onPress={() => setSortedBy('date')}   >Sort by Date</Menu.Item>
                </Menu>}
            />

            <LoadingIndicator loading={loading} >
                <FlatList
                    data={renderPositions()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Box variant={'card'} mx={4} mt={4} >
                            <Stack space={1} >
                                <Heading size={'sm'} >{item.name}</Heading>
                                <Text>{item.description}</Text>
                            </Stack>
                            {
                                (context.stateUser.user.CanUpdatePosition == 'True' || context.stateUser.user.CanDeletePosition == 'True') &&
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
                                    {context.stateUser.user.CanUpdatePosition == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Position Screen', { updateData: item })} >Edit</Menu.Item>}
                                    {context.stateUser.user.CanDeletePosition == 'True' && <Menu.Item onPress={() => setDeleteID(item.positionId)} >Delete</Menu.Item>}
                                </Menu>
                            }
                        </Box>
                    )}
                    keyExtractor={(item) => item.positionId}
                    ListFooterComponent={<Box mb={'32'} ></Box>}
                    refreshing={loading}
                    onRefresh={() => loadPositions({
                        positionId: 0,
                        name: '',
                    })}

                />
            </LoadingIndicator>

            <FilterModal
                show={show}
                setShow={setShow}
                inputs={[
                    {
                        label: 'Name',
                        key: 'name',
                        value: filterValue.name
                    }
                ]}
                onFilter={(values) => (
                    loadPositions({
                        ...values,
                        positionId: 0
                    }),
                    setFilterValues(values),
                    setFilter(true)
                )}
                setFilter={setFilter}
            />

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

            {
                context.stateUser.user.CanAddPosition == 'True' &&
                < Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Position Screen", { updateData: null })}
                />

            }
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        positions: state.admin.positions
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getAllPositions: (data) => dispatch(getAllPositions(data)),
        deletePosition: (data) => dispatch(deletePosition(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionScreen)