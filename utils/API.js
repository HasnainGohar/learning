import axios from "axios";
import baseURL from "../assets/common/baseURL";

import { getInternetCredentials } from "react-native-keychain"

export const apiInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export const formDataInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
    }
})

const API = async (config) => {

    const {
        instance = apiInstance,
        method,
        url,
        requestConfig,
        requireAuth = false,
        isFormData = false,
    } = config


    const abortController = new AbortController()
    const signal = abortController.signal

    instance.interceptors.request.use(async (config) => {
        if (requireAuth) {
            const token = await getInternetCredentials(baseURL)
            if (token.password) {
                config.headers.Authorization = `Bearer ${token.password}`
            }
        }
        if (isFormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config
    })

    try {
        const res = await instance[method.toLowerCase()](url, requestConfig, { signal })
        if (res.status === 200) {
            return { data: res.data, abortController }
        }
    } catch (e) {
        throw new Error(e)
    }
}

export default API