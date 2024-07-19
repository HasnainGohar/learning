import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BackHandler, Dimensions } from 'react-native'

// Navigation
import { useFocusEffect, useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Button, Center, Heading, HStack, Input, Modal, Stack, Text, useToast } from 'native-base'

// Camera and Location
import { launchCamera } from 'react-native-image-picker'
import Geolocation from '@react-native-community/geolocation'

// Time
import moment from 'moment'

import Tts from 'react-native-tts'

// Redux
import { connect } from 'react-redux'
import { checkTakeImage, earlyCheckOutReason, markAttendance } from '../../../redux/actions/adminActions'

// Components
import NumPad from '../../../components/NumPad'
import AuthGlobal from '../../../context/store/AuthGlobal'

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

const AttendanceScreen = (props) => {

    const {
        markAttendance,
        earlyCheckOutReason,
        checkTakeImage
    } = props

    const toast = useToast()
    const context = useContext(AuthGlobal)
    const navigation = useNavigation()


    const [loading, setLoading] = useState({
        checkIn: false,
        checkOut: false
    })
    const [employeeCode, setEmployeeCode] = useState('')
    const [response, setResponse] = useState(null)
    const [isLocked, setLocked] = useState(true)
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [earlyCheckout, setEarlyCheckout] = useState(false)
    const [reason, setReason] = useState('')
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

    const handleNavigation = () => {
        if (password === context.stateUser.user.UserPassword) {
            setLocked(false)
            setPassword('')
            setOpen(false)
            navigation.goBack()
            setLocked(true)
        } else {
            toast.show({
                description: "Wrong Password"
            })
        }
    }

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

    // console.log(context.stateUser.user.IsTakeImage == 'True' ,'token1')

    const handleCheckIn = async () => {
        let image;
        setLoading(prev => ({
            ...prev,
            checkIn: true,
        }))
        try {
            if (context.stateUser.user.IsTakeImage == 'True') {
                const res = await checkTakeImage({
                    code:employeeCode
                })
                console.log(res, 'from employee inside if')
                if (res) {
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
                            }
                        }
                    })
                }
            }

            const data = await getCurrentPosition();
            const res = await markAttendance({
                image,
                employeeCode,
                mode: 'Check-In',
                latitude: data.coords.latitude,
                longitude: data.coords.longitude,
            });
            setResponse(res);
            // Tts.speak(res);

        } catch (e) {
            console.log(e, 'checkin error')
            setResponse('Error')
        } finally {
            setLoading(prev => ({
                ...prev,
                checkIn: false,
            }))
            setEmployeeCode('')
            setTimeout(() => {
                setResponse(null)
            }, 5000)
        }
    }

    const handleCheckOut = async () => {
        let image;
        setLoading(prev => ({
            ...prev,
            checkOut: true,
        }))
        try {
            if (context.stateUser.user.IsTakeImage == 'True') {
                const res = await checkTakeImage({
                    code:employeeCode
                })
                if (res) {
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
                            }
                        }
                    })
                }
            }
            const data = await getCurrentPosition();
            const res = await markAttendance({
                image,
                employeeCode,
                mode: 'Check-Out',
                latitude: data.coords.latitude,
                longitude: data.coords.longitude,
            })
            if (res === 'false') {
                setEarlyCheckout(true)
            } else {
                setResponse(res)
                // Tts.speak(res)
                setEmployeeCode('')
                setTimeout(() => {
                    setResponse(null)
                }, 5000)
            }

        } catch (e) {
            console.log(e)
            setResponse('Error')
        } finally {
            setLoading(prev => ({
                ...prev,
                checkOut: false,
            }))


        }
    }

    const handleEarlyCheckout = async () => {
        setEarlyCheckoutLoading(true)
        try {
            const res = await earlyCheckOutReason({
                code: employeeCode,
                reason,
            })
            setResponse(res)
            Tts.speak(res)
            setEmployeeCode('')
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


    return (
        <Box variant={'container'} safeAreaTop >
            <Stack space={'12'} mt={4} >
                <DisplayTime />
                <Input
                    variant={'rounded'}
                    borderColor={'primary.600'}
                    colorScheme={'secondary'}
                    placeholder={'Employee Code'}
                    keyboardType={'number-pad'}
                    textAlign={'center'}
                    fontSize={'xl'}
                    value={employeeCode}
                    onChangeText={(text) => setEmployeeCode(text)}
                    mx={4}
                />
                <Center>
                    <Text fontSize={16} >{response}</Text>
                </Center>
                <NumPad setText={setEmployeeCode} />
                <HStack space={2} justifyContent={'center'} mx={4} >
                    <Button
                        w={'48%'}
                        variant={'subtle'}
                        colorScheme={'success'}
                        isDisabled={loading.checkOut}
                        isLoading={loading.checkIn}
                        onPress={handleCheckIn}
                    >Check-In</Button>
                    <Button
                        w={'48%'}
                        variant={'subtle'}
                        colorScheme={'error'}
                        isDisabled={loading.checkIn}
                        isLoading={loading.checkOut}
                        onPress={handleCheckOut}
                    >Check-Out</Button>
                </HStack>
                <Button mx={4} variant={'subtle'} colorScheme={'error'} onPress={() => setOpen(true)} >Exit</Button>
            </Stack>

            <Modal isOpen={open} onClose={() => setOpen(false)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading size={'sm'} >Password Required</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Stack space={2} >
                            <Text>You need to enter admin account password to unlock.</Text>
                            <Input
                                placeholder='Enter Password'
                                type={'password'}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                        </Stack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button size={'md'} onPress={handleNavigation} >Unlock</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

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


const mapDispatchToProps = dispatch => {
    return {
        markAttendance: (data) => dispatch(markAttendance(data)),
        earlyCheckOutReason: (data) => dispatch(earlyCheckOutReason(data)),
        checkTakeImage: (data) => dispatch(checkTakeImage(data))
    }
}

export default connect(null, mapDispatchToProps)(AttendanceScreen)