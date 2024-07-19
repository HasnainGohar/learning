import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Dimensions } from 'react-native'


// Navigation
import { useNavigation } from '@react-navigation/native'
import baseURL from '../../../../../assets/common/baseURL'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Native Base
import { Box, Stack, useToast, Fab, Icon, Menu, Button, HStack, Heading, Text, Avatar, Pressable, ScrollView, Divider, Center, } from 'native-base'


// Redux 
import { connect } from 'react-redux'
import { getAllLeaves, getAllSites, getLeaveDashboard, getLeaveRequests } from '../../../../../redux/actions/adminActions'

// Charts
import { LineChart } from 'react-native-chart-kit'

// Components
import moment from 'moment'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import BackHeader from '../../../../../components/BackHeader'
import PendingRequests from '../../Home/PendingRequests'
import StatusCircle from '../../../../../components/StatusCircle'
import CircularProgress from '../../../../../components/CircularProgress'
import Card from '../../../../../components/Card'
import ListCard from '../../../../../components/Cards/ListCard'

const width = Dimensions.get('window').width

const LeaveDashboardScreen = (props) => {

    const {
        leaves,
        sites,
        getAllSites,
        leaveRequests,
        getLeaveDashboard,
        dashboardData,
    } = props

    const toast = useToast()
    const navigation = useNavigation()
    const width = Dimensions.get('window').width


    const [loading, setLoading] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false);
    const [show, setShow] = useState(false)
    const [refetch, setRefetch] = useState(0)
    const [sortedBy, setSortedBy] = useState()
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})
    const [selectedValue, setSelectedValue] = useState(null);


    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
        setFilter(false)
        setFilterValues({})
    })


    const loadData = async (params) => {
        setLoading(true)
        setDataLoaded(false)
        try {
            await getAllSites({
                fromDate: filterValue.fromDate ? filterValue.fromDate : null,
                toDate: filterValue.toDate ? filterValue.toDate : null,
                name: filterValue.name ? filterValue.name : '',
            })
            await getLeaveDashboard({
                siteId: params.siteId ? params.siteId : 0,
                date: params.fromDate ? new Date(params.fromDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            })
            setDataLoaded(true)
        } catch (e) {
            console.log(e)
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
            setDataLoaded(false)
        }
    }

    useEffect(() => {
        loadData({
            fromDate: null,
            siteId: null,
        })
    }, [refetch])

    const chartData = {
        labels: dashboardData?.monthlyStats?.map(item => item.month.substring(0, 3)) || [],
        datasets: [
            {
                data: dashboardData?.monthlyStats?.map((item) => item.leaves) || [],
                color: (opacity = 1) => `rgba(165, 55, 253, ${opacity})`,
                strokeWidth: 2,
                legend: "Leave",
                legentColor: 'rgba(165, 55, 253,1)'
            }
        ],
    }


    const handleDataPointClick = (data) => {
        const { value, x, y, dataset, getColor } = data;
        setSelectedValue({ value, x, y, dataset, color: getColor(1) });
    };

    const renderEmployees = () => {
        if (!dashboardData.companyStats) return null
        switch (sortedBy) {
            case 'name':
                dashboardData.companyStats.sort((a, b) => a.name.localeCompare(b.name));
            default:
                dashboardData.companyStats
                break
        }
        return dashboardData?.companyStats?.map((item, index) => {
            return (
                <Pressable key={index} onPress={() => navigation.navigate('Employee Leave Stats', { employeeData: item })} >
                    {/* <Box variant={'card'} mx={4} p={0} >
                        <HStack space={0}>
                            <Stack
                                alignItems={'center'}
                                justifyContent={'center'}
                                width={70}
                                backgroundColor={'#36294f'}
                                borderTopLeftRadius={14}
                                borderLeftRadius={14} >
                                <Avatar source={{ uri: `${baseURL}${item.image.substring(2)}` }} />
                            </Stack>
                            <Stack width={1} backgroundColor={'#9580d6'} />

                        </HStack>
                    </Box> */}
                    <ListCard
                        image={item.image}

                    >
                        <HStack justifyContent={'space-between'} alignItems={'center'} >
                            <Stack ml={2} space={1} py={2}>
                                <Heading size={'sm'}>{item.name}</Heading>
                                <Text>{item.email.length > 25 ? item.email.substring(0, 25) + '...' : item.email}</Text>
                                <Text>Leaves: {item.leavesTaken}/{item.allocatedLeaves}</Text>
                            </Stack>
                        </HStack>

                    </ListCard>
                </Pressable>
            )
        }
        )
    }


    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader >Leaves Dashboard</BackHeader>

            <ListingOptionsCard
                totalResults={dashboardData?.companyStats && dashboardData?.companyStats.length}
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
                    <Menu.Item onPress={() => setSortedBy('date')}   >Sort by Date</Menu.Item>
                </Menu>}
            />



            <LoadingIndicator loading={loading} >
                <ScrollView showsVerticalScrollIndicator={false}>

                    <Stack my={3} space={4} >
                        <Card
                            heading={'Monthly stats'}
                            subheading={filterValue.fromDate ? moment(filterValue.fromDate).format('YYYY') : moment(new Date()).format('YYYY')}
                        >
                            <LineChart
                                data={chartData}
                                width={width / 1.1}
                                height={250}
                                chartConfig={{
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                                    strokeWidth: 2,
                                    decimalPlaces: 0,
                                    useShadowColorFromDataset: false,
                                    formatYLabel: (yLabel) => Math.round(yLabel),
                                }}
                                onDataPointClick={handleDataPointClick}
                                bezier
                                decimal={false}
                                withShadow={false}
                                withDots={true}
                                verticalLabelRotation={90}
                                style={{
                                    top: -4,
                                    left: -20,
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#ffa726"
                                    }
                                }}
                            />


                            {selectedValue && (
                                <Box
                                    style={{
                                        position: 'absolute',
                                        left: selectedValue.x - 30,
                                        top: selectedValue.y + 60,
                                        backgroundColor: '#e5e5e5',
                                        padding: 2,
                                        paddingHorizontal: 4,
                                        borderRadius: 13
                                    }}
                                >
                                    <Text>{selectedValue.value} {selectedValue.dataset.legend}s</Text>
                                </Box>
                            )}

                        </Card>

                        {dashboardData.companyStats && renderEmployees()}
                    </Stack>
                </ScrollView>
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
                        label: 'From Date',
                        type: 'datetime',
                        mode: 'date',
                        key: 'fromDate',
                        value: filterValue.fromDate


                    },
                ]}
                datePickers={[
                    { fromDate: false },
                    { toDate: false }
                ]}
                onFilter={(values) => (
                    loadData(values),
                    setFilterValues(values),
                    setFilter(true)
                )}
                setFilter={setFilter}
            />

            <Fab
                renderInPortal={false}
                icon={<Icon as={AntDesign} name={'plus'} />}
                onPress={() => navigation.navigate("Add Leave Screen")}
            />
        </Box>
    )
}


const mapStateToProps = state => {
    return {
        dashboardData: state.admin.leavesDashboard,
        leaveRequests: state.admin.dashboard.leaveRequests,
        sites: state.admin.sites,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllLeaves: (data) => dispatch(getAllLeaves(data)),
        getAllSites: (data) => dispatch(getAllSites(data)),
        getLeaveRequests: () => dispatch(getLeaveRequests()),
        getLeaveDashboard: (data) => dispatch(getLeaveDashboard(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaveDashboardScreen)
