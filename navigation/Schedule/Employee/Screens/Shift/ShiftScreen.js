import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, StyleSheet, Dimensions, useWindowDimensions, } from 'react-native';

// Native Base
import { Avatar, Box, Fab, FlatList, HStack, Heading, Icon, IconButton, Menu, Pressable, Stack, Text, Button, useTheme, Spinner } from 'native-base';

// React Natvigation
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// Context Api
import AuthGlobal from '../../../../../context/store/AuthGlobal';

// React Native Calender
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { CalendarProvider, ExpandableCalendar, AgendaList, WeekCalendar, Calendar } from 'react-native-calendars';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

//Component
import ListingOptionsCard from '../../../../../components/ListingOptionsCard';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import FilterModal from '../../../../../components/FilterModal';

// Redux
import { connect } from 'react-redux'
import { getAllShifts } from '../../../../../redux/actions/employeeActions';
import { getAllSites } from '../../../../../redux/actions/adminActions';

// rotes
import OpenShift from './routes/OpenShift'
import Myshift from './routes/MyShift';
import AllShift from './routes/AllShift';


const ShiftScreen = (props) => {

    const { shifts, getShifts, getAllSites, sites } = props

    console.log(shifts)


    const layout = useWindowDimensions()
    const navigation = useNavigation()

    const context = useContext(AuthGlobal)
    const globalTheme = useTheme()

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'first', title: 'MY SHIFTS' },
        { key: 'second', title: 'ALL SHIFTS' },
        { key: 'third', title: 'OPEN SHIFTS' },
    ])
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [filter, setFilter] = useState(false)
    const [filterValue, setFilterValues] = useState({})
    const [isExpanded, setIsExpanded] = useState(false)
    const [filterLoading, setFilterLoading] = useState(false)

    const marked = {
        [`${new Date().toISOString().split('T')[0]}`]: { marked: true },
    };

    useEffect(() => {
        loadData()
    }, [])


    const loadData = async () => {
        setLoading(true)
        try {
            await getShifts({
                id: context.stateUser.userID,
                status: 'My Shift'
            })
            await getShifts({
                id: context.stateUser.userID,
                status: 'All Shift'
            })
            await getShifts({
                id: context.stateUser.userID,
                status: 'Open Shift'
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const loadFilterData = async () => {
        setFilterLoading(true)
        try {
            await getAllSites({})
        } catch (error) {
            console.log(error)
        } finally {
            setFilterLoading(false)
        }
    }



    const FirstRoute = () => (
        <View style={{ flex: 1, marginTop: isExpanded ? 50 : 0 }} >

            {loading ?
                <Box flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Spinner />
                </Box> :
                <OpenShift />
            }

        </View>
    );

    const SecondRoute = () => (
        <View style={{ flex: 1, marginTop: isExpanded ? 50 : 0 }} >
            {loading ?
                <Box flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Spinner />
                </Box> :
                <AllShift />
            }
        </View>
    );

    const ThirdRoute = () => (
        <View style={{ flex: 1, marginTop: isExpanded ? 50 : 0 }} >
            <OpenShift />
        </View>
    );


    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
    });

    const renderTabBar = props => (
        <View style={{ flex: isExpanded ? 1 : 0.4 }}>
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: 'white' }}
                tabStyle={{ backgroundColor: '#a754ee' }}
            />
            <CalendarProvider
                date={new Date()}
                showTodayButton={false}
                todayButtonStyle={{
                    bottom: -40,
                }}
                theme={{
                    todayButtonTextColor: '#a754ee',
                    calendarBackground: 'white',
                    textMonthFontWeight: 'bold'
                }}
            >
                {
                    !isExpanded ?
                        <ExpandableCalendar
                            firstDay={1}
                            markedDates={marked}
                            // minDate={`${currentYear}-01-01`}
                            // maxDate={`${currentYear}-12-31`}
                            // onDayPress={({ dateString }) => (
                            //     onDateChanged(dateString, siteId),
                            //     setSelectedDate(dateString)
                            // )}
                            initialPosition='closed'
                            disablePan
                            hideKnob
                            allowShadow={false}
                            renderArrow={(direction) => direction === 'left' ?
                                <Icon as={AntDesign} name="left" size="md" color={'#a754ee'} /> :
                                <Icon as={AntDesign} name="right" size="md" color={'#a754ee'} />
                            }
                            renderHeader={(date) =>
                                <HStack space={6} alignItems={'center'}>
                                    <Text color={'#a754ee'}>{moment(date).format('DD MMMM')}</Text>
                                    <IconButton
                                        onPress={() => setIsExpanded(!isExpanded)}
                                        icon={
                                            <Icon name='calendar' as={AntDesign} color={'#a754ee'} size={'md'} />
                                        }
                                    />
                                </HStack>
                            }
                            style={{
                                marginTop: -5,
                                backgroundColor: '#fff'
                            }}
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                selectedDayTextColor: '#ffffff',
                                selectedDotColor: '#ffffff',
                                textSectionTitleColor: globalTheme.colors.primary[400],
                                selectedDayBackgroundColor: globalTheme.colors.primary[400],
                                todayTextColor: globalTheme.colors.primary[400],
                                dotColor: globalTheme.colors.primary[400],
                                dayTextColor: globalTheme.colors.primary[400],
                                // textSectionTitleDisabledColor: '#d9e1e8',
                                // textDisabledColor: globalTheme.colors.primary[400],
                                // arrowColor: 'orange',
                                // disabledArrowColor: '#d9e1e8',
                                // monthTextColor: 'blue',
                                // indicatorColor: 'blue',
                                // textDayFontFamily: 'monospace',
                                // textMonthFontFamily: 'monospace',
                                // textDayHeaderFontFamily: 'monospace',
                                textDayFontWeight: '200',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '300',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 16
                            }}
                        />
                        :

                        <Calendar
                            firstDay={1}
                            markedDates={marked}
                            onDayPress={(date) => console.log(date)}
                            renderHeader={(date) =>
                                <HStack space={6} alignItems={'center'}>
                                    <Text color={'#a754ee'}>{moment(date).format('DD MMMM')}</Text>
                                    <IconButton
                                        onPress={() => setIsExpanded(!isExpanded)}
                                        icon={
                                            <Icon name='calendar' as={AntDesign} color={'#a754ee'} size={'md'} />
                                        }
                                    />
                                </HStack>
                            }
                            renderArrow={(direction) => direction === 'left' ?
                                <Icon as={AntDesign} name="left" size="md" color={'#a754ee'} /> :
                                <Icon as={AntDesign} name="right" size="md" color={'#a754ee'} />
                            }
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                selectedDayTextColor: '#ffffff',
                                selectedDotColor: '#ffffff',
                                textSectionTitleColor: globalTheme.colors.primary[400],
                                selectedDayBackgroundColor: globalTheme.colors.primary[400],
                                todayTextColor: globalTheme.colors.primary[400],
                                dotColor: globalTheme.colors.primary[400],
                                dayTextColor: globalTheme.colors.primary[400],
                                // textSectionTitleDisabledColor: '#d9e1e8',
                                // textDisabledColor: globalTheme.colors.primary[400],
                                // arrowColor: 'orange',
                                // disabledArrowColor: '#d9e1e8',
                                // monthTextColor: 'blue',
                                // indicatorColor: 'blue',
                                // textDayFontFamily: 'monospace',
                                // textMonthFontFamily: 'monospace',
                                // textDayHeaderFontFamily: 'monospace',
                                textDayFontWeight: '200',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '300',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 16
                            }}
                            style={{
                                marginTop: -5
                            }}
                        />
                }


            </CalendarProvider>
        </View>
    );


    return (
        <Box style={{ flex: 1 }}>
            <Stack space={2} flex={1}>
                <ListingOptionsCard
                    totalResults={shifts.length}
                    onFilterPress={() => setShow(true)}
                />
                <TabView
                    navigationState={{ index, routes }}
                    renderTabBar={renderTabBar}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                />
            </Stack>

            <Box backgroundColor={'primary.100'} p={4} >
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Heading color={'primary.500'} fontWeight={'normal'} fontSize={'md'}>Total Hours</Heading>
                    <Heading color={'primary.500'} fontWeight={'normal'}>0</Heading>
                </HStack>
            </Box>

            <FilterModal
                show={show}
                setShow={setShow}
                setFilter={setFilter}
                onFilter={(values) => (
                    setFilterValues(values),
                    setFilter(true),
                    loadFilterData()
                )}
                inputs={[
                    {
                        label: 'Schedules',
                        type: 'searchDrowpdown',
                        values: []
                    },
                    {
                        label: 'Status',
                        type: 'searchDrowpdown',
                        key: 'statusId',
                        values: [
                            {
                                statusId: 1,
                                status: 'All Status'
                            },
                            {
                                statusId: 2,
                                status: 'Pending Approval'
                            },
                            {
                                statusId: 3,
                                status: 'Approved'
                            },
                            {
                                statusId: 3,
                                status: 'Expired'
                            },
                            {
                                statusId: 4,
                                status: 'Denied'
                            },
                            {
                                statusId: 5,
                                status: 'Canceled'
                            },
                        ],
                        selectLabel: 'status',
                        value: filterValue.statusId
                    },
                    {
                        label: 'Site',
                        type: 'select',
                        values: sites,
                        selectLabel: 'name',
                        key: 'siteId',
                        value: filterValue.siteId
                    },
                ]}
                datePickers={[
                    { fromDate: false },
                    { toDate: false }
                ]}
                clearFilter={{
                    name: '',
                    fromDate: new Date(),
                    toDate: new Date()
                }}
            />
        </Box>

    );
};

const mapStateToProps = state => {
    return {
        positions: state.admin.positions,
        shifts: state.employee.schedule.shifts,
        sites: state.admin.sites
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getpositions: data => dispatch(getAllPositions(data)),
        getShifts: data => dispatch(getAllShifts(data)),
        getAllSites: data => dispatch(getAllSites(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShiftScreen);
