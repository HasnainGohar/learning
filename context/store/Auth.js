import { useState, useReducer, useEffect } from 'react'
import { View, Image } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'

// Action and Reducer
import AuthReducer from '../reducers/Auth.reducer'
import AuthGlobal from './AuthGlobal'

import { loginUser } from '../actions/Auth.actions'

import { ACCESS_CONTROL, getGenericPassword } from 'react-native-keychain'
import COLORS from '../../theme/COLORS'



const Auth = props => {
    const [stateUser, dispatch] = useReducer(AuthReducer, {
        isAuthenticated: null,
        user: {},
    })

    const [showChild, setShowChild] = useState(false);
    const [loading, setLoading] = useState(false)

    const checkAuthentication = async () => {
        setShowChild(true);
        setLoading(true)
        // await resetGenericPassword()
        try {
            const deviceLock = await AsyncStorage.getItem('deviceLock')
            if (deviceLock === 'true') {
                const credentials = await getGenericPassword({
                    accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
                    authenticationPrompt: {
                        title: 'Authenticate to Login',
                        description: 'Use Device Authentication to access the app.'
                    }
                })
                if (credentials.username && credentials.password) {
                    await loginUser(credentials.username, credentials.password,null ,null, dispatch)
                }
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuthentication()

        return () => setShowChild(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!showChild) {
        return null;
    }

    return (
        loading ? (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.backgroundColor
            }} >
                <Image
                    source={require('../../assets/images/logo-icon-purple.png')}
                    resizeMode={'contain'}
                    style={{
                        width: 300
                    }}
                />
            </View>
        ) : (
            <AuthGlobal.Provider
                value={{
                    stateUser,
                    dispatch
                }}
            >
                {props.children}
            </AuthGlobal.Provider >
        )
    )
}

export default Auth

