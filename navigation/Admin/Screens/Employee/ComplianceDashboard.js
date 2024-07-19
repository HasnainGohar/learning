import React, { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

// Native Base
import { Box, Center, Divider, HStack, Heading, Icon, Pressable, ScrollView, Stack, Text, useToast, Spinner } from 'native-base'

// React natvigations
import { useNavigation } from '@react-navigation/native'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Redux
import { connect } from 'react-redux'
import { complianceDashboard } from '../../../../redux/actions/adminActions'

// moment
import moment from 'moment'

// RN-chart
import { BarChart, StackedBarChart } from 'react-native-chart-kit'

// Components
import LoadingIndicator from '../../../../components/LoadingIndicator'
import FilterModal from '../../../../components/FilterModal'
import Card from '../../../../components/Card'

const ComplianceDashboard = (props) => {
    const { complianceDashboard, dashboard, sites } = props

    const toast = useToast()
    const navigation = useNavigation()
    const width = Dimensions.get('window').width

    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})

    const loadData = async (values) => {
        setLoading(true)
        try {
            await complianceDashboard({
                siteId: values ? values.siteId : 0,
                date: values ? moment(values.date).format('YYYY-MM-DD') : null,
                employeeId: 0
            })
        } catch (error) {
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
    }, [])

    const statsLabel = [
        {
            title: 'Total Employees',
            color: 'success',
            value: dashboard?.totalEmployees
        },
        {
            title: 'Pending Details',
            color: 'error',
            value: dashboard?.totalPendingEmployeeDetails
        },
    ]

    const PendingDetails = [
        {
            title: 'Employee Passport Details Pending',
            count: dashboard.totalPendingPassportDetails,
            color: 'amber.400'
        },
        {
            title: 'Employee Visa Details Pending',
            count: dashboard.totalPendingVisaDetails,
            color: 'info.800'
        },
        {
            title: 'Employee Educational Details Pending',
            count: dashboard.totalPendingEducationDetails,
            color: 'success.500'
        },
        {
            title: 'Employee Bank Details Pending',
            count: dashboard.totalPendingbankDetails,
            color: 'error.500'
        },
        {
            title: 'Employee Compliance Details Pending',
            count: dashboard.totalPendingAdditionalDetails,
            color: 'lightBlue.500'
        },
    ]

    const toBeExpieData = {
        labels: ["Compliance", "Visa", "Passport", 'Bank', 'Education'],
        datasets: [
            {
                data: [
                    dashboard?.documentsToBeExpired?.totalAdditionalToBeExpired || 0,
                    dashboard?.documentsToBeExpired?.totalVisasToBeExpired || 0,
                    dashboard?.documentsToBeExpired?.totalPassportsToBeExpired || 0,
                    dashboard?.documentsToBeExpired?.totalBankToBeExpired || 0,
                    dashboard?.documentsToBeExpired?.totalEducationToBeExpired || 0
                ]
            }
        ]
    }
    const ExpiedData = {
        labels: ["Compliance", "Visa", "Passport", 'Bank', 'Education'],
        datasets: [
            {
                data: [
                    dashboard?.documentsExpired?.totalAdditionalExpired || 0,
                    dashboard?.documentsExpired?.totalVisasExpired || 0,
                    dashboard?.documentsExpired?.totalPassportsExpired || 0,
                    dashboard?.documentsExpired?.totalBankToBeExpired || 0,
                    dashboard?.documentsExpired?.totalEducationToBeExpired || 0
                ]
            }
        ]
    }

    const todaysAttendance = () => {
        return (
            <Box variant={'card'} mt={2} mx={4} >
                {/* <HStack justifyContent={'flex-end'} alignItems={'center'} mb={4} >
                     <Heading size={'md'} color={'black'} fontSize={16} >Today's Attendance</Heading> 
                    <HStack space={2} alignItems={'center'} >
                        {loading && <Spinner />}
                        <Text alignSelf={'flex-end'}>{moment(new Date()).format('DD MMMM')}</Text>
                    </HStack>

                </HStack> */}
                <HStack justifyContent={'space-around'} space={1.5} >
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
                            // onPress={() => navigation.navigate('Attendance Stats', { screenName: item?.title })}
                            >
                                <Heading color={`${item.color}.700`} fontSize={32} >{item.value}</Heading>
                            </Pressable>
                            <Text color={`${item.color}.700`} >{item?.title}</Text>
                        </Stack>

                    ))}
                </HStack>
            </Box>
        )
    }


    return (
        <Box variant={'container'} safeAreaTop>
            <Center>
                <Heading color={'black'} fontSize={20} fontWeight={'500'}>
                    Compliance Dashboard
                </Heading>
            </Center>
            <Icon position={'absolute'} right={3} name='filter' as={AntDesign} size={'xl'} color={'primary.600'} onPress={() => setShow(true)} />
            <LoadingIndicator loading={loading}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Stack mt={3} space={3} mb={2}>
                        {todaysAttendance()}
                        <Card
                            heading={'Pending Employee Details'}
                        >
                            {PendingDetails.map((item, index) => (
                                <HStack key={index} my={2} mx={2} justifyContent={'space-between'} alignItems={'center'}>
                                    <Text>{item.title}</Text>
                                    <Heading mx={2} size={'SM'}>{item.count}</Heading>
                                </HStack>
                            ))}
                        </Card>
                        <Card
                            heading={'Documents To Be Expire'}
                            subheading={filterValue.fromDate ? moment(filterValue.fromDate).format('YYYY') : moment(new Date()).format('YYYY')}
                        >
                            <BarChart
                                data={toBeExpieData}
                                width={width / 1.2}
                                height={220}
                                chartConfig={{
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                                    strokeWidth: 2,
                                    barPercentage: 0.5,
                                    decimalPlaces: 0,
                                }}
                                fromZero
                            />
                        </Card>

                        <Card
                            heading={'Documents Already Expire'}
                            subheading={filterValue.fromDate ? moment(filterValue.fromDate).format('YYYY') : moment(new Date()).format('YYYY')}
                        >
                            <BarChart
                                data={ExpiedData}
                                width={width / 1.2}
                                height={220}

                                chartConfig={{
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                                    strokeWidth: 2,
                                    barPercentage: 0.5,
                                    decimalPlaces: 0,
                                }}
                                fromZero
                            />

                        </Card>
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
                        label: 'Date',
                        type: 'datetime',
                        key: 'date',
                        mode: 'date',
                        value: filterValue.date
                    }
                ]}
                datePickers={[{ date: false }]}
                onFilter={(values) => (
                    loadData(values),
                    setFilterValues(values),
                    setFilter(true)
                )}
                setFilter={setFilter}
            />
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        dashboard: state.admin.complianceDashborad.dashboard,
        sites: state.admin.sites
    }
}
const mapDispatchToProps = dispatch => {
    return {
        complianceDashboard: data => dispatch(complianceDashboard(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceDashboard)
