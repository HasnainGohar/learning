import React, { memo, useCallback, useContext } from 'react'
import { Linking } from 'react-native'

// React Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Stack, Icon, HStack, Card, Divider, Avatar, Text, Image, Button, Fab, FlatList, ScrollView, Badge } from 'native-base'


// Icons
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'

// Context API
import AuthGlobal from '../../../../context/store/AuthGlobal'
import { logoutUser } from '../../../../context/actions/Auth.actions'

// Components
import LoadingIndicator from '../../../../components/LoadingIndicator'

// Redux
import { connect } from 'react-redux'
import { clearState } from '../../../../redux/actions/adminActions'

const SettingScreen = (props) => {

    const { clearState } = props


    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const menu = [
        {
            title: 'Attendance History',
            iconType: <Ionicons />,
            iconName: 'calendar-outline',
            screen: 'Attendance Screen',
            canView: context.stateUser.user.ViewAttendanceModule == 'True' ? true : false
        },
        {
            title: 'Employee Management',
            iconType: <Ionicons />,
            iconName: 'person-outline',
            screen: 'Employees',
            canView: context.stateUser.user.ViewEmployeeModule == 'True' ? true : false,
            params:'Employees'
        },
        {
            title: 'Leave Management',
            iconType: <Ionicons />,
            iconName: 'today-outline',
            screen: 'Leaves DashBoard Screen',
            canView: context.stateUser.user.ViewLeaveModule == 'True' ? true : false
        },
        {
            title: 'Loan Management',
            iconType: <MaterialCommunityIcons />,
            iconName: 'account-cash-outline',
            screen: 'Loans Screen',
            canView: context.stateUser.user.IsSuperAdmin == 'True' ? true : false
        },
        {
            title: 'Task Management',
            iconType: <MaterialIcons />,
            iconName: 'assignment',
            screen: 'Task Screen',
            canView: context.stateUser.user.ViewTaskModule == 'True' ? true : false
        },
        {
            title: 'Public Holiday',
            iconType: <Ionicons />,
            iconName: 'earth-outline',
            screen: 'Holidays Screen',
            canView: context.stateUser.user.ViewAttendanceModule == 'True' ? true : false
        },
        {
            title: 'User',
            iconType: <Ionicons />,
            iconName: 'briefcase-outline',
            screen: 'Users Screen',
            canView: context.stateUser.user.ViewUserModule == 'True' ? true : false
        },
        {
            title: 'Positions',
            iconType: <Fontisto />,
            iconName: 'persons',
            screen: 'Position Screen',
            canView: context.stateUser.user.ViewPositionModule == 'True' ? true : false
        },
        {
            title: 'Sites',
            iconType: <Ionicons />,
            iconName: 'business-outline',
            screen: 'Sites Screen',
            canView: context.stateUser.user.ViewSiteModule == 'True' ? true : false
        },
        {
            title: 'Company Profile',
            iconType: <Ionicons />,
            iconName: 'business-outline',
            screen: 'CompanyScreen',
            canView: context.stateUser.user.ViewCompanyModule == 'True' ? true : false
        },
        {
            title: 'Role',
            iconType: <MaterialCommunityIcons />,
            iconName: 'account-lock-outline',
            screen: 'Role Screen',
            canView: context.stateUser.user.ViewRoleModule == 'True' ? true : false
        },
        {
            title: 'Biometric',
            iconType: <MaterialCommunityIcons />,
            iconName: 'fingerprint',
            screen: 'Biometric Screen',
            canView: context.stateUser.user.ViewAttendanceModule == 'True' ? true : false
        },
        {
            title: 'Announcements',
            iconType: <MaterialIcons />,
            iconName: 'announcement',
            screen: 'Announcements Screen',
            canView: context.stateUser.user.ViewAnnouncementModule == 'True' ? true : false
        },
        // {
        //     title: 'Schedule',
        //     iconType: <Ionicons />,
        //     iconName: 'calendar-outline',
        //     screen: 'Schedule',
        //     canView: context.stateUser.user.ViewScheduleModule == 'True' ? true : false
        // },
    ]


    const MenuItem = memo(({ item, index, totalItems }) => {
        return (
            <>
                <Button
                    justifyContent="flex-start"
                    variant={'ghost'}
                    borderTopRadius={index === 0 ? 15 : 0}
                    borderBottomRadius={0}
                    leftIcon={<Icon as={item.iconType} name={item.iconName} mr={2} />}
                    onPress={() => navigation.navigate(item.screen, { params: item?.params ? item?.params : null })}
                >
                    {item.title}
                </Button>
                <Divider opacity={0.5} />
            </>
        );
    })

    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Stack mb={10} space={4} >
                    <Box variant={'card'} mt={6} mx={4} p={2} >
                        <HStack space={4} alignItems={'center'} justifyContent={'space-between'}  >
                            <HStack space={4} alignItems={'center'}>
                                <Avatar bgColor={'gray.300'} >
                                    <Icon as={AntDesign} name={'user'} size={'xl'} color={'trueGray.800'} />
                                </Avatar>
                                <Stack >
                                    <Text fontWeight={'600'} fontSize={18} color={'primary.600'} >{context.stateUser.user.UserFirstName} {context.stateUser.user.UserLastName}</Text>
                                    <Text fontSize={14} >{context.stateUser.user.CompanyName}</Text>
                                </Stack>
                            </HStack>

                            <Badge borderRadius={25} colorScheme={context.stateUser.user.SubscriptionType === 'Free' ? "warning" : "primary"} >
                                {context.stateUser.user.SubscriptionType === 'Free' ? 'Basic' : 'Premium'}
                            </Badge>

                        </HStack>
                    </Box>
                    {context.stateUser.user.SubscriptionType === 'Free' &&
                        <Button mx={4} variant={'subtle'} onPress={() => navigation.navigate("Upgrade To Pro Screen")} >Upgrade To Premium</Button>
                    }

                    <Box variant={'card'} mx={4} p={0} >

                        {/* .filter(item => item.canView) */}
                        {menu.filter(item => item.canView).map((item, index) => (
                            <MenuItem key={index} item={item} index={index} totalItems={menu.length} />
                        ))
                        }
                        <Button
                            justifyContent="flex-start"
                            variant={'ghost'}
                            borderRadius={0}
                            borderBottomRadius={15}
                            leftIcon={<Icon as={MaterialCommunityIcons} name={'logout'} mr={2} size={'md'} />}
                            onPress={() => (
                                logoutUser(context.dispatch),
                                clearState()
                            )}
                        >Logout</Button>
                    </Box>
                </Stack >
            </ScrollView>
            <Fab
                bottom={7}
                size={'lg'}
                renderInPortal={false}
                label="Raise a ticket"
                onPress={() => Linking.openURL('https://workforceverse.atlassian.net/servicedesk/customer/portal/1/group/1/create/1')}
            />
        </Box >
    )
}

const mapStateToProps = state => {
    return {

    }
}
const mapDispatchToProps = dispatch => {
    return {
        clearState: () => dispatch(clearState())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)