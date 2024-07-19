import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { createStackNavigator } from '@react-navigation/stack'

// Screens
import AgendaScreen from '../Screens/Shift/ShiftScreen'
import AddShiftScreen from '../Screens/Shift/AddShiftScreen'
import ShiftDetailsScreen from '../Screens/Shift/ShiftDetailsScreen'

const ShiftStack = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Agenda Screen' component={AgendaScreen} />
            <Stack.Screen name='Add Shift Screen' component={AddShiftScreen} />
            <Stack.Screen name='Shift Details Screen' component={ShiftDetailsScreen} />
        </Stack.Navigator>
    )
}

export default ShiftStack

const styles = StyleSheet.create({})