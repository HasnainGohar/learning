import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Button, Center, Fab, FlatList, Heading, Icon, Input, Menu, Modal, Spinner, Stack, Text, useToast } from 'native-base'

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Redux
import { connect } from 'react-redux'
import { deleteEmployee, getAllEmployees, getAllSites } from '../../../../redux/actions/adminActions'

// Components
import FilterModal from '../../../../components/FilterModal'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../components/ListingOptionsCard'
import EmployeeCard from '../../../../components/Cards/EmployeeCard'
import AuthGlobal from '../../../../context/store/AuthGlobal'
import employee from '../../../../redux/reducers/employee'

const EmployeesScreen = (props) => {

    const {
        employees,
        sites,
        getAllSites,
        getAllEmployees,
        deleteEmployee,

    } = props

    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const [sortedBy, setSortedBy] = useState();
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [refetch, setRefetch] = useState(0)
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})
    const [searchTerm, setSearchTerm] = useState('')


    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
        setFilter(false)
        setFilterValues({})
        setSearchTerm('')
    })

    useEffect(() => {
        loadEmployees({
            firstName: null,
            fromDate: null,
            toDate: null,
            siteId: null,
        })
        loadData()
    }, [refetch])

    const loadEmployees = async (params) => {
        setLoading(true)
        try {
            await getAllEmployees(params)
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

    const loadData = async (params) => {
        setLoading(true)
        try {
            await getAllSites({
                fromDate: null,
                toDate: null,
                name: '',
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

    const onDelete = async () => {
        setDeleteLoading(true)
        try {
            await deleteEmployee(deleteID)
            setDeleteID(null)
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteLoading(false)
        }
    }

    const renderEmployees = () => {
        let filteredEmployees = [...employees];

        if (searchTerm) {
            filteredEmployees = filteredEmployees.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (sortedBy) {
            case 'DOJ':
                return filteredEmployees.sort(
                    (a, b) => new Date(b.DOJ) - new Date(a.DOJ)
                );
            case 'name':
                return filteredEmployees.sort((a, b) =>
                    a.firstName.localeCompare(b.firstName)
                );
            default:
                return filteredEmployees;
        }
    };


    return (
        <Box variant={'container'} safeAreaTop >

            <Stack space={4} >
                <Center>
                    <Heading >Employees</Heading>
                </Center>

                <ListingOptionsCard
                    totalResults={employees?.length}
                    onFilterPress={() => setShow(true)}
                    filter={filter}
                    sort={<Menu trigger={triggerProps => {
                        return <Button
                            variant={'ghost'}
                            size={'sm'}
                            leftIcon={<Icon as={MaterialCommunityIcons} name={'sort'} />}
                            {...triggerProps}
                        >Sort</Button>
                    }} >
                        <Menu.Item onPress={() => setSortedBy('name')}  >Sort by Name</Menu.Item>
                        <Menu.Item onPress={() => setSortedBy('DOJ')}   >Sort by Date of Joining</Menu.Item>
                    </Menu>}
                />

                <Input placeholder='Serach' mx={4} mb={3}
                    rightElement={<Icon as={MaterialCommunityIcons} name='account-search-outline' size={'lg'} mr={2} />}
                    onChangeText={(text) => setSearchTerm(text)}
                />
            </Stack>

            <LoadingIndicator loading={loading} >

                <FlatList
                    data={renderEmployees()}
                    renderItem={({ item, index }) => (
                        <EmployeeCard
                            key={index}
                            stats={true}
                            data={item}
                            index={index}
                            showMenu
                            onUpdate={() => navigation.navigate('Add Employee Screen', { updateData: item, })}
                            onDelete={() => setDeleteID(item.id)}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<Box mb={'32'} ></Box>}
                    refreshing={loading}
                    onRefresh={() => loadEmployees({
                        firstName: null,
                        fromDate: null,
                        toDate: null,
                        siteId: null,
                    })}
                />
            </LoadingIndicator>

            <FilterModal
                show={show}
                setShow={setShow}
                // loading={true}
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
                        label: 'Employee Name',
                        key: 'name',
                        value: filterValue.name
                    },
                    {
                        label: 'From Date',
                        type: 'datetime',
                        key: 'fromDate',
                        mode: 'date',
                        value: filterValue.fromDate

                    },
                    {
                        label: 'To Date',
                        type: 'datetime',
                        key: 'toDate',
                        mode: 'date',
                        value: filterValue.toDate

                    }
                ]}
                datePickers={[
                    { fromDate: false },
                    { toDate: false }
                ]}
                onFilter={(values) => (
                    loadEmployees(values),
                    setFilterValues(values),
                    setFilter(true)
                )}
                setFilter={setFilter}
            />
            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Employee</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this employee?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {
                context.stateUser.user.CanAddEmployee == 'True' &&
                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Employee Screen", { updateData: null })}
                />
            }



        </Box>
    )
}

const mapStateToProps = state => {
    return {
        employees: state.admin.employees,
        sites: state.admin.sites,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllSites: (data) => dispatch(getAllSites(data)),
        getAllEmployees: (data) => dispatch(getAllEmployees(data)),
        deleteEmployee: (data) => dispatch(deleteEmployee(data)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesScreen)