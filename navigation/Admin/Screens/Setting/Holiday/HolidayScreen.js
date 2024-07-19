import React, { useContext, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

// React navigation
import { useNavigation } from '@react-navigation/native'

//context
import AuthGlobal from '../../../../../context/store/AuthGlobal'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Native Base
import { Menu, Modal, Box, IconButton, Divider, Fab, FlatList, Heading, HStack, Icon, Stack, Text, useToast, Button } from 'native-base'

// Components
import moment from 'moment'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import BackHeader from '../../../../../components/BackHeader'

// Redux 
import { connect } from 'react-redux'
import { deletePublicHoliday, getAllHolidays } from '../../../../../redux/actions/adminActions'

const HolidayScreen = (props) => {

    const navigation = useNavigation()

    const {
        holidays,
        sites,
        getAllHolidays,
        deleteHoliday
    } = props
    const toast = useToast()

    const context = useContext(AuthGlobal)

    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [refetch, setRefetch] = useState(0)
    const [sortedBy, setSortedBy] = useState()
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})



    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
        setFilter(false)
        setFilterValues({})
    })

    const loadHolidays = async (params) => {
        setLoading(true)
        try {
            await getAllHolidays(params)
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
            await deleteHoliday(deleteID)
            setDeleteID(null)
        } catch (error) {
            console.log(error)
        }
        finally {
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        loadHolidays({
            name: null,
            fromDate: null,
            toDate: null,
            siteId: null
        })
    }, [refetch])

    const renderItem = (item) => {
        return (
            <Box variant={'card'} mx={4} mt={4} >
                <Stack space={2} >
                    <HStack justifyContent={'space-between'} alignItems={'center'} >
                        <Heading size={'md'} >{item.name}</Heading>
                    </HStack>
                    <Text>{item.description}</Text>
                    {moment(item.fromDate).format('DD-MM-YYYY') === moment(item.toDate).format('DD-MM-YYYY') ? (
                        <Text>{moment(item.fromDate).format('DD-MM-YYYY')}</Text>
                    ) : (
                        <HStack space={2} alignItems={'center'} >
                            <Text>{moment(item.fromDate).format('DD-MM-YYYY')}</Text>
                            <Divider w={4} />
                            <Text>{moment(item.toDate).format('DD-MM-YYYY')}</Text>
                        </HStack>
                    )}
                </Stack>
                {
                    (context.stateUser.user.CanUpdateOfficeHoliday == 'True' || context.stateUser.user.CanDeleteOfficeHoliday == 'True') &&
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
                        {context.stateUser.user.CanUpdateOfficeHoliday == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Holiday Screen', { updateData: item })} >Edit</Menu.Item>}
                        {context.stateUser.user.CanDeleteOfficeHoliday == 'True' && <Menu.Item onPress={() => setDeleteID(item.id)} >Delete</Menu.Item>}
                    </Menu>
                }

            </Box>
        )
    }

    const renderHolidays = () => {
        switch (sortedBy) {
            case 'date':
                return holidays.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate));
            case 'name':
                return holidays.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return holidays
        }
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader >Public Holidays</BackHeader>

            <ListingOptionsCard
                totalResults={holidays.length}
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
                        data={renderHolidays()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => renderItem(item)}
                        keyExtractor={(item) => item.id}
                        ListFooterComponent={<Box mb={'32'} ></Box>}
                        refreshing={loading}
                        onRefresh={() => loadHolidays({
                            name: null,
                            fromDate: null,
                            toDate: null,
                            siteId: null
                        })}
                    />
            </LoadingIndicator>

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
                        label: 'Holiday Name',
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
                    loadHolidays(values),
                    setFilterValues(values),
                    setFilter(true)
                )}
                setFilter={setFilter}
            />


            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Holiday</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Holiday?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {
                context.stateUser.user.CanAddOfficeHoliday == 'True' && <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Holiday Screen", { updateData: null })}
                />
            }

        </Box>
    )
}


const mapStateToProps = state => {
    return {
        holidays: state.admin.holidays,
        sites: state.admin.sites
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllHolidays: (data) => dispatch(getAllHolidays(data)),
        deleteHoliday: (data) => dispatch(deletePublicHoliday(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HolidayScreen)

