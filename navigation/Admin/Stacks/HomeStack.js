import React from 'react'

// React Navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import HomeScreen from '../Screens/Home/HomeScreen'
import AttendanceScreen from '../Screens/AttendanceScreen'
import AttendanceStats from '../Screens/Home/AttendanceStats'
import AccountSetupStack from '../../AccountSetup/AccountSetupStack'
import PositionsScreen from '../../AccountSetup/Screens/PositionsScreen'
import EmployeesScreen from '../../AccountSetup/Screens/EmployeesScreen'

const Stack = createStackNavigator()

const HomeStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* Dashboard */}
            {/* <Stack.Screen name='Account setup' component={AccountSetupStack} /> */}
            <Stack.Screen name='Home Screen' component={HomeScreen} />
            <Stack.Screen name='Attendance Stats' component={AttendanceStats} />
            <Stack.Screen name='Add Position Screen' component={PositionsScreen} />
            <Stack.Screen name='Add Employee Screen' component={EmployeesScreen} />

        </Stack.Navigator>
    )
}

export default HomeStack