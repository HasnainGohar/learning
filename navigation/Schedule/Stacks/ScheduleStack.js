import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import ScheduleScreen from '../Schedules/ScheduleScreen'
import AddScheduleScreen from '../Schedules/AddScheduleScreen'



const ScheduleStack = () => {

    const Stack = createStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name='Schedule Screen' component={ScheduleScreen} />
            <Stack.Screen name='Add Schedule Screen' component={AddScheduleScreen} />
        </Stack.Navigator>
    )
}

export default ScheduleStack
