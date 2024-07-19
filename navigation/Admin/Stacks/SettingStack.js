import React from 'react'

// React Navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import SettingScreen from '../Screens/Setting/SettingScreen'
import LeaveScreen from '../Screens/Setting/Leave/LeaveScreen'
import LoanScreen from '../Screens/Setting/Loan/LoanScreen'
import AnnouncementScreen from '../Screens/Setting/Announcement/AnnouncementScreen'
import HolidayScreen from '../Screens/Setting/Holiday/HolidayScreen'
import SiteScreen from '../Screens/Setting/Site/SiteScreen'
import UserScreen from '../Screens/Setting/User/UserScreen'
import CompanyScreen from '../Screens/Setting/Company/CompanyScreen'
import AttendanceHistory from '../Screens/Setting/Attendance/AttendanceHistory'
import AddLeaveScreen from '../Screens/Setting/Leave/AddLeaveScreen'
import AddLoanScreen from '../Screens/Setting/Loan/AddLoanScreen'
import UpdateCompanyScreen from '../Screens/Setting/Company/UpdateCompanyScreen'
import AddSiteScreen from '../Screens/Setting/Site/AddSiteScreen'
import AddAnnounmentScreen from '../Screens/Setting/Announcement/AddannounmentScreen'
import AddHolidayScreen from '../Screens/Setting/Holiday/AddHolidayScreen'
import AddUserScreen from '../Screens/Setting/User/AddUserScreen'
import LoanDetail from '../Screens/Setting/Loan/LoanDetail'
import RepayLoan from '../Screens/Setting/Loan/RepayLoan'
import Biometric from '../../../components/Biometric'
import PositionScreen from '../Screens/Setting/Position/PositionScreen'
import AddPosition from '../Screens/Setting/Position/AddPosition'
import ExportScreen from '../Screens/Setting/Exports/ExportScreen'

import UpgradeToPro from '../Screens/Setting/Upgrade/UpgradeToPro'
import SubscriptionForm from '../Screens/Setting/Upgrade/SubscriptionForm'

import LeaveDashboardScreen from '../Screens/Setting/Leave/LeaveDashboardScreen'
import EmployeeLeaveStats from '../Screens/Setting/Leave/EmployeeLeaveStats'
import RoleScreen from '../Screens/Setting/Role/RoleScreen'
import AddRoleScreen from '../Screens/Setting/Role/AddRoleScreen'
import TaskScreen from '../Screens/Setting/Task/TaskScreen'
import AddTaskScreen from '../Screens/Setting/Task/AddTaskScreen'
import TaskDetailsScreen from '../Screens/Setting/Task/TaskDetailsScreen'
import ScheduleStack from '../../Schedule/Stacks/ScheduleStack'



const Stack = createStackNavigator()

const SettingStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Setting Screen'
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name='Setting Screen' component={SettingScreen} />

            <Stack.Screen name='Attendance Screen' component={AttendanceHistory} />

            {/* Leaves */}
            <Stack.Screen name='Leaves DashBoard Screen' component={LeaveDashboardScreen} />
            <Stack.Screen name='Employee Leave Stats' component={EmployeeLeaveStats} />
            <Stack.Screen name='Leaves Screen' component={LeaveScreen} />
            <Stack.Screen name='Add Leave Screen' component={AddLeaveScreen} />

            {/* Loans */}
            <Stack.Screen name='Loans Screen' component={LoanScreen} />
            <Stack.Screen name='Add Loan Screen' component={AddLoanScreen} />
            <Stack.Screen name='Loan Details Screen' component={LoanDetail} />
            <Stack.Screen name='Repay Loan Screen' component={RepayLoan} />

            {/* Tasks */}
            <Stack.Screen name='Task Screen' component={TaskScreen} />
            <Stack.Screen name='Task Details Screen' component={TaskDetailsScreen} />
            <Stack.Screen name='Add Task Screen' component={AddTaskScreen} />

            {/* Holiday */}
            <Stack.Screen name='Holidays Screen' component={HolidayScreen} />
            <Stack.Screen name='Add Holiday Screen' component={AddHolidayScreen} />

            {/* Company */}
            <Stack.Screen name='CompanyScreen' component={CompanyScreen} />
            <Stack.Screen name='Update Company Screen' component={UpdateCompanyScreen} />

            {/* Positions */}

            <Stack.Screen name='Position Screen' component={PositionScreen} />
            <Stack.Screen name='Add Position Screen' component={AddPosition} />

            <Stack.Screen name='Biometric Screen' component={Biometric} />

            {/* Site */}
            <Stack.Screen name='Sites Screen' component={SiteScreen} />
            <Stack.Screen name='Add Site Screen' component={AddSiteScreen} />


            {/* Announcements */}
            <Stack.Screen name='Announcements Screen' component={AnnouncementScreen} />
            <Stack.Screen name='Add Announcement Screen' component={AddAnnounmentScreen} />

            {/* Exports */}
            <Stack.Screen name='Export Screen' component={ExportScreen} />

            {/* User */}
            <Stack.Screen name='Users Screen' component={UserScreen} />
            <Stack.Screen name='Add User Screen' component={AddUserScreen} />


            <Stack.Screen name='Upgrade To Pro Screen' component={UpgradeToPro} />
            <Stack.Screen name='Subscription Form Screen' component={SubscriptionForm} />
            {/* Role */}
            <Stack.Screen name='Role Screen' component={RoleScreen} />
            <Stack.Screen name='Add Role Screen' component={AddRoleScreen} />

            <Stack.Screen name='Schedule' component={ScheduleStack} />


        </Stack.Navigator>
    )
}

export default SettingStack