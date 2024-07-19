import React, { useContext } from 'react'
import { Platform } from 'react-native';


// Navigation 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Context 

import AuthGlobal from '../../context/store/AuthGlobal';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons'

// Stacks
import HomeStack from './Stacks/HomeStack'
import AttendanceScreen from './Screens/AttendanceScreen'
import LeaveStack from './Stacks/LeaveStack'
import SettingStack from './Stacks/SettingStack'
import RequestStack from '../Schedule/Employee/Stack/RequestStack';
import ScheduleStack from '../Schedule/Employee/Stack/ScheduleStack';
import AddRequestScreen from '../Schedule/Employee/Screens/Requests/AddRequestScreen';

const Tab = createBottomTabNavigator()

const EmployeeContainer = () => {

    const isSchedule = true

    const context = useContext(AuthGlobal)

    const tabBarPaddingBottom = Platform.OS === 'ios' ? 20 : 5;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#810be7',
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true,
                tabBarStyle: {
                    paddingBottom: tabBarPaddingBottom
                },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === 'Employee Home') {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === 'Employee Attendance History') {
                        iconName = focused ? 'calendar' : 'calendar-outline'
                    }
                    else if (rn === 'Employee Leave') {
                        iconName = focused ? 'today' : 'today-outline'
                    } else if (rn === 'Employee Setting') {
                        iconName = focused ? 'settings' : 'settings-outline'
                    }

                    return <Ionicons name={iconName} color={color} size={size} />
                },

                unmountOnBlur: true
            })}
        >
            <Tab.Screen name='Employee Home' component={HomeStack} options={{ title: 'Home' }} />
            <Tab.Screen name='Employee Attendance History' initialParams={{ filter: null }} component={AttendanceScreen} options={{ title: 'Attendance' }} />
            <Tab.Screen name='Employee Leave' component={LeaveStack} options={{ title: 'Leave' }} />
            <Tab.Screen name='Employee Setting' component={SettingStack} options={{ title: 'Setting' }} />
        </Tab.Navigator>
    )
}

export default EmployeeContainer