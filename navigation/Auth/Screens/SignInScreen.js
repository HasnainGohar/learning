import React, { useState, useContext, useRef, useEffect } from 'react';
import { Linking, Dimensions, PermissionsAndroid, Platform } from 'react-native';

// React Navigation
import { useNavigation } from '@react-navigation/native';

// Native Base
import {
    Box,
    Center,
    Heading,
    Input,
    Stack,
    Button,
    Image,
    FormControl,
    useToast,
    Divider,
    Text
} from 'native-base';

// Firebase Analytics
import analytics from '@react-native-firebase/analytics';

// Context API
import AuthGlobal from '../../../context/store/AuthGlobal';
import { loginUser } from '../../../context/actions/Auth.actions';
import Geolocation from '@react-native-community/geolocation';


const SignInScreen = () => {

    const toast = useToast()
    const navigation = useNavigation();
    const context = useContext(AuthGlobal)
    const width = Dimensions.get('window').width

    const [email, setEmail] = useState('adnan.saeed@ausz-tech.com')
    const [password, setPassword] = useState('Mustafawaqas1!')

    // const [email, setEmail] = useState('skilup@gmail.com')
    // const [password, setPassword] = useState('0123')

    // const [email, setEmail] = useState('complinceX12@gmail.com')
    // const [password, setPassword] = useState('01234567')



    const [fieldError, setFieldError] = useState({})
    const [loading, setLoading] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)

    // const [currentPosition, setCurrentPosition] = useState({
    //     latitude: 0,
    //     longitude: 0,
    //     latitudeDelta: 0.005,
    //     longitudeDelta: 0.005,
    // });

    // useEffect(() => {
    //     requestLocationPermission();
    // }, []);

    // const requestLocationPermission = async () => {
    //     if (Platform.OS === 'ios') {
    //         getOneTimeLocation();
    //     } else {
    //         try {
    //             const granted = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //                 {
    //                     title: 'Location Access Required',
    //                     message: 'This app needs to access your location',
    //                 },
    //             );
    //             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //                 getOneTimeLocation();
    //             } else {
    //             }
    //         } catch (err) {
    //             console.warn(err);
    //         }
    //     }
    // };

    // const getOneTimeLocation = () => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             setCurrentPosition({
    //                 ...currentPosition,
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude,
    //             });
    //         },
    //         (error) => {
    //             console.log(error.message);
    //         },
    //         {
    //             enableHighAccuracy: false,
    //             timeout: 10000,
    //             maximumAge: 1000,
    //         },
    //     );
    // };


    const validateFields = () => {
        if (email == '') {
            setFieldError({
                ...fieldError,
                email: 'Requried'
            })
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setFieldError({
                ...fieldError,
                email: 'Invalid Email'
            })
            return false
        } else if (password == '') {
            setFieldError({
                ...fieldError,
                password: 'Required'
            })
            return false
        }
        return true;
    }

    const onSubmit = async () => {
        if (validateFields()) {
            setLoading(true)
            try {

                const res = await loginUser(email, password, null, null, context.dispatch)
                await analytics().logEvent('login', { email })
            } catch (e) {
                console.log(e)
                // toast.show({
                //     description:e.message
                // })
                toast.show({
                    title: 'Error',
                    description: 'An Error Occured, Try Again Later!'
                })
            } finally {
                setLoading(false)
            }
        }
    }

    const onRegister = async () => {
        setRegisterLoading(true)
        await analytics().logEvent('register_screen')
        setRegisterLoading(false)
        navigation.navigate('Signup Screen')
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <Stack space={10} mx={4} mt={10} >
                <Center>
                    <Heading size={'2xl'}>Sign In</Heading>
                </Center>
                <Center>
                    <Image source={require('../../../assets/images/logo.png')} size={'xl'} alt="alternate text" />
                </Center>
                <Stack space={2} >
                    <FormControl isInvalid={'email' in fieldError}>
                        <Input
                            variant={'underlined'}
                            color={'black'}
                            size={'lg'}
                            placeholder="Email"
                            defaultValue={email}
                            isDisabled={loading}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <FormControl.ErrorMessage>{fieldError.email}</FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={'password' in fieldError}>
                        <Input
                            variant={'underlined'}
                            size={'lg'}
                            type={'password'}
                            placeholder={'Password'}
                            color={'black'}
                            isDisabled={loading}
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                        <FormControl.ErrorMessage>{fieldError.password}</FormControl.ErrorMessage>
                    </FormControl>
                    <Text alignSelf={'flex-end'} onPress={() => navigation.navigate('Forget Password Screen')} >Forget Password?</Text>

                </Stack>
                <Button
                    size={'lg'}
                    isLoading={loading}
                    onPress={onSubmit}

                >
                    Sign In
                </Button>
                <Stack space={4} mt={-5} >
                    {/* <Center>
                        <Divider w={'75%'} />
                    </Center> */}

                    <Stack space={2} >
                        <Button
                            variant={'subtle'}
                            isLoading={registerLoading}
                            onPress={onRegister}
                            _text={{
                                fontWeight: 'bold'
                            }}
                        >
                            Sign up for Free
                        </Button>
                        <Center>
                            <Text fontSize={12} >No Credit Card Required</Text>
                        </Center>
                    </Stack>

                </Stack>
                <Button
                    alignSelf={'center'}
                    mt={width / 7}
                    // bottom={height/50}
                    onPress={() => Linking.openURL('https://workforceverse.com')}
                    variant={'link'}>

                    www.workforceverse.com
                </Button>
            </Stack>
        </Box >
    );
};

export default SignInScreen;
