import React from 'react'


// React navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import RequestTimeOffScreen from '../Screens/ShiftRequets/RequestTimeOffScreen'
import AddRequestScreen from '../Screens/ShiftRequets/AddRequestScreen'
import RequestDetailsScreen from '../Screens/ShiftRequets/RequestDetailsScreen'
import ShiftDetailsScreen from '../Screens/Shift/ShiftDetailsScreen'

const RequestStack = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='Shift Request Screen' component={RequestTimeOffScreen} />
            <Stack.Screen name='Add Request Screen' component={AddRequestScreen} />
            <Stack.Screen name='Request Details Screen' component={RequestDetailsScreen} />
            <Stack.Screen name='Shift Details Screen' component={ShiftDetailsScreen} />
        </Stack.Navigator>
    )
}

export default RequestStack
