import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BackHandler, Dimensions } from 'react-native'

// Navigation
import { useFocusEffect, useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Button, Center, Heading, HStack, Input, Modal, Stack, Text, useToast, Icon, Badge } from 'native-base'

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons'

// Camera and Location
import { launchCamera } from 'react-native-image-picker'
import Geolocation from '@react-native-community/geolocation'

// Time
import moment from 'moment'
import Tts from 'react-native-tts'

// Redux
import { connect } from 'react-redux'
import { checkTakeImage, earlyCheckOutReason, markAttendance, } from '../../../../redux/actions/adminActions'
import { markBreak, getDashboardData } from '../../../../redux/actions/employeeActions'

// Components
import AuthGlobal from '../../../../context/store/AuthGlobal'

const width = Dimensions.get('window').width

const DisplayTime = () => {
    const [clock, setClock] = useState({
        time: moment(new Date()).format('hh:mm:ss'),
        date: moment(new Date()).format('ddd MMM DD YYYY')
    })

    useEffect(() => {
        setInterval(() => {
            setClock({
                time: moment(new Date()).format('hh:mm:ss'),
                date: moment(new Date()).format('ddd MMM DD YYYY')
            })
        }, 1000)
    }, [])

    return (
        <Center>
            <Heading fontSize={48} >{clock.time}</Heading>
            <Text fontSize={20} >{clock.date}</Text>
        </Center>
    )
}

const ShiftCard = (props) => {

    const {
        markAttendance,
        earlyCheckOutReason,
        checkTakeImage,
        dashboard,
        markBreak,
        getDashboardData
    } = props


    const toast = useToast()
    const context = useContext(AuthGlobal)
    const navigation = useNavigation()



    const [loading, setLoading] = useState({
        checkIn: false,
        checkOut: false
    })
    const [response, setResponse] = useState(null)
    const [isLocked, setLocked] = useState(true)
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [earlyCheckout, setEarlyCheckout] = useState(false)
    const [reason, setReason] = useState('')
    const [breakloading, setBreakLoading] = useState(false)
    const [earlyCheckoutLoading, setEarlyCheckoutLoading] = useState(false)

    // const setTakeImage = context.stateUser.user.IsTakeImage
    // // console.log(setTakeImage)
    // const isTakeImage = setTakeImage == 'False' ? false : true

    // console.log(isTakeImage, 'isTakeimage from company')

    const isReasonEmpty = reason.trim() === ''

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (isLocked) {
                    setOpen(true)
                    return true;
                } else {
                    return false;
                }
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [isLocked])
    );

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (data) => resolve(data),
                (error) => {
                    toast.show({
                        title: 'Location not enabled',
                        description: "Turn on location to mark the Attendance."
                    })
                    reject(error)
                }
            );
        });
    }

    // console.log(context.stateUser.user)

    const handleCheckIn = async () => {
        let image;
        let data = null; // Initialize data as null
    
        setLoading(prev => ({
            ...prev,
            checkIn: true,
        }));
    
        try {
            if (context.stateUser.user.IsTakeImage === 'True') {
                await launchCamera({
                    cameraType: 'front',
                    maxWidth: 720,
                    maxHeight: 1280,
                }, (file) => {
                    if (!file.didCancel) {
                        image = {
                            uri: file.assets[0].uri,
                            type: file.assets[0].type,
                            name: file.assets[0].fileName
                        };
                    }
                });
            }
    
            // Check if location is needed
            if (context.stateUser.user.LocationOnAttendance === 'True') {
                data = await getCurrentPosition(); // Get location data if the setting is true
            }
    
            const res = await markAttendance({
                image,
                employeeCode: context.stateUser.user.EmployeeCode,
                mode: 'Check-In',
                latitude: data ? data.coords.latitude : null,
                longitude: data ? data.coords.longitude : null,
            });
    
            setResponse(res);
            toast.show({
                description: res
            });
    
            await getDashboardData({
                userId: context.stateUser.user.UserId,
                date: new Date().toISOString().split('T')[0]
            });
    
        } catch (e) {
            console.log(e, 'checkin error');
            setResponse('Error');
        } finally {
            setLoading(prev => ({
                ...prev,
                checkIn: false,
            }));
            setTimeout(() => {
                setResponse(null);
            }, 5000);
        }
    }
    

    const handleCheckOut = async () => {
        let image;
        let data = null; // Initialize data as null
    
        setLoading(prev => ({
            ...prev,
            checkOut: true,
        }));
    
        try {
            if (context.stateUser.user.IsTakeImage === 'True') {
                await launchCamera({
                    cameraType: 'front',
                    maxWidth: 720,
                    maxHeight: 1280,
                }, (file) => {
                    if (!file.didCancel) {
                        image = {
                            uri: file.assets[0].uri,
                            type: file.assets[0].type,
                            name: file.assets[0].fileName
                        };
                    }
                });
            }
    
            // Check if location is needed
            if (context.stateUser.user.LocationOnAttendance === 'True') {
                data = await getCurrentPosition(); // Get location data if the setting is true
            }
    
            const res = await markAttendance({
                image,
                employeeCode: context.stateUser.user.EmployeeCode,
                mode: 'Check-Out',
                latitude: data ? data.coords.latitude : null,
                longitude: data ? data.coords.longitude : null,
            });
    
            setResponse(res);
            toast.show({
                description: res
            });
    
            await getDashboardData({
                userId: context.stateUser.user.UserId,
                date: new Date().toISOString().split('T')[0]
            });
    
            setTimeout(() => {
                setResponse(null);
            }, 5000);
    
        } catch (e) {
            console.log(e);
            setResponse('Error');
        } finally {
            setLoading(prev => ({
                ...prev,
                checkOut: false,
            }));
        }
    }
    

    const handleEarlyCheckout = async () => {
        setEarlyCheckoutLoading(true)
        try {
            const res = await earlyCheckOutReason({
                code: context.stateUser.user.EmployeeCode,
                reason,
            })
            setResponse(res)
            // Tts.speak(res)
            toast.show({
                description: response
            })
        } catch (e) {
            console.log(e)
        } finally {
            setEarlyCheckoutLoading(false)
            setEarlyCheckout(false)
            setReason('')
            setTimeout(() => {
                setResponse(null)
            }, 5000)
        }
    }


    const HandleBreak = async (mode) => {
        setBreakLoading(true)
        try {
            const res = await markBreak({
                mode: mode
            })
            toast.show({
                status: res.status,
                description: res.msg,
            })
            await getDashboardData({
                userId: context.stateUser.user.UserId,
                date: new Date().toISOString().split('T')[0]
            })
        } catch (error) {
            console.log(error)
        } finally {
            setBreakLoading(false)
        }
    }

    return (
        <Box variant={'card'} mx={4} >
            <HStack justifyContent={'space-between'}>
                <Stack space={1}>

                    <Text fontSize={'md'} >
                        Working Time
                    </Text>

                    <Heading size={'md'} >
                        {`${moment(dashboard?.startTime).format('hh:mm A')} - ${moment(dashboard?.endTime).format('hh:mm a')}`}
                    </Heading>
                    {/* <HStack space={4}>
                        <Icon as={Ionicons} name='calendar-outline' size={'md'} />
                        <Text>Default</Text>
                    </HStack> */}
                    {
                        dashboard?.checkIn &&
                        <HStack space={2} alignItems={'center'}>
                            <Heading size={'xs'}>
                                {!dashboard?.checkOut ? 'CheckedIn :' : 'CheckedOut :'}
                            </Heading>
                            <Text>
                                {!dashboard?.checkOut ? moment(dashboard?.checkIn).format('hh:mm A') : moment(dashboard?.checkOut).format('hh:mm a')}
                            </Text>
                        </HStack>
                    }
                    {
                        dashboard.startBreak &&
                        <HStack space={2} alignItems={'center'}>
                            <Heading size={'xs'}>{dashboard.totalBreak ? 'Total break Time :' : 'Break started at :'}</Heading>
                            <Text>{dashboard.totalBreak ? moment(dashboard.totalBreak).format('HH:m:ss') : moment(new Date(dashboard.startBreak)).format('hh:mm a')}</Text>
                        </HStack>
                    }
                </Stack>

                <Stack space={4} mt={4}>
                    {
                        !dashboard.checkIn &&
                        <Button
                            variant={'subtle'}
                            colorScheme={'success'}
                            isDisabled={loading.checkOut}
                            isLoading={loading.checkIn}
                            onPress={handleCheckIn}
                        >
                            Check-In
                        </Button>
                    }
                    {
                        (dashboard.checkIn && !dashboard.checkOut) &&
                        <Button
                            variant={'subtle'}
                            colorScheme={'error'}
                            isDisabled={loading.checkIn}
                            isLoading={loading.checkOut}
                            onPress={handleCheckOut}
                        >
                            Check-Out
                        </Button>
                    }
                    {
                        (dashboard.checkIn && !dashboard.checkOut && !dashboard.totalBreak) &&
                        <Button
                            variant={'subtle'}
                            colorScheme={dashboard.startBreak ? 'error' : 'success'}
                            onPress={() => HandleBreak(dashboard.startBreak ? 'breakOut' : 'breakIn')}
                            isLoading={breakloading}
                        >
                            {dashboard.startBreak ? 'End Break' : 'Start Break'}
                        </Button>
                    }
                </Stack>
            </HStack>
            <Modal isOpen={earlyCheckout} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading size={'sm'} >Early Checkout</Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <Stack space={2} >
                            <Text>State the reason for early checkout.</Text>
                            <Input
                                placeholder='Early Checkout Reason'
                                value={reason}
                                onChangeText={(text) => setReason(text)}
                            />
                        </Stack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button isLoading={earlyCheckoutLoading} onPress={handleEarlyCheckout} isDisabled={isReasonEmpty} >Submit</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        dashboard: state.employee.dashboard
    }
}

const mapDispatchToProps = dispatch => {
    return {
        markAttendance: (data) => dispatch(markAttendance(data)),
        earlyCheckOutReason: (data) => dispatch(earlyCheckOutReason(data)),
        checkTakeImage: (data) => dispatch(checkTakeImage(data)),
        markBreak: (data) => dispatch(markBreak(data)),
        getDashboardData: (data) => dispatch(getDashboardData(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShiftCard)