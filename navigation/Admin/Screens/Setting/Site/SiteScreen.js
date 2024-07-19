import React, { useContext, useEffect, useState } from 'react'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, IconButton, Box, Menu, FlatList, Heading, HStack, Stack, Text, useToast, Fab, Icon, Modal, Button } from 'native-base'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'

// Redux 
import { connect } from 'react-redux'
import { getAllSites, deleteSite } from '../../../../../redux/actions/adminActions'
import BackHeader from '../../../../../components/BackHeader'
import baseURL from '../../../../../assets/common/baseURL'
import AuthGlobal from '../../../../../context/store/AuthGlobal'

const SiteScreen = (props) => {

    const {
        sites,
        getAllSites,
        deleteSite
    } = props

    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [show, setShow] = useState(false)
    const [sortedBy, setSortedBy] = useState()
    const [refetch, setRefetch] = useState(0)
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})


    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
        setFilter(false)
        setFilterValues({})
    })


    const loadSites = async (params) => {
        setLoading(true)
        try {
            await getAllSites(params)
        } catch (e) {
            console.log(e, 'site list error')
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
            await deleteSite(deleteID)
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteLoading(false)
            setDeleteID(null)
        }
    }

    useEffect(() => {
        loadSites({
            fromDate: null,
            toDate: null,
            name: null
        })
    }, [refetch])

    const renderSites = () => {
        switch (sortedBy) {
            case 'date':
                return sites.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'name':
                return sites.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return sites
        }
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Sites</BackHeader>

            <ListingOptionsCard
                totalResults={sites.length}
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
                    data={renderSites()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Box variant={'card'} mx={4} mt={4} p={0} >
                            <HStack space={2}>
                                <Stack width={70} alignItems={'center'} justifyContent={'center'} backgroundColor={'#36294f'} borderTopLeftRadius={14} borderLeftRadius={14} >
                                    <Avatar
                                        source={{ uri: `${baseURL}${item.logo.substring(2)}` }}
                                    />
                                </Stack>
                                <Stack ml={-2} width={1} backgroundColor={'#9580d6'} />
                                <Stack py={2}  >
                                    <Heading size={'sm'} >{item.name}</Heading>
                                    <Text fontSize={12}>{item.phone}</Text>
                                    <Text fontSize={12}>{item.address}</Text>
                                </Stack>
                            </HStack>
                            {
                                (context.stateUser.user.CanUpdateSite == 'True' || context.stateUser.CanDeleteSite == 'True') &&
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
                                    {context.stateUser.user.CanUpdateSite == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Site Screen', { updateData: item })} >Edit</Menu.Item>}
                                    {context.stateUser.user.CanDeleteSite == 'True' && <Menu.Item onPress={() => setDeleteID(item.siteId)} >Delete</Menu.Item>}
                                </Menu>
                            }
                        </Box>
                    )}
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={<Box mb={'32'} ></Box>}
                    refreshing={loading}
                    onRefresh={() => loadSites({
                        fromDate: null,
                        toDate: null,
                        name: null
                    })}
                />
            </LoadingIndicator>

            <FilterModal
                show={show}
                setShow={setShow}
                inputs={
                    [{
                        label: 'Site Name',
                        key: 'name',
                        value: filterValue.name
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
                    { toDate: false }
                ]}
                onFilter={(values) => (
                    loadSites(values),
                    setFilterValues(values),
                    setFilter(true)
                )}
                setFilter={setFilter}
            />

            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Site</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this site?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {
                context.stateUser.user.CanAddSite == 'True' &&

                < Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Site Screen", { updateData: null })}
                />
            }

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
        getAllSites: (data) => dispatch(getAllSites(data)),
        deleteSite: (data) => dispatch(deleteSite(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteScreen)

