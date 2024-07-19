import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Button, Dimensions, useWindowDimensions, } from 'react-native';

// Native Base
import { Box, Fab, HStack, Heading, Icon, Pressable, Stack, Text, useTheme, IconButton, FlatList, Avatar, Spinner, useToast } from 'native-base';

// React Natvigation
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// React Native Calender
import isEmpty from 'lodash/isEmpty';
import { CalendarProvider, ExpandableCalendar, AgendaList, Calendar } from 'react-native-calendars';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

//Component
import ListingOptionsCard from '../../../../components/ListingOptionsCard';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import FilterModal from '../../../../components/FilterModal';
import moment from 'moment';

// Redux
import { connect } from 'react-redux'
import { getAllPositions, getAllShifts } from '../../../../redux/actions/adminActions';
import AllShifts from './routes/AllShifts';
import OpenShifts from './routes/OpenShifts';
import MyShifts from './routes/MyShifts';
// import AllShifts from './routes/AllShifts';


const ShiftScreen = (props) => {

  const { positions, getpositions, allShifts, openShifts, myShifts, getShifts } = props

  const layout = useWindowDimensions()
  const navigation = useNavigation()
  const globalTheme = useTheme()
  const toast = useToast()



  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'first', title: 'ALL SHIFTS' },
    { key: 'second', title: 'OPEN SHIFTS' },
    { key: 'third', title: 'MY SHIFTS' },
  ])
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [filter, setFilter] = useState(false)
  const [filterValue, setFilterValues] = useState({})
  const [isExpanded, setIsExpanded] = useState(false)

  const flatListRef = useRef(null);


  useEffect(() => {
    loadData()
  }, [])



  const loadData = async () => {
    setLoading(true)
    try {
      await getpositions({})
      await getShifts({
        siteId: null,
        employeeId: null,
        scheduleId: null,
        positionId: null,
        shiftStatus: 'All Shift'
      })
      await getShifts({
        siteId: null,
        employeeId: null,
        scheduleId: null,
        positionId: null,
        shiftStatus: 'Open Shift'
      })
      await getShifts({
        siteId: null,
        employeeId: null,
        scheduleId: null,
        positionId: null,
        shiftStatus: 'My Shift'
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


  const theme = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    selectedDayTextColor: '#ffffff',
    selectedDotColor: '#ffffff',
    textSectionTitleColor: globalTheme.colors.primary[400],
    selectedDayBackgroundColor: globalTheme.colors.primary[400],
    todayTextColor: globalTheme.colors.primary[400],
    dotColor: globalTheme.colors.primary[400],
    dayTextColor: globalTheme.colors.primary[400],
    textDayFontWeight: '200',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }


  const totalResult = () => {
    switch (index) {
      case 0:
        return allShifts
      case 1:
        return openShifts
      case 2:
        return myShifts
    }
  }



  const markedDates = {} || totalResult().reduce((acc, shift) => {
    const formattedDate = new Date(shift.shiftDate).toISOString().split('T')[0];
    acc[formattedDate] = {
      marked: true,
      selectedColor: globalTheme.colors.primary[400],
      dotColor: globalTheme.colors.primary[400]
    };
    return acc;
  }, {});


  const onDateSelect = (date) => {
    const dateString = moment(date.dateString).format('YYYY-MM-DD');
    const index = allShifts.findIndex(shift => moment(shift.shiftDate).format('YYYY-MM-DD') === dateString);
    if (index !== -1) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  }


  const FirstRoute = () => (
    <View style={{ flex: 1, marginTop: isExpanded ? 50 : -6 }}>
      {
        !loading ?
          <AllShifts flatListRef={flatListRef} />
          :
          <Box flex={1} justifyContent={'center'} alignItems={'center'}>
            <Spinner />
          </Box>
      }
    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1, marginTop: isExpanded ? 50 : 0 }}>
      <OpenShifts />
    </View>
  );

  const ThirdRoute = () => (
    <View style={{ flex: 1, marginTop: isExpanded ? 50 : 0 }}>
      <MyShifts />
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const renderTabBar = props => (
    <View style={{ flex: isExpanded ? 1 : 0.375 }}>
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: 'white' }}
        tabStyle={{ backgroundColor: '#a754ee' }}
      />
      <CalendarProvider
        date={new Date()}
        // showTodayButton={showButton ? true : false}
        todayButtonStyle={{
          position: 'absolute',
          right: 3,
          top: -150
        }}
        theme={{
          todayButtonTextColor: '#a754ee',
          calendarBackground: 'white',
          textMonthFontWeight: 'bold'
        }}
        onDayPress={onDateSelect}
      >
        {
          !isExpanded ?
            <ExpandableCalendar
              firstDay={1}
              markedDates={markedDates}
              onDayPress={onDateSelect}
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
              theme={theme}
            />
            :
            <Calendar
              firstDay={1}
              markedDates={markedDates}
              onDayPress={onDateSelect}
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
              theme={theme}
              style={{
                marginTop: -5
              }}
            />
        }

      </CalendarProvider>
    </View>
  );

  const shiftCount = totalResult()?.length;

  return (
    <Box variant={'container'}>
      <Stack mt={2} space={2} flex={1} >
        <ListingOptionsCard
          totalResults={shiftCount}
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

      <HStack backgroundColor={'primary.200'} p={4} justifyContent={'space-between'} alignItems={'center'}>
        <Heading color={'primary.500'} fontWeight={'normal'}>Total Hours</Heading>
        <Heading color={'primary.500'} fontWeight={'normal'}>0</Heading>
      </HStack>

      < Fab
        bottom={'20'}
        renderInPortal={false}
        icon={<Icon as={AntDesign} name={'plus'} />}
        onPress={() => navigation.navigate("Add Shift Screen", { updateData: null })}
      />

      <FilterModal
        show={show}
        setShow={setShow}
        setFilter={setFilter}
        onFilter={(values) => (
          setFilterValues(values),
          setFilter(true)
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
            value: filterValue.id
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

  )
}

const mapStateToProps = state => {
  return {
    positions: state.admin.positions,
    allShifts: state.admin.shifts.allShifts,
    openShifts: state.admin.shifts.openShifts,
    myshifts: state.admin.shifts.myshifts
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getpositions: data => dispatch(getAllPositions(data)),
    getShifts: data => dispatch(getAllShifts(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShiftScreen);