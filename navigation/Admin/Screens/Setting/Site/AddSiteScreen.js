import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, PermissionsAndroid, Platform } from 'react-native';
// Native Base
import { Box, Button, Center, HStack, Icon, IconButton, ScrollView, Stack, useToast, Text, Modal, Heading, Input } from 'native-base'

// Context
import AuthGlobal from '../../../../../context/store/AuthGlobal'

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons'

// Redux
import { connect } from 'react-redux'
import { createSite, updateSite } from '../../../../../redux/actions/adminActions'

// Google maps
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

// Public ip
import publicIP from 'react-native-public-ip';

// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import withDataLoader from '../../../../../components/withDataLoader'
import API from '../../../../../utils/API';

const AddSiteScreen = (props) => {

    const {
        route,
        createSite,
        updateSite
    } = props

    const { updateData } = route.params

    const context = useContext(AuthGlobal)


    const [loading, setLoading] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [currentPosition, setCurrentPosition] = useState({
        latitude: updateData ? updateData.longitude : 0,
        longitude: updateData ? updateData.longitude : 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    })
    const [fields, setFields] = useState(updateData ? updateData : {})


    useEffect(() => {
        requestLocationPermission();
        // getLocation()
    }, []);


    // const getLocation = async () => {
    //     try {
    //         console.log('location');
    //         const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent('ausz tech 444 g4 lahore')}&AIzaSyBQjmf6oH07MsdiL_BMsp5PeyvuX8vu5G8`);
    //         const data = await response.json();
    //         console.log(data, 'res');
    //     } catch (error) {
    //         console.log(error,'erroe of google api');
    //     }
    // };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            getOneTimeLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This app needs to access your location',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getOneTimeLocation();
                } else {
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const getOneTimeLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition({
                    ...currentPosition,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.log(error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 1000,
            },
        );
    };

    const handleMapPress = (e) => {
        setCurrentPosition({
            ...currentPosition,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
        });

    };

    const inputs = [
        {
            label: 'Profile Picture',
            type: 'image',
            key: 'image'
        },
        {
            label: 'Site Name',
            key: 'name',
            required: true
        },
        {
            label: 'Site Code',
            key: 'code',
            required: true
        },
        {
            label: 'Email',
            key: 'email',
            required: true,
            regex: /\S+@\S+\.\S+/
        },
        {
            label: 'Address',
            key: 'address'
        },
        {
            label: 'Phone',
            keyboard: 'phone-pad',
            key: 'phone'
        },
        {
            label: 'City',
            key: 'city'
        },
        {
            label: 'Country',
            key: 'country'
        },
        {
            label: 'Zip/Postal Code',
            keyboard: 'number-pad',
            key: 'postalCode'
        },
    ]

    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null



    const mapModal = () => {
        return (
            <Stack >
                <HStack my={3} justifyContent={'space-between'} alignItems={'center'}>
                    <Text>Site Location</Text>
                    <IconButton
                        variant={'subtle'}
                        size={'sm'}
                        icon={<Icon as={Ionicons} name={'location'} />}
                        onPress={() => setShowMap(prv => !prv)}
                    />
                </HStack>
                {
                    showMap &&
                    <Stack space={2}>
                        <Input
                            placeholder='latitude'
                            value={currentPosition.latitude.toString()}
                        />
                        <Input
                            placeholder='longituted'
                            value={currentPosition.longitude.toString()}

                        />
                        <MapView
                            style={{ height: 400 }}
                            region={currentPosition}
                            onPress={handleMapPress}
                            showsUserLocation={true}
                            followUserLocation={true}
                        >
                            <Marker coordinate={currentPosition} />
                        </MapView>
                    </Stack>
                }
                {
                    !updateData ?
                        (
                            <CreateData
                                inputs={[
                                    {
                                        label: 'Site Dedicated Ip Address',
                                        key: 'ipAddress',
                                    },
                                    {
                                        checkBoxLabel: 'Restrict user checkin for given dedicated IP address',
                                        key: 'useIp',
                                        type: 'checkbox'
                                    },
                                    {
                                        checkBoxLabel: 'Restrict user checkin for given longitude/latitude(500 M | radius)',
                                        key: 'useLocation',
                                        type: 'checkbox'
                                    }
                                ]}
                                saveFunction={(value) => createSite({
                                    ...value,
                                    logo: fields.logo,
                                    userId: fields.userId,
                                    name: fields.name,
                                    code: fields.code,
                                    note: fields.note,
                                    email: fields.email,
                                    address: fields.address,
                                    city: fields.city,
                                    postalCode: fields.postalCode,
                                    phone: fields.phone,
                                    country: fields.country,
                                    latitude: currentPosition.latitude,
                                    longitude: currentPosition.longitude,
                                })}
                            />
                        ) : (
                            <UpdateComponent
                                inputs={[
                                    {
                                        label: 'Site Dedicated Ip Address',
                                        key: 'ipAddress',
                                    },
                                    {
                                        checkBoxLabel: 'Restrict user checkin for given dedicated IP address',
                                        key: 'useIp',
                                        type: 'checkbox'
                                    },
                                    {
                                        checkBoxLabel: 'Restrict user checkin for given longitude/latitude(500 M | radius)',
                                        key: 'useLocation',
                                        type: 'checkbox'
                                    }
                                ]}
                                saveFunction={(value) => updateSite({
                                    ...value,
                                    logo: fields.logo,
                                    userId: fields.userId,
                                    name: fields.name,
                                    code: fields.code,
                                    note: fields.note,
                                    email: fields.email,
                                    address: fields.address,
                                    city: fields.city,
                                    postalCode: fields.postalCode,
                                    phone: fields.phone,
                                    country: fields.country,
                                    latitude: currentPosition.latitude,
                                    longitude: currentPosition.longitude,
                                })}
                            />
                        )
                }
            </Stack >
        )
    }


    return (
        <Box variant={'conatiner'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <BackHeader>{updateData ? 'update' : 'Add'} Site</BackHeader>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} mt={2} pb={10} >
                        {
                            !updateData ? (
                                <>
                                    <CreateData
                                        saveFunction={context.stateUser.user.IsPaid == 'True' ? (val) => { setFields(val) } : createSite}
                                        inputs={inputs}
                                        showSaveButton={context.stateUser.user.IsPaid == 'True' ? false : true}
                                        getValues={setFields}
                                    />

                                    {context.stateUser.user.SubscriptionType == 'Paid' && mapModal()}
                                </>
                            ) : (
                                <>
                                    <UpdateComponent
                                        saveFunction={context.stateUser.user.IsPaid == 'True' ? (val) => { setFields(val) } : updateSite}
                                        inputs={inputs}
                                        showSaveButton={context.stateUser.user.IsPaid == 'True' ? false : true}
                                        getValues={setFields}
                                    />
                                    {context.stateUser.user.SubscriptionType == 'Paid' && mapModal()}
                                </>
                            )
                        }
                    </Stack>
                </ScrollView>
            </LoadingIndicator>
        </Box>
    )
}
const mapStateToProps = state => {
    return {
        sites: state.admin.sites
    }
}
const mapDispatchToProps = dispatch => {
    return {
        createSite: (data) => dispatch(createSite(data)),
        updateSite: (data) => dispatch(updateSite(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSiteScreen)