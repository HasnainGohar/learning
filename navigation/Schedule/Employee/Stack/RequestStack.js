import React from 'react'

// Navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import RequestScreen from '../../Employee/Screens/Requests/RequestScreen'
import AddRequestScreen from '../../Employee/Screens/Requests/AddRequestScreen'

const RequestStack = () => {
    
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='Shift Request Screen' component={RequestScreen} />
            <Stack.Screen name='Add Request Screen' component={AddRequestScreen} />
        </Stack.Navigator>
    )
}

export default RequestStack
