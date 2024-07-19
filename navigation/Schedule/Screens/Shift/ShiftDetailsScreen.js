import React, { useContext, useState } from 'react'
import { Box, Button, HStack, Icon, Stack, Text } from 'native-base'

// Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Moment
import moment from 'moment'

// Component 
import BackHeader from '../../../../components/BackHeader'
import AuthGlobal from '../../../../context/store/AuthGlobal'

// redux
import { connect } from 'react-redux'
import { ShiftDecision, takeShift, dropShift } from '../../../../redux/actions/employeeActions'

const ShiftDetailsScreen = (props) => {

    const { route, takeShift, dropShift } = props
    const { item, list } = route.params

    const context = useContext(AuthGlobal)

    console.log(context.stateUser.user.RoleCode)


    const [loading, setLoading] = useState(false)


    const handleShift = () => {
        setLoading(true)
        try {
            const res = item.shiftStatus == 'Open Shift' ? takeShift(item.shiftId) : dropShift(item.shiftId)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Box variant={'container'} safeAreaTop>
            <BackHeader>
                Shift Details
            </BackHeader>
            <Stack mx={4} space={6}>
                <HStack space={2} alignItems={'center'}>
                    <Icon as={MaterialCommunityIcons} name='clock-time-four-outline' size={'xl'} />
                    <Stack>
                        <Text>Time</Text>
                        <Text >{moment(item?.startTime).format('H:mma')}-{moment(item?.endTime).format('H:mma')}</Text>
                    </Stack>
                </HStack>
                <HStack space={2} alignItems={'center'}>
                    <Icon as={Ionicons} name='calendar-outline' size={'xl'} />
                    <Stack>
                        <Text>Schdeule</Text>
                        <Text >{item?.scheduleName}</Text>
                    </Stack>
                </HStack>

                <HStack space={2} alignItems={'center'}>
                    <Icon as={MaterialCommunityIcons} name='tag-multiple-outline' size={'xl'} />
                    <Stack>
                        <Text>Position</Text>
                        <Text >{item?.positionName ? item.positionName : 'No Position'}</Text>
                    </Stack>
                </HStack>

                <HStack space={2} alignItems={'center'}>
                    <Icon as={Ionicons} name='location-outline' size={'xl'} />
                    <Stack>
                        <Text>Job Site</Text>
                        <Text >{item?.siteName ? item.siteName : 'No Site'}</Text>
                    </Stack>
                </HStack>
                <HStack space={2} alignItems={'center'}>
                    <Icon as={AntDesign} name='user' size={'xl'} />
                    <Stack>
                        <Text>Assign To</Text>
                        <Text >{item?.employeeName ? item.employeeName : 'Open Shift'}</Text>
                    </Stack>
                </HStack>
                <HStack space={2} alignItems={'center'}>
                    <Icon as={AntDesign} name='user' size={'xl'} />
                    <Stack>
                        <Text>How Many Shifts</Text>
                        <Text >{item?.numberOfShifts ? item.numberOfShifts : '1'}</Text>
                    </Stack>
                </HStack>
                {
                    context.stateUser.user.RoleCode == 'AD' ?
                        <Button
                            my={4}
                            variant={'subtle'}
                            colorScheme={'error'}
                        >
                            Unpublish
                        </Button>
                        :
                        <>
                            {
                                item.shiftStatus == 'Open Shift' &&

                                <Button
                                    my={4}
                                    variant={'subtle'}
                                    onPress={() => handleShift()}
                                    isLoading={loading}
                                >
                                    Take Shift
                                </Button>
                            }
                            {
                                item.shiftStatus == 'Reserved' &&
                                <Button
                                    my={4}
                                    variant={'subtle'}
                                    onPress={() => handleShift()}
                                    isLoading={loading}
                                >
                                    Drop Shift
                                </Button>
                            }
                        </>
                }
            </Stack>
        </Box>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        takeShift: (data) => dispatch(takeShift(data)),
        dropShift: (data) => dispatch(dropShift(data))
    }
}

export default connect(null, mapDispatchToProps)(ShiftDetailsScreen)
