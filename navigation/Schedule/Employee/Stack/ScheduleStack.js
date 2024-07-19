import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import ShiftScreen from '../Screens/Shift/ShiftScreen'
import ShiftDetailsScreen from '../Screens/Shift/ShiftDetailsScreen'
// import AddScheduleScreen from '../../Employee/Screens/Shift'



const ScheduleStack = () => {

    const Stack = createStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name='Shift Screen' component={ShiftScreen} />
            <Stack.Screen name='Shift Details Screen' component={ShiftDetailsScreen} />
        </Stack.Navigator>
    )
}

export default ScheduleStack
