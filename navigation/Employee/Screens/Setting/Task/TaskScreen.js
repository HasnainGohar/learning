import React, { useContext, useEffect, useState } from 'react'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Button, IconButton, FlatList, Heading, HStack, Stack, Text, useToast, Fab, Icon, Modal, Menu, ScrollView } from 'native-base'

// Context 
import AuthGlobal from '../../../../../context/store/AuthGlobal'

// Icon

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
import { getAllTasks } from '../../../../../redux/actions/employeeActions'



const UserScreen = (props) => {

    const {

        tasks,
        getAllTasks,
    } = props



    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)


    const [loading, setLoading] = useState(false)
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

    const loadData = async () => {
        setLoading(true)
        try {
            await getAllTasks()

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



    useEffect(() => {
        loadData()
    }, [refetch])



    const renderTasks = () => {
        if (!tasks) return null
        switch (sortedBy) {
            case 'name':
                return tasks.sort((a, b) => a.name.localeCompare(b.name));
            case 'date':
                return tasks.sort((a, b) => new Date(b.toDate) - new Date(a.toDate));
            default:
                return tasks
        }

    }

    const renderItem = ({ item }) => {
        return (
            <Box variant={'card'} mx={4} my={2}  >
                <Stack space={1} >
                    <Heading size={'md'}  >{item.name}</Heading>
                    <Text>
                        {item.description.length > 50 ? `${item.description.substring(0, 30)}...` : item.description}
                    </Text>

                    <Text>{moment(item.toDate).format('DD-MM-YYYY')}</Text>
                    <Text>{item.status}</Text>
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
                    <Menu.Item onPress={() => navigation.navigate('Task Details Screen', { data: item })} >Details</Menu.Item>
                </Menu>

            </Box>
        )
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <Stack space={4} >
                    <BackHeader>Tasks</BackHeader>

                    <ListingOptionsCard
                        totalResults={tasks?.length}
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

                    <FlatList
                        data={renderTasks()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        ListFooterComponent={<Box mb={'32'}></Box>}
                        refreshing={loading}
                        onRefresh={() => loadData()}
                    />

                </Stack >


                <FilterModal
                    show={show}
                    setShow={setShow}
                    inputs={[
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
                        setFilterValues(values),
                        setFilter(true),
                        loadData(values)
                    )}
                    setFilter={setFilter}
                />

            </LoadingIndicator >
        </Box >
    )
}

const mapStateToProps = state => {
    return {
        tasks: state.employee.tasks.list,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllTasks: (data) => dispatch(getAllTasks(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)

