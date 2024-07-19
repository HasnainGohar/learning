import React from 'react'

// React Navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import SignInScreen from './Screens/SignInScreen'
import RegisterScreen from './Screens/RegisterScreen'
import SubscriptionScreen from './Screens/SubscriptionScreen'
import ForgetPassword from './Screens/ForgetPassword'
import SignupScreen from './Screens/SignupScreen'


const Stack = createStackNavigator()

const AuthStack = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name='Sign In' component={SignInScreen} />
            <Stack.Screen name='Register Screen' component={RegisterScreen} />
            <Stack.Screen name='Subscription Screen' component={SubscriptionScreen} />
            <Stack.Screen name='Forget Password Screen' component={ForgetPassword} />
            <Stack.Screen name='Signup Screen' component={SignupScreen} />
        </Stack.Navigator>
    )
}

export default AuthStack