import jwtDecode from "jwt-decode";
import { Platform } from "react-native";


// Keychain
import {
    ACCESS_CONTROL,
    getSupportedBiometryType,
    SECURITY_LEVEL,
    SECURITY_RULES,
    setGenericPassword,
    setInternetCredentials,
    resetGenericPassword,
    resetInternetCredentials,
    STORAGE_TYPE
} from "react-native-keychain";

// API
import baseURL from "../../assets/common/baseURL";
import API from "../../utils/API";

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// RN FM
import messaging from '@react-native-firebase/messaging';

// device info
import DeviceInfo from "react-native-device-info";

export const SET_CURRENT_USER = "SET_CURRENT_USER";


export const loginUser = async (loginId, password, latitude, longitude, dispatch) => {
    console.log('login function ins called')
    try {
        const res = await API({
            method: 'POST',
            url: `api/Auth/Login?username=${loginId}&password=${password}&latitude=${latitude}&longitude${longitude}`,
        })
        if (!res.data.isSuccess) {
            throw new Error(res.data.message)
        }
        const decoded = jwtDecode(res.data.responseData)
        await getSupportedBiometryType()
            .then(async (biometricType) => {
                if (Platform.OS === 'android' && biometricType !== null) {
                    await setGenericPassword(loginId, password, {
                        accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
                        storage: STORAGE_TYPE.RSA,
                        rules: SECURITY_RULES.AUTOMATIC_UPGRADE,
                        securityLevel: SECURITY_LEVEL.ANY,
                    })
                }
                await setInternetCredentials(baseURL, loginId, res.data.responseData, {
                    storage: STORAGE_TYPE.FB
                })
                dispatch(setCurrentUser(decoded, res.data.responseData))
                checkFirstLaunch()
            })
            .catch((e) => {
                throw new Error(e.message)
            })
    } catch (e) {
        throw new Error(e.message)
    }
}

export const setCurrentUser = (decoded, token) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
        token,
        userID: decoded.UserId,
        companyID: decoded.CompanyId,
        siteID: 0,
    }
}

const checkFirstLaunch = async () => {
    try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            const res = await API({
                method: 'POST',
                url: 'api/DeviceToken/SaveDeviceToken',
                requestConfig: {
                    dToken: token,
                    plateform: Platform.OS,
                    bundleId: DeviceInfo.getBundleId(),
                    projectName: 'WorkForceVerse'
                }
            })
            if (res.result) {
                await AsyncStorage.setItem('hasLaunched', 'true');
            }
        }
    } catch (error) {
        console.error('Failed to check first launch:', error);
    }
};



export const logoutUser = async (dispatch) => {
    await resetGenericPassword()
    await resetInternetCredentials(baseURL)
    dispatch(setCurrentUser({}))
}