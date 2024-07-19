import React, { useContext, useEffect, useState } from 'react'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Button, Box, FlatList, Heading, Modal, Stack, Text, useToast, Fab, Icon, Menu } from 'native-base'


// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import moment from 'moment'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import LoanCard from '../../../../../components/Cards/LoanCard'
import BackHeader from '../../../../../components/BackHeader'

// Redux 
import { connect } from 'react-redux'
import { deleteLoan, getAllLoans, getAllSites } from '../../../../../redux/actions/adminActions'
import AuthGlobal from '../../../../../context/store/AuthGlobal'

const LoanScreen = (props) => {

    const {
        loans,
        sites,
        getAllLoans,
        getAllSites,
        deleteLoan
    } = props

    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [refetch, setRefetch] = useState(0)
    const [sortedBy, setSortedBy] = useState()
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})


    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
        setFilter(false)
        setFilterValues({})
    })


    const loadData = async (params) => {
        setLoading(true)
        try {
            await getAllLoans(params)
            await getAllSites({
                fromDate: null,
                toDate: null,
                name: '',
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
            await deleteLoan(deleteID)
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
        loadData({
            name: '',
            loanDate: null,
        })

    }, [refetch])



    const renderLoans = () => {
        switch (sortedBy) {
            case 'date':
                return loans.sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate));
            case 'name':
                return loans.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return loans
        }
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Employees Loan</BackHeader>

            <ListingOptionsCard
                totalResults={loans.length}
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
                <Stack space={4} >
                    <FlatList
                        data={renderLoans()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <Box variant={'card'} mx={4} my={2} >
                                <LoanCard data={item} index={index} isList={true} onDelete={onDelete} setDeleteID={setDeleteID} />
                            </Box>
                        )}
                        keyExtractor={(item) => item.loanId}
                        ListFooterComponent={<Box mb={'32'} ></Box>}
                        refreshing={loading}
                        onRefresh={() => loadData({
                            employeeName: '',
                            loanDate: null,
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
                                label: 'Employee Name',
                                key: 'name',
                                value: filterValue.name
                            },
                            {
                                label: 'Loan Date',
                                type: 'datetime',
                                mode: 'date',
                                key: 'fromDate',
                                value: filterValue.fromDate
                            }
                        ]}
                        datePickers={[
                            { fromDate: false },
                        ]}
                        onFilter={(values) => (
                            loadData(values),
                            setFilterValues(values),
                            setFilter(true)
                        )}
                        setFilter={setFilter}
                    />
                </Stack>

            </LoadingIndicator>
            
            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Loan</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Loan?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {
                context.stateUser.user.CanAddLoan == 'True' &&
                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Loan Screen", { updateData: null })}
                />
            }

        </Box>
    )
}


const mapStateToProps = state => {
    return {
        loans: state.admin.loans.list,
        sites: state.admin.sites,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllLoans: (data) => dispatch(getAllLoans(data)),
        deleteLoan: (data) => dispatch(deleteLoan(data)),
        getAllSites: (data) => dispatch(getAllSites(data)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoanScreen)

