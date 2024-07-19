import React from 'react'

// React Navigation
import { createStackNavigator } from '@react-navigation/stack'
import EmployeesScreen from './Screens/EmployeesScreen'
import PositionsScreen from './Screens/PositionsScreen'
import PaymentScreen from './Screens/PaymentScreen'

// Screens


const Stack = createStackNavigator()

const AccountSetupStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false,
            }}
        >
            
            <Stack.Screen name={'Add Positions'} component={PositionsScreen} />
            <Stack.Screen name={'Add Employees'} component={EmployeesScreen} />
        </Stack.Navigator>
    )
}

export default AccountSetupStack