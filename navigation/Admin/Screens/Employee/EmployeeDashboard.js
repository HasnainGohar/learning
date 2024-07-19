import React, { useCallback, useState } from 'react'
import { Dimensions } from 'react-native'

// Navigation
import { useFocusEffect } from '@react-navigation/native'

// Native Base
import { Badge, Box, Button, Divider, Heading, HStack, ScrollView, Stack, Text, useTheme, useToast } from 'native-base'

// Date Time
import moment from 'moment'

// Redux
import { connect } from 'react-redux'
import { clearDashboardData, getDashboardData } from '../../../../redux/actions/employeeActions'

// Chart
import { LineChart } from 'react-native-chart-kit'


// Components
import BackHeader from '../../../../components/BackHeader'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import CircularProgress from '../../../../components/CircularProgress'

const width = Dimensions.get('window').width

const EmployeeDashboard = (props) => {

    const {
        route,
        dashboard,
        getDashboardData,
    } = props


    const { id, name } = route.params

    const toast = useToast()
    const theme = useTheme()

    const [loading, setLoading] = useState()
    const date = new Date().toISOString().split('T')[0]

    useFocusEffect(
        useCallback(() => {
            loadData()

        }, [])
    )

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await getDashboardData({
                userId: id,
                date: date
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

    const shortHours = [
        {
            stats: dashboard.weeklyHours,
            title: 'Week',
            filterFor: 'Week'
        },
        {
            stats: dashboard.monthlyHours,
            title: `${moment(new Date()).format('MMMM')}`,
            filterFor: 'Month'
        },
        {
            stats: dashboard.yearlyHours,
            title: `${moment(new Date()).format('YYYY')}`,
            filterFor: 'Year'
        }
    ]

    const chartData = {
        labels: dashboard?.monthlyData?.map(item => item.monthName.length >= 6 ? item.monthName.substring(0, 3) : item.monthName),
        datasets: [
            {
                data: dashboard?.monthlyData?.map(item => item.present),
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                strokeWidth: 2,
                legend: "Present",
                legentColor: 'rgba(0,225,0,1)'
            },
            {
                data: dashboard?.monthlyData?.map(item => item.absent),
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
                legend: "Absent",
                legentColor: 'rgba(255, 0, 0,1)'
            },
            {
                data: dashboard?.monthlyData?.map(item => item.leave),
                color: (opacity = 1) => `rgba(165, 55, 253, ${opacity})`,
                strokeWidth: 2,
                legend: "Leave",
                legentColor: 'rgba(165, 55, 253,1)'
            },
            {
                data: dashboard?.monthlyData?.map(item => item.late),
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


    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <BackHeader>{name}</BackHeader>

                <ScrollView
                showsVerticalScrollIndicator={false}
                >
                    <Stack space={4} >
                        {
                            dashboard.checkInTime &&

                            <Box variant={'card'} mx={4} mt={4} >
                                <Stack space={2} >
                                    <HStack justifyContent={'space-between'} >
                                        <Text>{moment(new Date()).format("DD MMMM YYYY")}</Text>
                                        <Stack space={2} >
                                            {getStatus()}
                                            {/* <Badge borderRadius={15} size={'sm'} colorScheme={dashboard.checkOut ? 'error' : 'success'} >{dashboard.checkOut ? 'Checked-Out' : 'Checked-In'}</Badge> */}
                                        </Stack>
                                    </HStack>
                                    <Heading size={'3xl'} >{dashboard.checkIn ? moment(dashboard?.checkIn).format('hh:mm a') : 'Error'}</Heading>
                                    {dashboard.checkOut && (
                                        <>
                                            <Divider />
                                            <Heading size={'3xl'} >{dashboard.checkOut ? moment(dashboard?.checkOut).format('hh:mm a') : 'Error'}</Heading>
                                        </>
                                    )}

                                    {dashboard.startBreak && <Badge mx={4} borderRadius={12} ><Text>{dashboard.totalBreak ? `Total break Time  ${moment(dashboard.totalBreak).format('hh:mm')}` : `${name} start break at ${moment(dashboard.startBreak).format('hh:ss a')}`}</Text></Badge>}

                                </Stack>
                            </Box>
                        }

                        <Box variant={'card'} mx={4} >
                            <HStack justifyContent={'flex-end'} mb={2} >
                                <Text>{moment(new Date()).format('YYYY')}</Text>
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
                                                // onPress={() => navigation.navigate('Employee Attendance History', { filterFor: item.filterFor })}
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
                                    left: -30
                                }}
                            />
                        </Box>

                    </Stack>
                </ScrollView>
            </LoadingIndicator>
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        dashboard: state.employee.dashboard
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getDashboardData: (data) => dispatch(getDashboardData(data)),
        clearDashboardData: () => dispatch(clearDashboardData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDashboard)