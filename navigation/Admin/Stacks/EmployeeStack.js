import React from 'react'

// React Navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import EmployeesScreen from '../Screens/Employee/EmployeesScreen'
import AddEmployeeScreen from '../Screens/Employee/AddEmployeeScreen'
import EmployeeDetailScreen from '../Screens/Employee/EmployeeDetailScreen'
import EmployeeDashboard from '../Screens/Employee/EmployeeDashboard'
import ComplianceDashboard from '../Screens/Employee/ComplianceDashboard'


const Stack = createStackNavigator()

const EmployeeStack = ({ route }) => {

    const { params } = route.params

    return (
        <Stack.Navigator
            // initialRouteName={params}
            screenOptions={{
                headerShown: false,
            }}

        >

            {/* Employee */}
            <Stack.Screen name='Employees Screen' component={EmployeesScreen} />
            <Stack.Screen name='Add Employee Screen' component={AddEmployeeScreen} />
            <Stack.Screen name='Employee Detail Screen' component={EmployeeDetailScreen} />
            <Stack.Screen name='Employee Home Screen' component={EmployeeDashboard} />
            <Stack.Screen name='Compliance Dashboard' component={ComplianceDashboard} />

        </Stack.Navigator>
    )
}

export default EmployeeStack