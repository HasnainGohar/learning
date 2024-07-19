import React from 'react'

// React Navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import HomeScreen from '../Screens/Home/HomeScreen'
import AnnouncementScreen from '../Screens/Home/AnnouncementScreen'


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
            <Stack.Screen name='Employee Home Screen' component={HomeScreen} initialParams={{ userID: null }} />
            <Stack.Screen name='Announcemennt Screen' component={AnnouncementScreen} />


        </Stack.Navigator>
    )
}

export default HomeStack