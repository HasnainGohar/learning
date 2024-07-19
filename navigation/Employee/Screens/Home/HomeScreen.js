import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import { Dimensions } from 'react-native'

// Navigation
import { useFocusEffect, useNavigation } from '@react-navigation/native'

// Native Base
import { Badge, Box, Button, Divider, Heading, HStack, Icon, ScrollView, Stack, Text, useTheme, useToast, Modal, Input, Spinner } from 'native-base'

// Native Base
import Ionicons from 'react-native-vector-icons/Ionicons'

// Date Time
import moment from 'moment'

// Charts
import { LineChart } from 'react-native-chart-kit'

// Redux
import { connect } from 'react-redux'
import { getDashboardData, markBreak, SubmitEOD } from '../../../../redux/actions/employeeActions'

// Context API
import AuthGlobal from '../../../../context/store/AuthGlobal'

// Component
import LoadingIndicator from '../../../../components/LoadingIndicator'
import CircularProgress from '../../../../components/CircularProgress'
import DashboardCalendar from '../../../../components/DashboardCalendar'
import ShiftCard from './ShiftCard'

const width = Dimensions.get('window').width

const HomeScreen = (props) => {

    const {
        dashboard,
        getDashboardData,
        sendEOD,
        markBreak,
        announcements,
    } = props


    const context = useContext(AuthGlobal)
    const navigation = useNavigation()


    const theme = useTheme()
    const toast = useToast()

    const [loading, setLoading] = useState()
    const [dashboardLoading, setDashboardLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [EOD, setEOD] = useState()
    const [eodLoading, setEodLoading] = useState(false)
    const [hideEODButton, setHideEODButton] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null);




    useFocusEffect(useCallback(() => {
        const abort = loadDashboardData()
    }, []))


    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            await getDashboardData({
                userId: context.stateUser.user.UserId,
                date: new Date().toISOString().split('T')[0]
            })
        } catch (e) {
            console.log(e, 'error in useEffect')
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }

    const loadDashboardData = async (date) => {
        setDashboardLoading(true)
        try {
            await getDashboardData({
                userId: context.stateUser.user.UserId,
                date: date ? date : new Date().toISOString().split('T')[0],
            })
        } catch (e) {
            console.log(e, 'error in loadDashboard')
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setDashboardLoading(false)
        }
    }

    const chartData = {
        labels: dashboard?.monthlyData?.map(item => item.monthName.length >= 6 ? item.monthName.substring(0, 3) : item.monthName) || [],
        datasets: [
            {
                data: dashboard?.monthlyData?.map(item => item.present) || [],
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                strokeWidth: 2,
                legend: "Present",
                legentColor: 'rgba(0,225,0,1)'
            },
            {
                data: dashboard?.monthlyData?.map(item => item.absent) || [],
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
                legend: "Absent",
                legentColor: 'rgba(255, 0, 0,1)'
            },
            {
                data: dashboard?.monthlyData?.map(item => item.leave) || [],
                color: (opacity = 1) => `rgba(165, 55, 253, ${opacity})`,
                strokeWidth: 2,
                legend: "Leave",
                legentColor: 'rgba(165, 55, 253,1)'
            },
            {
                data: dashboard?.monthlyData?.map(item => item.late) || [],
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                strokeWidth: 2,
                legend: "Late",
                legentColor: 'rgba(255, 165, 0,1)'
            },
        ],
    };


    const getStatus = () => {
        switch (dashboard.status) {
            case 'OnTime':
                return <Badge borderRadius={15} size={'sm'} colorScheme={'success'} >On-Time</Badge>
            case 'Late':
                return <Badge borderRadius={15} size={'sm'} colorScheme={'warning'} >Late</Badge>
            default:
                return null
        }
    }

    const shortHours = [
        {
            stats: dashboard.weeklyHours,
            title: 'Week',
            filterFor: 'Week'
        },
        {
            stats: dashboard.monthlyHours,
            title: selectedDate ? `${moment(selectedDate).format('MMMM')}` : `${moment(new Date()).format('MMMM')}`,
            filterFor: 'Month'
        },
        {
            stats: dashboard.yearlyHours,
            title: selectedDate ? `${moment(selectedDate).format('YYYY')}` : `${moment(new Date()).format('YYYY')}`,
            filterFor: 'Year'
        }
    ]



    const handleEOD = async () => {
        setEodLoading(true)
        try {
            const res = await sendEOD({
                report: EOD
            })
            if (res) {
                toast.show({
                    status: res.status,
                    description: res.msg,
                });
                setHideEODButton(true)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setEodLoading(false)
            setEOD('')
            setOpen(false)
        }
    }




    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >


                    <Stack space={3} >
                        <HStack mx={4} justifyContent={'space-between'} alignItems={'center'} >
                            <Stack>
                                <Text>Hello,</Text>
                                <Heading>{context.stateUser.user.UserFirstName}</Heading>
                            </Stack>
                            <HStack>
                                {dashboardLoading && <Spinner />}
                                <Stack>
                                    {
                                        dashboard.unReadAnnouncements > 0 &&
                                        <Badge
                                            colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
                                                fontSize: 12
                                            }}>
                                            {dashboard.unReadAnnouncements}
                                        </Badge>
                                    }
                                    <Icon as={Ionicons} name={'notifications-outline'} size={'xl'} onPress={() => navigation.navigate('Announcemennt Screen', { data: announcements })} />
                                </Stack>
                            </HStack>
                        </HStack>

                        <DashboardCalendar setSelectedDate={setSelectedDate} onDateChanged={loadDashboardData} />
                        <ShiftCard />
                        {/* {
                            context.stateUser.user.ViewScheduleModule == 'True' ?
                                 :
                                dashboard.checkIn &&
                                <Box variant={'card'} mx={4} mt={4} mb={1} >
                                    <Stack space={2} >
                                        <HStack justifyContent={'space-between'} >
                                            <Text>{moment(new Date(dashboard.checkIn)).format("DD MMMM YYYY")}</Text>
                                            <Stack space={2} >
                                                {getStatus()}
                                            </Stack>
                                        </HStack>
                                        <Heading size={'3xl'} >{dashboard.checkIn ? moment(dashboard?.checkIn).format('hh:mm a') : 'Error'}</Heading>
                                        {dashboard.checkOut && (
                                            <>
                                                <Divider />
                                                <Heading size={'3xl'} >{dashboard.checkOut ? moment(dashboard?.checkOut).format('hh:mm a') : 'Error'}</Heading>
                                            </>
                                        )}
                                    </Stack>
                                    {
                                        dashboard.checkOut == null ? (
                                            <Stack space={2}>
                                                {
                                                    dashboard.startBreak &&
                                                    <Badge borderRadius={12} >
                                                        <Text>{dashboard.totalBreak ?
                                                            `Total break Time ${moment(dashboard.totalBreak).format('HH:m:ss')} ` :
                                                            `Your break started at ${moment(new Date(dashboard.startBreak)).format('hh:mm a')}`}
                                                        </Text>
                                                    </Badge>
                                                }
                                                {
                                                    dashboard.totalBreak ? null :
                                                        <Button
                                                            variant={'subtle'}
                                                            colorScheme={dashboard.startBreak ? 'error' : 'success'}
                                                            onPress={() => HandleBreak(dashboard.startBreak ? 'breakOut' : 'breakIn')}
                                                            isLoading={breakloading}
                                                        >
                                                            {dashboard.startBreak ? 'End Break' : 'Start Break'}
                                                        </Button>
                                                }

                                                {!hideEODButton && <Button variant={'subtle'} onPress={() => setOpen(true)} >Submit end of day report</Button>}
                                            </Stack>
                                        ) :
                                            (
                                                dashboard.startBreak && <Badge borderRadius={12} ><Text>{dashboard.totalBreak ? `Total break Time ${moment(dashboard.totalBreak).format('HH:mm')}` : `Your break started at ${moment(dashboard.startBreak).format('hh:mm a')}`}</Text></Badge>
                                            )
                                    }

                                </Box>

                        } */}


                        {/* STATS */}
                        <Box variant={'card'} mx={4} mt={2} >
                            <HStack justifyContent={'space-between'} mb={2} >
                                <Heading size={'sm'}>Stats</Heading>
                                <Text>{selectedDate ? moment(selectedDate).format('YYYY') : moment(new Date()).format('YYYY')}</Text>
                            </HStack>
                            <HStack justifyContent={'space-evenly'} >
                                <Stack space={2} alignItems={'center'}  >
                                    <CircularProgress
                                        total={dashboard.allocateLeaves ? dashboard.allocateLeaves : 1}
                                        current={dashboard.leave ? dashboard.leave : 0}
                                        radius={width / 13}
                                        strokeWidth={8}
                                        color={theme.colors.primary[500]}
                                    />
                                    <Text color={'primary.500'} >Leaves</Text>
                                </Stack>
                                <Divider orientation='vertical' />
                                <Stack space={2} alignItems={'center'}  >
                                    <CircularProgress
                                        total={260}
                                        current={dashboard.absent ? dashboard.absent : 0}
                                        radius={width / 13}
                                        strokeWidth={8}
                                        color={theme.colors.error[500]}
                                    />
                                    <Text color={'error.500'} >Absent</Text>
                                </Stack>
                                <Divider orientation='vertical' />
                                <Stack space={2} alignItems={'center'}  >
                                    <CircularProgress
                                        total={dashboard.present ? dashboard?.present : 1}
                                        current={dashboard.late ? dashboard.late : 0}
                                        radius={width / 13}
                                        strokeWidth={8}
                                        color={theme.colors.warning[500]}
                                    />
                                    <Text color={'warning.500'} >Late</Text>
                                </Stack>
                            </HStack>
                        </Box>

                        {/* Short Hours */}
                        <Box variant={'card'} mx={4} >
                            <Heading size={'sm'}>Short hours (hrs)</Heading>
                            <HStack mt={2} justifyContent={'space-evenly'} >
                                {
                                    shortHours.map((item, index) => (
                                        <>
                                            <Stack key={index} space={2} alignItems={'center'}  >
                                                <Button
                                                    height={'70'}
                                                    width={'70'}
                                                    borderRadius={'40'}
                                                    variant={'subtle'}
                                                    colorScheme={'error'}
                                                    _text={{
                                                        fontWeight: 'bold',
                                                        color: 'error.700',
                                                        fontSize: 14
                                                    }}
                                                    onPress={() => navigation.navigate('Employee Attendance History', { filterFor: item.filterFor })}
                                                >
                                                    {item.stats}
                                                </Button>
                                                <Text bold color={'error.700'} >{item.title}</Text>
                                            </Stack>
                                            {index !== shortHours.length - 1 && <Divider orientation='vertical' />}
                                        </>
                                    ))
                                }
                            </HStack>
                        </Box>

                        <Box variant={'card'} mx={4} mb={4} >
                            <HStack justifyContent={'space-between'} alignItems={'center'} mb={2} >
                                <Heading size={'md'} fontSize={18}  >Monthly stats</Heading>
                                <Text>Month {moment(new Date(dashboard?.checkIn || new Date())).month() + 1}</Text>
                            </HStack>
                            <Box mb={4} />
                            <LineChart
                                data={chartData}
                                width={width / 1.1}
                                height={300}
                                chartConfig={{
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                                    strokeWidth: 2,
                                    decimalPlaces: 0,
                                    useShadowColorFromDataset: false,
                                    formatYLabel: (yLabel) => Math.round(yLabel),
                                }}
                                bezier
                                decimal={false}
                                withShadow={false}
                                withDots={true}
                                style={{
                                    top: 10,
                                    left: -30,
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#ffa726"
                                      }

                                }}
                            />
                        </Box>
                    </Stack>
                </ScrollView>

                <Modal isOpen={open} onClose={() => setOpen(false)} >
                    <Modal.Content height={'40%'}>
                        <Modal.Header>
                            <Heading size={'sm'} >End of day report</Heading>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <Stack space={2} >
                                <Input
                                    placeholder='Start here'
                                    textAlignVertical='top'
                                    numberOfLines={5}
                                    type='text'
                                    multiline
                                    scrollEnabled
                                    value={EOD}
                                    onChangeText={(text) => setEOD(text)}
                                />
                            </Stack>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button size={'md'} onPress={handleEOD} isLoading={eodLoading} >Submit</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </LoadingIndicator>
        </Box >

    )
}

const mapStateToProps = state => {
    return {
        dashboard: state.employee.dashboard,
        breaks: state.employee.break,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getDashboardData: (data) => dispatch(getDashboardData(data)),
        sendEOD: (data) => dispatch(SubmitEOD(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)