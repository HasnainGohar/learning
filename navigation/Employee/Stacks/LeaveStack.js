import React from 'react'

// React Navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens

import LeavesScreen from '../Screens/Leave/LeavesScreen'
import AddLeavesScreen from '../Screens/Leave/AddLeaveScreen'




const Stack = createStackNavigator()

const LeaveStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* Leaves  */}
            <Stack.Screen name='Employee Leaves list' component={LeavesScreen} />
            <Stack.Screen name='Employee Add Leave Screen' component={AddLeavesScreen} />

        </Stack.Navigator>
    )
}

export default LeaveStack
