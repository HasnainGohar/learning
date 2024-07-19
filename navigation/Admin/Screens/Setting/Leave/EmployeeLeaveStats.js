import React, { useEffect, useState, useMemo } from 'react'
import { Dimensions } from 'react-native'


// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'

// Native Base
import { Box, Stack, useToast, Icon, Menu, Button, HStack, Heading, Text, ScrollView, Divider, Badge, Spinner } from 'native-base'

// moment
import moment from 'moment'

// Redux
import { connect } from 'react-redux'
import { getEmployeeLeavesDashboard } from '../../../../../redux/actions/adminActions'

// Charts
import { LineChart } from 'react-native-chart-kit'
import BackHeader from '../../../../../components/BackHeader'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import employee from '../../../../../redux/reducers/employee'
import Card from '../../../../../components/Card'


const width = Dimensions.get('window').width


const EmployeeLeaveStats = (props) => {

    const { route, employeeLeaveDashboard, getEmployeeLeavesDashboard } = props

    const { employeeData } = route.params
    const toast = useToast()

    const [loading, setLoading] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false);
    const [yearLoading, setYearLoading] = useState(false)
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);

    const takenLeaves = employeeLeaveDashboard?.yearlyLeave?.map((item) => item.leavesTaken)
    const allowedLeaves = employeeLeaveDashboard?.yearlyLeave?.map((item) => item.allocatedLeaves)


    const years = useMemo(() => {
        return Array.from({ length: 2025 - 2020 }, (v, k) => k + 2020);
    }, []);


    const loadData = async () => {
        setLoading(true)
        setDataLoaded(false)
        try {
            getEmployeeLeavesDashboard({
                employeeId: employeeData.employeeId,
                siteId: employeeData.siteId,
                year: selectedYear ? selectedYear : moment(new Date()).format('YYYY')
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
        loadData()
    }, [])


    const onYearChange = async (year) => {
        setSelectedYear(year)
        setYearLoading(true)
        try {
            getEmployeeLeavesDashboard({
                employeeId: employeeData.employeeId,
                siteId: employeeData.siteId,
                year: year
            })
        } catch (e) {
            console.log(e)
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setYearLoading(false)
        }
    }


    const chartData = {
        labels: employeeLeaveDashboard?.monthlyStats?.map(item => item.month.substring(0, 3)) || [],
        datasets: [
            {
                data: employeeLeaveDashboard?.monthlyStats?.map((item) => item.leaves) || [],
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





    return (
        <Box variant={'container'}>
            <LoadingIndicator loading={loading}>
                <BackHeader>
                    {employeeData.name} Stats
                </BackHeader>

                <ScrollView showsVerticalScrollIndicator={false} >
                    {
                        !dataLoaded ?
                            <Stack mb={3}>
                                <Card
                                    heading={'Monthly stats'}
                                    subheading={selectedYear}
                                >
                                    <Box mb={4} />
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
                                        horizontalLabelRotation={90}
                                        style={{
                                            top: -4,
                                            left: -20
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

                                <Box alignSelf={'flex-end'} my={3} mx={4} >
                                    <HStack space={8} alignItems={'center'} >
                                        <Menu
                                            style={{
                                                width: 150
                                            }}
                                            trigger={(triggerProps) => {
                                                return (
                                                    <Button variant={'outline'} width={150} py={1} mr={1} {...triggerProps}>
                                                        <HStack space={12} alignItems={'center'} >
                                                            <Text fontSize={15} fontWeight={'400'} color={'primary.600'}>{selectedYear ? selectedYear : moment(new Date()).format('YYYY')}</Text>
                                                            <Stack>
                                                                <Icon as={AntDesign} name='up' size={'2xs'} />
                                                                <Icon as={AntDesign} name='down' size={'2xs'} />
                                                            </Stack>
                                                        </HStack>
                                                    </Button>
                                                )
                                            }}
                                        >
                                            {years.map((year, index) => (
                                                <Menu.Item key={index} onPress={() => (
                                                    onYearChange(year.toString())
                                                )}>
                                                    {year}
                                                </Menu.Item>
                                            ))}

                                        </Menu>
                                    </HStack>
                                </Box>

                                <Box variant={'card'} mx={4} mb={2} >
                                    <Stack space={1} >
                                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                                            <Heading size={'md'} >{employeeData.name}</Heading>
                                            <Text>Leaves: {takenLeaves}/{allowedLeaves}</Text>
                                        </HStack>
                                        <Text>{employeeData.email}</Text>
                                    </Stack>
                                </Box>

                                {
                                    employeeLeaveDashboard?.employeeLeaveStats &&
                                    employeeLeaveDashboard?.employeeLeaveStats?.map((item, index) => (
                                        <Box my={2} variant={'card'} mx={4} key={index} >
                                            <Stack space={1} >
                                                <HStack alignItems={'center'} justifyContent={'space-between'} >
                                                    <Text>
                                                        No of Leaves: {
                                                            item.toDate ?
                                                                moment(item.toDate).diff(moment(item.fromDate), 'days') + 1 :
                                                                1
                                                        }
                                                    </Text>
                                                    <Badge borderRadius={15} colorScheme={'success'} >{item.leaveDuration}</Badge>
                                                </HStack>
                                                <HStack>
                                                    <HStack alignItems={'center'} space={2} >
                                                        <Text fontSize={12} >{moment(item.fromDate).format("DD-MM-YYYY")}</Text>
                                                        {item.fromDate !== item.toDate &&
                                                            <>
                                                                <Divider w={25} />
                                                                <Text fontSize={12} >{moment(item.toDate).format("DD-MM-YYYY")}</Text>
                                                            </>
                                                        }
                                                    </HStack>
                                                </HStack>
                                                <Text>{item.leaveReason}</Text>
                                            </Stack>
                                        </Box>
                                    ))
                                }
                            </Stack> :
                            (
                                <Center>
                                    <Text>Loading data, please wait...</Text>
                                </Center>
                            )
                    }

                </ScrollView>
            </LoadingIndicator>
        </Box>
    )
}
const mapStateToProps = state => {
    return {
        employeeLeaveDashboard: state.admin.employeeLeaveDashboard,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getEmployeeLeavesDashboard: (data) => dispatch(getEmployeeLeavesDashboard(data)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeLeaveStats)

