import React from 'react'

// Navigation 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Native Base
import { Icon } from 'native-base'

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Redux
import { connect } from 'react-redux'

// Stacks
import HomeStack from './Stacks/HomeStack'
import SettingStack from './Stacks/SettingStack'
import AttendanceScreen from './Screens/AttendanceScreen'
import EmployeeStack from './Stacks/EmployeeStack'
import ComplianceDashboard from './Screens/Employee/ComplianceDashboard'
import ApprovalScreen from './Screens/ApprovalScreen'

const Tab = createBottomTabNavigator()

const AdminContainer = (props) => {
    const { leaveRequests, loanRequests } = props

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#810be7',
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;
                    let type;

                    if (rn === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline',
                            type = Ionicons
                    } else if (rn === 'Approvals') {
                        iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline',
                            type = Ionicons
                    } else if (rn === 'Check in/out') {
                        iconName = focused ? 'clock-time-four-outline' : 'clock-time-four-outline',
                            type = MaterialCommunityIcons
                    }
                    else if (rn === 'Employees') {
                        iconName = focused ? 'people-sharp' : 'people-outline',
                            type = Ionicons
                    } else if (rn === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline',
                            type = Ionicons
                    }

                    return <Icon as={type} name={iconName} color={color} size={size} />
                },
            })}
        >
            <Tab.Screen name='Dashboard' component={HomeStack} />
            <Tab.Screen name='Approvals' component={ApprovalScreen} options={{
                tabBarBadge: (leaveRequests?.length || loanRequests?.length) ? leaveRequests?.length + loanRequests?.length : null
            }} />
            <Tab.Screen name='Check in/out' component={AttendanceScreen} options={{
                tabBarStyle: {
                    display: 'none'
                }
            }} />
            <Tab.Screen name='Employees' initialParams={{ params: 'Compliance Dashboard' }} component={EmployeeStack} />
            <Tab.Screen name='Settings' component={SettingStack} />
        </Tab.Navigator>
    )
}

const mapStateToProps = state => {
    return {
        leaveRequests: state.admin.leaves.request,
        loanRequests: state.admin.loans.request
    }
}


export default connect(mapStateToProps, null)(AdminContainer)