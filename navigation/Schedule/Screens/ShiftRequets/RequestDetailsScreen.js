import React, { useState } from 'react'

// Native Base
import { Box, HStack, Heading, Stack, Text, Icon, Button, useToast } from 'native-base'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Icon
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import BackHeader from '../../../../components/BackHeader'
import moment from 'moment'


// Redux
import { connect } from 'react-redux'
import { updateUserRequestTimeOff, requestDecision } from '../../../../redux/actions/adminActions'



const RequestDetailsScreen = (props) => {

    const { handleRequest, route, requestDecision } = props

    const { data, list } = route.params

    const toast = useToast()
    const navigation = useNavigation()

    const [loading, setLoading] = useState({
        approve: false,
        reject: false
    })

    const handleAprrove = async () => {
        setLoading(prev => ({ ...prev, approve: true }));
        try {
            const res = list == 'Off Time' ? await handleRequest({
                leaveId: data.leaveId,
                status: 'Approved'
            }) :
                await requestDecision({
                    shiftId: data.shiftId,
                    employeeId: data.employeeId,
                    shiftStatus: 'Approved',
                    list: list
                })
            if (res) {
                toast.show({
                    description: res.msg
                })
            }
            navigation.goBack()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(prev => ({ ...prev, approve: false }));
        }
    }

    const handleReject = async () => {
        setLoading(prev => ({ ...prev, reject: true }));
        try {
            const res = list == 'Off Time' ? await handleRequest({
                leaveId: data.leaveId,
                status: 'Rejected'
            })
                :
                await requestDecision({
                    shiftId: data.shiftId,
                    employeeId: data.employeeId,
                    shiftStatus: 'Rejected',
                    list: list
                })
            if (res) {
                toast.show({
                    description: res.msg
                })
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(prev => ({ ...prev, reject: false }));
        }
    }

    const heading = () => {
        switch (list) {
            case 'Off Time':
                return 'Time Request Details'
            case 'Shift':
                return 'Shift Request Details'
            case 'Open Shift':
                return 'Open Shift Request Details'
        }
    }



    return (
        <Box variant={'container'} safeAreaTop>
            <BackHeader>
                {heading()}
            </BackHeader>
            {
                list == 'Open Shift' &&
                <>
                    <Stack mx={4} space={8}>
                        <HStack space={2} alignItems={'center'}>
                            <Icon as={AntDesign} name='user' size={'xl'} />
                            <Stack>
                                <Text>
                                    who
                                </Text>
                                <Text fontSize={16}>
                                    {data.employeeName}
                                </Text>
                            </Stack>
                        </HStack>
                        <HStack space={2} alignItems={'center'}>
                            <Icon as={Ionicons} name='calendar-outline' size={'xl'} />

                            <Stack>
                                <Text>
                                    Date
                                </Text>
                                <Text fontSize={16}>
                                    {data.shiftDate}
                                </Text>
                            </Stack>
                        </HStack>
                        <HStack space={2} alignItems={'center'}>
                            <Icon as={AntDesign} name='user' size={'xl'} />
                            <Stack>
                                <Text>
                                    Time
                                </Text>
                                <Text fontSize={16}>
                                    {moment(data.startTime).format('h:ma')}-{moment(data.endTime).format('h:ma')}
                                </Text>
                            </Stack>
                        </HStack>
                        <HStack space={2} alignItems={'center'}>
                            <Icon as={Ionicons} name='calendar-outline' size={'xl'} />
                            <Stack>
                                <Text>Schdeule</Text>
                                <Text >{data.scheduleName}</Text>
                            </Stack>
                        </HStack>
                    </Stack>
                    <HStack position={'absolute'} bottom={10} justifyContent={'space-around'}>
                        <Button
                            width={'48%'}
                            variant={'subtle'}
                            colorScheme={'success'}
                            onPress={() => handleAprrove()}
                            isLoading={loading.approve}
                            isDisabled={loading.reject}

                        >
                            Approve
                        </Button>
                        <Button width={'48%'}
                            variant={'subtle'}
                            colorScheme={'error'}
                            isLoading={loading.reject}
                            isDisabled={loading.approve}
                            onPress={() => handleReject()}

                        >
                            Reject
                        </Button>
                    </HStack>
                </>

            }
            {
                list == 'Off Time' &&
                <Stack mx={4} space={8}>
                    <HStack space={2} alignItems={'center'}>
                        <Icon as={AntDesign} name='user' size={'xl'} />
                        <Stack>
                            <Text>
                                who
                            </Text>
                            <Text fontSize={16}>
                                {data.employeeName}
                            </Text>
                        </Stack>

                    </HStack>

                    {
                        data.allDay ?
                            <Stack space={8}>
                                {
                                    (data.startDate == data.endDate) ?
                                        <HStack space={2} alignItems={'center'}>
                                            <Icon as={Ionicons} name='calendar-outline' size={'xl'} />

                                            <Stack>
                                                <Text>
                                                    Date
                                                </Text>
                                                <Text fontSize={16}>
                                                    {moment(data.startDate).format('ddd MMM DD, yyyy')}
                                                </Text>
                                            </Stack>
                                        </HStack> :
                                        <Stack space={8}>
                                            <HStack space={2} alignItems={'center'}>
                                                <Icon as={Ionicons} name='calendar-clear-outline' size={'xl'} />
                                                <Stack>
                                                    <Text>
                                                        Start Date
                                                    </Text>
                                                    <Text fontSize={16}>
                                                        {moment(data.startDate).format('ddd MMM DD, yyyy')}
                                                    </Text>
                                                </Stack>
                                            </HStack>
                                            <HStack space={2} alignItems={'center'}>
                                                <Icon as={Ionicons} name='calendar-clear-outline' size={'xl'} />
                                                <Stack>
                                                    <Text>
                                                        End Date
                                                    </Text>
                                                    <Text fontSize={16}>
                                                        {moment(data.endDate).format('ddd MMM DD, yyyy')}
                                                    </Text>
                                                </Stack>
                                            </HStack>
                                        </Stack>
                                }
                                <HStack space={2} alignItems={'center'}>
                                    <Icon as={MaterialCommunityIcons} name='clock-time-four-outline' size={'xl'} />
                                    <Stack>
                                        <Text>
                                            Time
                                        </Text>
                                        <Text fontSize={16}>
                                            All Day
                                        </Text>
                                    </Stack>
                                </HStack>
                            </Stack> :
                            <Stack space={8}>
                                <HStack space={2} alignItems={'center'}>
                                    <Icon as={Ionicons} name='calendar-outline' size={'xl'} />

                                    <Stack>
                                        <Text>
                                            Date
                                        </Text>
                                        <Text fontSize={16}>
                                            {moment(data.shiftDate).format('ddd MMM DD, yyyy')}
                                        </Text>
                                    </Stack>
                                </HStack>
                                <HStack space={2} alignItems={'center'}>
                                    <Icon as={AntDesign} name='user' size={'xl'} />
                                    <Stack>
                                        <Text>
                                            Time
                                        </Text>
                                        <Text fontSize={16}>
                                            {moment(data.startTime).format('h:ma')}-{moment(data.endTime).format('h:ma')}
                                        </Text>
                                    </Stack>
                                </HStack>
                            </Stack>
                    }
                    <HStack space={2} alignItems={'center'}>
                        <Icon as={MaterialCommunityIcons} name='information' size={'xl'} />
                        <Stack>
                            <Text>
                                Time Off Type
                            </Text>
                            <Text fontSize={16}>
                                {data.leaveType}
                            </Text>
                        </Stack>
                    </HStack>
                    <HStack space={2} alignItems={'center'}>
                        <Icon as={MaterialCommunityIcons} name='flag' size={'xl'} />
                        <Stack>
                            <Text>
                                Status
                            </Text>
                            <Text fontSize={16}>
                                {data.status}
                            </Text>
                        </Stack>
                    </HStack>
                </Stack>
            }
            {
                data.status == 'Pending Approval' &&
                <HStack position={'absolute'} bottom={10} justifyContent={'space-around'}>
                    <Button
                        width={'48%'}
                        variant={'subtle'}
                        colorScheme={'success'}
                        onPress={() => handleAprrove()}
                        isLoading={loading.approve}
                        isDisabled={loading.reject}

                    >
                        Approve
                    </Button>
                    <Button width={'48%'}
                        variant={'subtle'}
                        colorScheme={'error'}
                        isLoading={loading.reject}
                        isDisabled={loading.approve}
                        onPress={() => handleReject()}

                    >
                        Reject
                    </Button>
                </HStack>
            }

            {
                list == 'Shift' &&

                <>
                    <Stack mx={4} space={8}>
                        <HStack space={2} alignItems={'center'}>
                            <Icon as={AntDesign} name='user' size={'xl'} />
                            <Stack>
                                <Text>
                                    who
                                </Text>
                                <Text fontSize={16}>
                                    {data.employeeName}
                                </Text>
                            </Stack>
                        </HStack>
                        <HStack space={2} alignItems={'center'}>
                            <Icon as={Ionicons} name='calendar-outline' size={'xl'} />

                            <Stack>
                                <Text>
                                    Date
                                </Text>
                                <Text fontSize={16}>
                                    {moment(data.shiftDate).format('ddd MMM DD, yyyy')}
                                </Text>
                            </Stack>
                        </HStack>
                        <HStack space={2} alignItems={'center'}>
                            <Icon as={AntDesign} name='user' size={'xl'} />
                            <Stack>
                                <Text>
                                    Time
                                </Text>
                                <Text fontSize={16}>
                                    {moment(data.startTime).format('h:ma')}-{moment(data.endTime).format('h:ma')}
                                </Text>
                            </Stack>
                        </HStack>
                        <HStack space={2} alignItems={'center'}>
                            <Icon as={Ionicons} name='calendar-outline' size={'xl'} />
                            <Stack>
                                <Text>Schdeule</Text>
                                <Text >{data.scheduleName}</Text>
                            </Stack>
                        </HStack>
                    </Stack>
                    <HStack position={'absolute'} bottom={10} justifyContent={'space-around'}>
                        <Button
                            width={'48%'}
                            variant={'subtle'}
                            colorScheme={'success'}
                            onPress={() => handleAprrove()}
                            isLoading={loading.approve}
                            isDisabled={loading.reject}

                        >
                            Approve
                        </Button>
                        <Button width={'48%'}
                            variant={'subtle'}
                            colorScheme={'error'}
                            isLoading={loading.reject}
                            isDisabled={loading.approve}
                            onPress={() => handleReject()}

                        >
                            Reject
                        </Button>
                    </HStack>
                </>
            }
        </Box >
    )
}

const mapDispatchToProps = dispatch => {
    return {
        handleRequest: data => dispatch(updateUserRequestTimeOff(data)),
        requestDecision: data => dispatch(requestDecision(data))
    }
}

export default connect(null, mapDispatchToProps)(RequestDetailsScreen)
