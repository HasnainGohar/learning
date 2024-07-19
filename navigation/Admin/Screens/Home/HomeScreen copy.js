import React, { useContext, useEffect, useState, useCallback, memo, useRef } from 'react'
import { Dimensions, ScrollView } from 'react-native'

import { useNavigation, useFocusEffect } from '@react-navigation/native'


// Native Base
import {
    Box,
    Button,
    Heading,
    HStack,
    Icon,
    Pressable,
    Spinner,
    Stack,
    Text,
    useToast,
    Image,
    Menu,
    Center,
    Divider,
    Checkbox,
    Badge
} from 'native-base'

// Icon 
import AntDesign from 'react-native-vector-icons/AntDesign'



// Date Time
import moment from 'moment'

// Chart
import { StackedBarChart } from 'react-native-chart-kit'

// Redux
import { connect } from 'react-redux'
import {
    getAllAttendance,
    getDashboard,
    getAllSites,

} from '../../../../redux/actions/adminActions'

// Context API
import AuthGlobal from '../../../../context/store/AuthGlobal'

// Components
import LoadingIndicator from '../../../../components/LoadingIndicator'
import AttendanceCard from '../../../../components/Cards/AttendanceCard'
import baseURL from '../../../../assets/common/baseURL'
import DashboardCalendar from '../../../../components/DashboardCalendar'
import PendingRequests from './PendingRequests'
import Card from '../../../../components/Card'


const width = Dimensions.get('window').width

const HomeScreen = (props) => {

    const { dashboard, attendance, leaveRequests, loanRequests, onBreakList, getAllAttendance, getDashboard, barChart, } = props

    const toast = useToast()
    const context = useContext(AuthGlobal)
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [filterLoading, setFilterLoading] = useState(false)
    const [dashboardLoading, setDashboardLoading] = useState(false)
    const [filter, setFilter] = useState('all')
    const [selectedDate, setSelectedDate] = useState(null)
    const [siteId, setSiteId] = useState((context.stateUser.user.IsMultiSite == 'True' || dashboard?.stats?.siteList.length > 1) ? 0 : context.stateUser.user.SiteId);
    const [SiteName, setSiteName] = useState((context.stateUser.user.IsMultiSite == 'True' || dashboard?.stats?.siteList.length > 1) ? 'All sites' : context.stateUser.user.SiteName);


    const workForceVerseLogo = require('../../../../assets/images/logo-icon-purple.png')
    const companyLogo = { uri: `${baseURL}${context.stateUser.user.CompanyLogo.substring(2)}` }

    useFocusEffect(
        useCallback(() => {
            onDateChanged(selectedDate);
        }, [onDateChanged, selectedDate])
    );

    useEffect(() => {
        // loadData()
    }, [])

    const statsLabel = [
        {
            title: 'Present',
            color: 'success',
            key: 'present'
        },
        {
            title: 'Absent',
            color: 'error',
            key: 'absent'
        },
        {
            title: 'Late',
            color: 'warning',
            key: 'late'
        },
        {
            title: 'Leave',
            color: 'violet',
            key: 'leave'
        },
    ]

    const attendanceFilters = [
        {
            title: 'Online',
        },
        {
            title: 'Break',
        },
        {
            title: 'Absent',
        },
        {
            title: 'Leave',
        },
        {
            title: 'Late',
        },
    ]


    const loadData = async () => {
        setLoading(true)
        try {
            await getDashboard({
                date: new Date(),
                siteId: siteId ? siteId : null

            })
            await getAllAttendance({
                fromDate: new Date(),
                toDate: new Date(),
                name: '',
                siteId: siteId
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


    const onDateChanged = useCallback(async (date) => {
        setFilterLoading(true);
        try {
            await getDashboard({
                date: date ? date : new Date(),
                siteId: siteId
            });
            await getAllAttendance({
                fromDate: date ? date : new Date(),
                toDate: date ? date : new Date(),
                name: '',
                siteId: siteId
            });
        } finally {
            setFilterLoading(false);
        }
    }, [siteId]);

    const loadDashboardData = async (siteValue) => {
        setDashboardLoading(true)
        try {
            await getDashboard({
                date: new Date(),
                siteId: siteValue ? siteValue : siteId
            });
            await getAllAttendance({
                fromDate: new Date(),
                toDate: new Date(),
                name: '',
                siteId: siteValue ? siteValue : siteId
            });
        } finally {
            setDashboardLoading(false);
        }
    };

    const todaysAttendance = () => {
        return (
            <Card
                heading={'Attendance'}
                subheading={selectedDate ? moment(new Date(selectedDate)).format('DD MMMM') : moment(new Date()).format('DD MMMM')}
            >
                <HStack justifyContent={'flex-end'} alignItems={'center'} mb={2} >
                    {/* <Heading size={'md'} color={'black'} fontSize={16} >Today's Attendance</Heading> */}
                    <HStack space={2} alignItems={'center'} >
                        {dashboardLoading && <Spinner />}
                        {filterLoading && <Spinner />}
                        <Text alignSelf={'flex-end'}></Text>
                    </HStack>

                </HStack>
                <HStack justifyContent={'center'} space={1.5} >
                    {statsLabel.map((item, index) => (
                        <Stack alignItems={'center'} space={2} key={index} >
                            <Pressable
                                variant={'subtle'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                bgColor={`${item.color}.100`}
                                style={{
                                    height: width / 5.4,
                                    width: width / 5.5,
                                    marginHorizontal: 4,
                                    borderRadius: 40
                                }}
                                onPress={() => navigation.navigate('Attendance Stats', { screenName: item?.title })}
                            >
                                {dashboard?.stats && <Heading color={`${item.color}.700`} fontSize={32} >{dashboard?.stats[item.key]}</Heading>}
                            </Pressable>
                            <Text color={`${item.color}.700`} >{item?.title}</Text>
                        </Stack>

                    ))}
                </HStack>
            </Card >
        )
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                {
                    (dashboard?.stats?.employeesLenght > 0 && dashboard.stats.positionsLenght > 0) ?
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Stack space={3}  >
                                <Image
                                    source={companyLogo ? companyLogo : workForceVerseLogo}
                                    resizeMode={'contain'}
                                    alt={`${context.stateUser.user.CompanyName} logo`}
                                    alignSelf={'center'}
                                    mx={4}
                                    style={{
                                        height: 80,
                                        width: '80%'
                                    }}
                                />
                                <Menu w="190" trigger={triggerProps => {
                                    return <Pressable ml={7} width={150} py={1}  {...triggerProps}>
                                        <HStack alignSelf={'center'} space={8} alignItems={'center'} >
                                            <Text fontSize={15} fontWeight={'400'} color={'primary.600'}>{SiteName}</Text>
                                            <Stack>
                                                <Icon as={AntDesign} name='up' size={'2xs'} />
                                                <Icon as={AntDesign} name='down' size={'2xs'} />
                                            </Stack>
                                        </HStack>
                                    </Pressable>;
                                }}>
                                    {
                                        (context.stateUser.user.IsMultiSite == 'True' || dashboard?.stats?.siteList.length > 1) &&
                                        <Menu.Item onPress={() => (loadDashboardData('0'), setSiteId(0), setSiteName('All sites'))} >
                                            All sites
                                        </Menu.Item>
                                    }
                                    {
                                        dashboard?.stats?.siteList?.map((item, index) => (
                                            <Menu.Item key={index} onPress={() => (setSiteName(item.name), loadDashboardData(item.siteId), setSiteId(item.siteId))}  >{item.name}</Menu.Item>
                                        ))
                                    }
                                </Menu>
                                {/* <Stack mt={0}>
                                    <Box
                                        variant={'card'}
                                        mx={4}
                                    >
                                        <DashboardCalendar setSelectedDate={setSelectedDate} onDateChanged={onDateChanged} />
                                    </Box>
                                </Stack> */}


                                {/* Todays Attendance */}
                                {todaysAttendance()}

                                {/*
                                    attendance?.length >= 1 &&
                                    <>
                                        <HStack mx={4} mt={2} space={4}  >
                                            <Button
                                                variant={'outline'}
                                                isPressed={filter === 'all'}
                                                onPress={() => setFilter('all')}
                                            >
                                                <Text>Online - {attendance.length}</Text>
                                            </Button>
                                            <Button
                                                variant={'outline'}
                                                isPressed={filter === 'onBreak'}
                                                onPress={() => setFilter('onBreak')}
                                            >
                                                <Text>On Break - {onBreakList?.length}</Text>
                                            </Button>
                                        </HStack>
                                        {filter === 'onBreak' ?
                                            onBreakList?.map((item, index) => (
                                                <AttendanceCard data={item} key={index} />
                                            )) :
                                            attendance?.map((item, index) => (
                                                <AttendanceCard data={item} key={index} />
                                            ))
                                        }
                                    </>
                                    */}

                                <Box
                                    // borderWidth={1}
                                    // borderColor={'primary.100'}
                                    variant={'card'}
                                    borderRadius={13}
                                    p={2}
                                    mx={4}
                                    mt={2}
                                >
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        <HStack
                                            space={1}
                                        >
                                            {attendanceFilters.map((item) => (
                                                <Box
                                                    mt={4}
                                                    mx={2}
                                                >
                                                    <Badge
                                                        variant={'subtle'}
                                                        borderRadius={15}
                                                        colorScheme={item.title === 'Online' ? 'primary' : 'trueGray'}
                                                        px={2.5}
                                                        py={1}
                                                        _text={{
                                                            fontSize: 16
                                                        }}

                                                    >{item.title}</Badge>
                                                    {item.title === 'Online' && <Badge
                                                        position={'absolute'}
                                                        top={-12}
                                                        right={-12}
                                                        borderRadius={15}
                                                        variant={'outline'}
                                                        colorScheme={'info'}
                                                        backgroundColor={'info.100'}
                                                        _text={{
                                                            fontSize: 12,
                                                            fontWeight: 'bold'
                                                        }}
                                                    >{attendance.length}</Badge>}
                                                </Box>
                                            ))}
                                        </HStack>
                                    </ScrollView>
                                </Box>

                                {/* Chart  */}
                                {/*barChart &&
                                    <Box variant={'card'} height={350} position={'relative'} mx={4} >
                                        <Stack space={4}>
                                            <HStack justifyContent={'space-between'} alignItems={'center'} mb={2} >
                                                <Heading size={'md'} color={'black'} fontSize={18}  >Weekly Attendance</Heading>
                                                <Text>Week {moment(new Date).week() - moment(new Date).startOf('month').week() + 1}</Text>
                                            </HStack>
                                            <StackedBarChart
                                                data={chartData}
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
                                                    formatXLabel: (xLabel) => Math.round(chartData.labels[xLabel]).toString(),
                                                    formatYLabel: (yLabel) => Math.round(yLabel).toString(),
                                                }}
                                            />
                                            <HStack mt={-8} alignItems={'center'} justifyContent={'center'} space={4}>
                                                {chartData.legends.map((item, index) => (
                                                    <Stack alignItems={'center'} key={index} >
                                                        <Box height={4} width={4} borderRadius={15} backgroundColor={item.color} />
                                                        <Text fontSize={12} >{item.title}</Text>
                                                    </Stack>
                                                ))}
                                            </HStack>
                                        </Stack>
                                    </Box>
                                
                                                */}
                            </Stack>
                            <Box marginBottom={2} />
                        </ScrollView>
                        :
                        <Stack mt={10} space={10}>

                            <Image
                                source={companyLogo ? companyLogo : workForceVerseLogo}
                                resizeMode={'contain'}
                                alt={`${context.stateUser.user.CompanyName} logo`}
                                alignSelf={'center'}
                                mx={4}
                                style={{
                                    height: 80,
                                    width: '80%'
                                }}
                            />
                            <Center>
                                <Heading size={'md'} >
                                    Complete your account setup
                                </Heading>
                            </Center>
                            <Stack mx={4} space={2} >
                                <Stack space={4} alignItems={'flex-start'}>
                                    <HStack alignItems={'center'} space={4} >
                                        <Divider background={'black'} orientation="vertical" height={12} mx={2} />
                                        <Heading size={'md'} >Step 1</Heading>
                                    </HStack>
                                    <HStack alignItems={'center'} space={4}>
                                        <Checkbox isChecked={dashboard?.stats?.positionsLenght > 0} />
                                        <Button onPress={() => navigation.navigate('Add Position Screen')} variant={'subtle'} isDisabled={dashboard?.stats?.positionsLenght > 0}>Create Position</Button>
                                    </HStack>
                                </Stack>
                                <Stack space={4} alignItems={'flex-start'}>
                                    <HStack alignItems={'center'} space={4}>
                                        <Divider background={'black'} orientation="vertical" height={12} mx={2} />
                                        <Heading size={'md'} >Step 2</Heading>
                                    </HStack>
                                    <HStack space={4} alignItems={'center'}>
                                        <Checkbox isDisabled={dashboard?.stats?.positionsLenght <= 0} />
                                        <Button variant={'subtle'} isDisabled={dashboard?.stats?.positionsLenght <= 0} onPress={() => navigation.navigate('Add Employee Screen')} >Create Employee</Button>
                                    </HStack>
                                </Stack>
                            </Stack>

                        </Stack>
                }
            </LoadingIndicator>


        </Box >
    )
}

const mapStateToProps = state => {
    return {
        employees: state.admin.employees,
        positions: state.admin.positions,
        dashboard: state.admin.dashboard,
        barChart: state.admin.dashboard.barChart,
        attendance: state.admin.attendance,
        onBreakList: state.admin.onBreakList,
        leaveRequests: state.admin.dashboard.leaveRequests,
        loanRequests: state.admin.dashboard.loanRequests,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getDashboard: (data) => dispatch(getDashboard(data)),
        getAllAttendance: (data) => dispatch(getAllAttendance(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)