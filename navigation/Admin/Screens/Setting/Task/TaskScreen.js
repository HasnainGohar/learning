import React, { useContext, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Box, Button, IconButton, FlatList, Heading, HStack, Stack, Text, useToast, Fab, Icon, Modal, Menu, ScrollView } from 'native-base'

// Context 
import AuthGlobal from '../../../../../context/store/AuthGlobal'

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
import { getAllSites, getAllTask, deleteTask, getTaskChart, getAllEmployees } from '../../../../../redux/actions/adminActions'

// chart
import { PieChart, StackedBarChart } from 'react-native-chart-kit'


const width = Dimensions.get('window').width


const UserScreen = (props) => {

    const {

        tasks,
        getAllTask,
        sites,
        deleteTask,
        getTaskChart,
        taskChart,
        getAllEmployees,
        employees
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

    const loadData = async (values) => {
        setLoading(true)
        try {
            await getAllTask({
                siteId: values.siteId ? values.siteId : null,
                id: null,
                fromDate: values.fromDate ? values.fromDate : null,
                toDate: values.toDate ? values.toDate : null,
                status: ''
            })
            await getTaskChart({
                siteId: values.siteId ? values.siteId : null,
                fromDate: values.fromDate ? values.fromDate : null,
                toDate: values.toDate ? values.toDate : null,
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
            await deleteTask(deleteID)
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteID(null)
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        loadData({})
    }, [refetch])


    const stackBarData = {
        labels: taskChart.chart?.map(item => item.monthName.substring(0, 3)) || [],
        legends: [
            {
                title: "Completed",
                color: '#a7f3d0'
            },
            {
                title: "Pending",
                color: '#fecdd3'
            },
            // {
            //     title: "Late",
            //     color: '#fed7aa'
            // },
            // {
            //     title: "Leave",
            //     color: '#e6cefa'
            // }
        ],
        data: taskChart.chart?.map(item => [
            item.completedTasks,
            item.pendingTasks,
        ]) || [],
        barColors: ['#a7f3d0', '#fecdd3'],
    };


    const inputs = [
        {
            label: 'Site',
            type: 'select',
            values: sites,
            selectLabel: 'name',
            key: 'siteId',
            value: filterValue.siteId
        },
        {
            label: 'Employees',
            type: 'select',
            key: 'id',
            values: employees,
            selectLabel: 'name',
            value: filterValue.id
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
    ]

    const renderTasks = () => {
        if (!tasks.list) return null
        switch (sortedBy) {
            case 'name':
                tasks.list.sort((a, b) => a.name.localeCompare(b.name));
            case 'date':
                return tasks.list.sort((a, b) => new Date(b.toDate) - new Date(a.toDate));
            default:
                tasks.list
                break
        }
        return tasks.list?.map((item, index) => (
            <Box variant={'card'} mx={4} key={index} >
                <Stack space={1} >
                    <Heading size={'md'}  >{item.name}</Heading>
                    <Text>
                        {item.description.length > 50 ? `${item.description.substring(0, 30)}...` : item.description}
                    </Text>

                    <Text>{moment(item.toDate).format('DD-MM-YYYY')}</Text>
                    <Text>{item.status}</Text>
                </Stack>

                {(context.stateUser.user.CanUpdateTask == 'True' || context.stateUser.user.CanDeleteTask == 'True') &&
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
                        <Menu.Item onPress={() => navigation.navigate('Task Details Screen', { updateData: item })} >Details</Menu.Item>
                        {context.stateUser.user.CanUpdateTask == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Task Screen', { updateData: item.taskId })} >Edit</Menu.Item>}
                        {context.stateUser.user.CanDeleteTask == 'True' && <Menu.Item onPress={() => setDeleteID(item.taskId)} >Delete</Menu.Item>}
                    </Menu>
                }
            </Box>
        ))
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Tasks</BackHeader>

            <ListingOptionsCard
                totalResults={tasks?.list?.length}
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
                <ScrollView showsVerticalScrollIndicator={false} >
                    <Stack space={4} mb={'32'} mt={3}>
                        <Box mx={4} p={0} variant={'card'}>
                            <HStack p={2} borderTopRadius={14} justifyContent={'space-between'} alignItems={'center'} mb={2} backgroundColor={'#36294f'} >
                                <Heading size={'md'} fontSize={18} color={'white'}  >Monthly stats</Heading>
                                <Text color={'white'}  >{filterValue.fromDate ? moment(filterValue.fromDate).format('YYYY') : moment(new Date()).format('YYYY')}</Text>
                            </HStack>
                            <Stack mt={-2} height={1} backgroundColor={'#9580d6'} />
                            <Box mb={4} />
                            <StackedBarChart
                                data={stackBarData}
                                width={width / 1.2}
                                height={270}
                                showLegend={false}
                                decimalPlaces={0}
                                chartConfig={{
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                                    strokeWidth: 2,
                                    barPercentage: 0.5,
                                    // formatXLabel: (xLabel) => Math.round(chartData.labels[xLabel]).toString(),
                                    formatYLabel: (yLabel) => Math.round(yLabel).toString(),
                                    verticalLabelRotation: 90
                                }}

                            />
                        </Box>
                        {renderTasks()}
                    </Stack>
                </ScrollView>
            </LoadingIndicator >

            <FilterModal
                show={show}
                setShow={setShow}
                inputs={inputs}
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

            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Task</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Task?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {
                context.stateUser.user.CanAddTask == 'True' &&
                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Task Screen", { updateData: null })}
                />
            }
        </Box >
    )
}


const mapStateToProps = state => {
    return {
        tasks: state.admin.tasks,
        sites: state.admin.sites,
        taskChart: state.admin.taskChart,
        employees: state.admin.employees
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllTask: (data) => dispatch(getAllTask(data)),
        getTaskChart: (data) => dispatch(getTaskChart(data)),
        getAllSites: (data) => dispatch(getAllSites(data)),
        deleteTask: (data) => dispatch(deleteTask(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)

