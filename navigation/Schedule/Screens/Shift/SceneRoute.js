import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, useWindowDimensions, } from 'react-native';

// Native Base
import { Box, Fab, HStack, Heading, Icon } from 'native-base';

// React Natvigation
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// React Native Calender
import isEmpty from 'lodash/isEmpty';
import { CalendarProvider, ExpandableCalendar, AgendaList } from 'react-native-calendars';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import BackHeader from '../../../../components/BackHeader';


const SceneRoute = () => {

  const layout = useWindowDimensions()
  const navigation = useNavigation()

  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'first', title: 'ALL SHIFTS' },
    { key: 'second', title: 'OPEN SHIFTS' },
    { key: 'third', title: 'MY SHIFTS' },
  ]);

  const count = useRef(0)

  const today = new Date().toISOString().split('T')[0];

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  };

  const agendaItems = {
    [today]: [{ hour: '9am', duration: '1h', title: 'Morning Yoga' }],
    [addDays(today, 1)]: [
      { hour: '10am', duration: '1h', title: 'Work meeting' },
      { hour: '12pm', duration: '1h', title: 'Lunch with Sarah' },
    ],
    [addDays(today, 2)]: [{
      hour: '10am', duration: '1h', title: 'Work meeting'
    },
    { hour: '12pm', duration: '1h', title: 'Lunch with Sarah' },],
    [addDays(today, 3)]: [],
    [addDays(today, 4)]: [],
    [addDays(today, 5)]: [
      { hour: '10am', duration: '1h', title: 'Work meeting' },
      { hour: '12pm', duration: '1h', title: 'Lunch with Sarah' },
    ],
    [addDays(today, 6)]: [],
    [addDays(today, 7)]: [{ hour: '2pm', duration: '2h', title: 'Dentist Appointment' }],

  }

  const [items, setItems] = useState(agendaItems || {});


  const getMarkedDates = () => {
    const markedDates = {};
    Object.keys(items).forEach((date) => {
      markedDates[date] = items[date].length > 0 ? { marked: true } : { disabled: true, dotColor: 'grey' };
    });
    return markedDates;
  };

  const renderItem = (item) => {
    if (isEmpty(item)) {
      return (
        <View style={styles.itemContainer}>
          <Text>No shift on that day</Text>
        </View>
      );
    }

    return (
      <View style={styles.itemContainer}>
        <Text>{item?.title || 'asdsa'}</Text>
        <Text>{`${item.hour} - Duration: ${item.duration}`}</Text>
      </View>
    );
  };


  const FirstRoute = () => (
    <View style={{ flex: 1, marginTop: 50 }}>

      <AgendaList
        sections={Object.keys(items).map((date) => ({ title: date, data: items[date].length > 0 ? items[date] : [{}] }))}
        renderItem={({ item }) => renderItem(item)}
        sectionStyle={styles.section}
        theme={{
          todayButtonTextColor: '#a754ee',
          // todayBackgroundColor: 'red'
        }}
      />

    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1 }}>

      <AgendaList
        sections={Object.keys(items).map((date) => ({ title: date, data: items[date].length > 0 ? items[date] : [{}] }))}
        renderItem={({ item }) => renderItem(item)}
        sectionStyle={styles.section}
        theme={{
          todayButtonTextColor: '#a754ee',
          // todayBackgroundColor: 'red'

        }}
      />

    </View>
  );

  const ThirdRoute = () => (
    <View style={{ flex: 1 }}>
      <AgendaList
        sections={Object.keys(items).map((date) => ({ title: date, data: items[date].length > 0 ? items[date] : [{}] }))}
        renderItem={({ item }) => renderItem(item)}
        sectionStyle={styles.section}
        theme={{
          todayButtonTextColor: '#a754ee',
          // todayBackgroundColor: 'red'
        }}
      />

    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const renderTabBar = props => (
    <View style={{ flex: 1 }}>
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: 'white' }}
        tabStyle={{ backgroundColor: '#a754ee' }}
      />
      <CalendarProvider
        date={today}
        theme={{
          todayButtonTextColor: '#a754ee',
          // todayBackgroundColor: 'red',
        }}
        style={{
          height: 100
        }}
      >
        <ExpandableCalendar
          firstDay={1}
          markedDates={getMarkedDates()}
          renderArrow={(direction) => direction === 'left' ?
            <Icon as={AntDesign} name="left" size="md" color={'#a754ee'} /> :
            <Icon as={AntDesign} name="right" size="md" color={'#a754ee'} />
          }
          theme={{
            todayButtonTextColor: '#a754ee',
            // todayBackgroundColor: 'red'

          }}
          style={{
            height: 100
          }}

        />
      </CalendarProvider>
    </View>
  );

  
  return (
    <View style={{ flex: 1 }}>
      <BackHeader>
        Default
      </BackHeader>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
      < Fab
        bottom={20}
        renderInPortal={false}
        icon={<Icon as={AntDesign} name={'plus'} />}
        onPress={() => navigation.navigate("Add Shift Screen", { updateData: null })}
      />
      <Box backgroundColor={'black'} p={4} >
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <Heading color={'white'} fontWeight={'normal'}>Total Hours</Heading>
          <Heading color={'white'} fontWeight={'normal'}>0</Heading>
        </HStack>
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  section: {
    fontSize: 15,
    backgroundColor: '#f0f0f0',
    color: '#000',
    fontWeight: 'normal'
  },
  scene: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'skyblue',
  },
});

export default SceneRoute;
