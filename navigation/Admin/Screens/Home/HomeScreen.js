import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Platform } from 'react-native'

// Native Base
import {
    Badge,
    Box,
    Button,
    FlatList,
    HStack,
    Heading,
    Icon,
    Image,
    Menu,
    Modal,
    Pressable,
    ScrollView,
    Spinner,
    Stack,
    Text
} from 'native-base'

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign'

// Context API
import AuthGlobal from '../../../../context/store/AuthGlobal'

// Date Time
import DateTimePicker from '@react-native-community/datetimepicker';

// Redux
import { connect } from 'react-redux'
import { getAbsentEmployees, getAllPositions, getAllSites, getEmployeeCount, getLateEmployees, getLeaveEmployees, getLeaveRequests, getLoanRequests, getPresentEmployees, getSites } from '../../../../redux/actions/adminActions'

// Components
import baseURL from '../../../../assets/common/baseURL'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import Card from '../../../../components/Card'
import AttendanceCard from '../../../../components/Cards/AttendanceCard'
import EmployeeCard from '../../../../components/Cards/EmployeeCard'
import moment from 'moment'


const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const HomeScreen = (props) => {

    const {
        dashboard,
        getSites,
        getEmployeeCount,
        getPresentEmployees,
        getAbsentEmployees,
        getLateEmployees,
        getLeaveEmployees,
        getLeaveRequests,
        getLoanRequests,
    } = props

    /*
    * Initialization
    */
    const context = useContext(AuthGlobal)

    /*
    * States
    */

    const [loading, setLoading] = useState(false)
    const [site, setSite] = useState({
        id: (context.stateUser.user.IsMultiSite == 'True' && dashboard.siteList.length > 1) ? 0 : context.stateUser.user.SiteId,
        name: (context.stateUser.user.IsMultiSite == 'True' && dashboard.siteList.length > 1) ? 'All sites' : context.stateUser.user.SiteName
    })
    const [filter, setFilter] = useState("Online")
    const [date, setDate] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false)

    /*
    * Assignments
    */
    const workForceVerseLogo = require('../../../../assets/images/logo-icon-purple.png')
    const companyLogo = { uri: `${baseURL}${context.stateUser.user.CompanyLogo.substring(2)}` }
    
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


    const statsLabel = [
        {
            title: 'Present',
            color: 'success',
            key: 'present',
            value: dashboard.present,
            filter: 'Online'
        },
        {
            title: 'Absent',
            color: 'error',
            key: 'absent',
            value: dashboard.absent,
            filter: 'Absent'
        },
        {
            title: 'Late',
            color: 'warning',
            key: 'late',
            value: dashboard.late,
            filter: 'Late'
        },
        {
            title: 'Leave',
            color: 'violet',
            key: 'leave',
            value: dashboard.leave,
            filter: 'Leave'
        },
    ]


    /*
    * Component Mount
    */
    useEffect(() => {
        loadData()
    }, [site, date])

    const loadData = async () => {
        setLoading(true)
        try {
            await getSites({
                SiteId: 0,
                TodayDate: new Date(),
                CompanyId: 0,
                UserId: 0
            })
            await getEmployeeCount({
                SiteId: site.id,
                TodayDate: date,
                CompanyId: 0,
                UserId: 0
            })
            await getPresentEmployees({
                SiteId: site.id,
                TodayDate: date,
                CompanyId: 0,
                UserId: 0
            })
            await getAbsentEmployees({
                SiteId: site.id,
                TodayDate: date,
                CompanyId: 0,
                UserId: 0
            })
            await getLateEmployees({
                SiteId: site.id,
                TodayDate: date,
                CompanyId: 0,
                UserId: 0
            })
            await getLeaveEmployees({
                SiteId: site.id,
                TodayDate: date,
                CompanyId: 0,
                UserId: 0
            })
            await getLeaveRequests()
            await getLoanRequests()
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const getFlatlistData = () => {
        switch (filter) {
            case "Online":
                return dashboard.presentEmployees
            case "Absent":
                return dashboard.absentEmployees
            case "Late":
                return dashboard.lateEmployees
            case "Leave":
                return dashboard.leaveEmployees
            case "Break":
                return dashboard.breakEmployees
            default:
                return []
        }
    }


    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >

                <Image
                    source={companyLogo ? companyLogo : workForceVerseLogo}
                    resizeMode={'contain'}
                    alt={`${context.stateUser.user.CompanyName} logo`}
                    alignSelf={'center'}
                    mx={8}
                    my={8}
                    style={{
                        height: 80,
                        width: '80%'
                    }}
                />

                <Stack space={4} >

                    <Box
                        mx={4}
                    >
                        <HStack justifyContent={'space-between'} alignItems={'center'} space={2} >
                            <Menu w="190" trigger={triggerProps => {
                                return <Button
                                    {...triggerProps}
                                    rightIcon={(
                                        <Stack ml={2} >
                                            <Icon as={AntDesign} name='up' size={'2xs'} color={'white'} />
                                            <Icon as={AntDesign} name='down' size={'2xs'} color={'white'} />
                                        </Stack>
                                    )}
                                >
                                    {site.name}
                                </Button>
                            }}>
                                {
                                    (context.stateUser.user.IsMultiSite == 'True' && dashboard.siteList.length > 1) &&
                                    <Menu.Item onPress={() => setSite({
                                        id: 0,
                                        name: 'All Sites'
                                    })} >
                                        All sites
                                    </Menu.Item>
                                }
                                {
                                    dashboard.siteList.map((item, index) => (
                                        <Menu.Item key={index} onPress={() => setSite({
                                            name: item.name,
                                            id: item.siteId
                                        })}  >{item.name}</Menu.Item>
                                    ))
                                }
                            </Menu>
                            {Platform.OS === 'ios' ? (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={'date'}
                                    is24Hour={false}
                                    maximumDate={new Date()}
                                    onChange={(event, selectedDate) => {
                                        setDate(selectedDate)
                                        setShowPicker(false)
                                    }}
                                />
                            ) : (
                                <>
                                    <Button
                                        variant={'subtle'}
                                        padding={2}
                                        borderRadius={15}
                                        position={'absolute'}
                                        right={0}
                                        _text={{
                                            fontSize: 14
                                        }}
                                        onPress={() => setShowPicker(true)}
                                    >
                                        {moment(date).format('DD MMM, YYYY')}
                                    </Button>
                                    {showPicker && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={date}
                                            mode={'date'}
                                            is24Hour={false}
                                            style={{
                                                position: 'absolute',
                                                right: 0
                                            }}
                                            onChange={(event, selectedDate) => {
                                                setDate(selectedDate)
                                                setShowPicker(false)
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </HStack>
                    </Box>

                    <Card
                        heading={'Attendance'}
                    // subheading={selectedDate ? moment(new Date(selectedDate)).format('DD MMMM') : moment(new Date()).format('DD MMMM')}
                    >
                        <HStack justifyContent={'center'} space={1.5} >
                            {statsLabel.map((item, index) => (
                                <Stack alignItems={'center'} space={2} key={index} >
                                    <Button
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                        bgColor={`${item.color}.100`}
                                        style={{
                                            height: width / 5.4,
                                            width: width / 5.5,
                                            marginHorizontal: 4,
                                            borderRadius: 40
                                        }}
                                        onPress={() => setFilter(item.filter)}
                                    >
                                        <Heading color={`${item.color}.700`} fontSize={30} mt={2} >{item.value}</Heading>
                                    </Button>
                                    <Text color={`${item.color}.700`} >{item?.title}</Text>
                                </Stack>

                            ))}
                        </HStack>
                    </Card>

                    <Box
                        variant={'card'}
                        mx={4}
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
                                        // mt={3}
                                        mx={1}
                                    >
                                        <Button
                                            variant={'subtle'}
                                            borderRadius={15}
                                            colorScheme={item.title === filter ? 'primary' : 'trueGray'}
                                            isPressed={item.title === filter}
                                            px={2.5}
                                            py={1}
                                            _text={{
                                                fontSize: 16
                                            }}
                                            onPress={() => setFilter(item.title)}
                                        >{item.title}</Button>
                                        {/* {item.title === 'Online' && <Badge
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
                                        // >{attendance?.length}</Badge>
                                        >{"21"}</Badge>
                                        } */}
                                    </Box>
                                ))}
                            </HStack>
                        </ScrollView>
                    </Box>

                    <FlatList
                        data={getFlatlistData()}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            if (filter === 'Online' || filter === 'Break' || filter === 'Late') {
                                return <AttendanceCard data={item} />
                            } else {
                                return <EmployeeCard data={item} />
                            }
                        }}
                    />

                </Stack>
            </LoadingIndicator>
        </Box >
    )
}

const mapStateToProps = state => {
    return {
        dashboard: state.admin.dashboard,
        sites: state.admin.sites
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getEmployeeCount: (data) => dispatch(getEmployeeCount(data)),
        getPresentEmployees: (data) => dispatch(getPresentEmployees(data)),
        getAbsentEmployees: (data) => dispatch(getAbsentEmployees(data)),
        getLateEmployees: (data) => dispatch(getLateEmployees(data)),
        getLeaveEmployees: (data) => dispatch(getLeaveEmployees(data)),
        getSites: (data) => dispatch(getSites(data)),
        getLeaveRequests: (data) => dispatch(getLeaveRequests()),
        getLoanRequests: (data) => dispatch(getLoanRequests()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)