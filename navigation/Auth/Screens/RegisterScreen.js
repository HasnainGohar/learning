import React, { useContext, useEffect, useState } from 'react'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, ScrollView, Stack, useToast } from 'native-base'

// React Native Firebase
import analytics from '@react-native-firebase/analytics'

// Context
import API from '../../../utils/API'
import baseURL from '../../../assets/common/baseURL'
import AuthGlobal from '../../../context/store/AuthGlobal'

// KeyChain
import { setInternetCredentials } from 'react-native-keychain'

// Components
import BackHeader from '../../../components/BackHeader'
import CreateData from '../../../components/CreateData'
import withDataLoader from '../../../components/withDataLoader'

// Redux
import { connect } from 'react-redux'
import { getAllIndustries, setLoginCerdentionals } from '../../../redux/actions/adminActions'
import { loginUser } from '../../../context/actions/Auth.actions'


const RegisterScreen = (props) => {

    const { setLogin, route, industry, getIndustry } = props

    const { data } = route.params
    const toast = useToast()

    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const [loading, setLoading] = useState(false)
    const [loginLoading, setLoginLoading] = useState(false)


    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            await getIndustry()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const date = new Date()

    const updateData = {
        id: null,
        startTime: '2024-02-20T04:00:00.000Z',
        endTime: '2024-02-20T12:30:00.000Z',
        leaves: 20

    }

    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null

    // const handleLogin = async () => {
    //     setLoginLoading(true)
    //     try {
    //         await analytics().logEvent('user_proceeded_from_employees_screen')
    //         await resetInternetCredentials(baseURL)
    //         await loginUser(userDetails.userEmail, userDetails.password, context.dispatch)
    //     } catch (e) {
    //         console.log(e)
    //         toast.show({
    //             title: 'Error',
    //             description: 'An Error Occured, Try Again Later!'
    //         })
    //     } finally {
    //         setLoginLoading(true)
    //     }
    // }

    const handleRegister = async (fields) => {
        setLoading(true)
        try {
            await analytics().logSignUp({ method: 'email' })
            const res = await API({
                method: 'POST',
                url: 'api/Company/CreateCompany',
                requestConfig: {
                    companyName: data.name,
                    userEmail: data.email,
                    password: data.password,
                    industryId: data.id,
                    Phone:data.phone,
                    companyAddress1: "",
                    start: new Date(fields.startTime).toString(),
                    end: new Date(fields.endTime).toString(),
                    companyAnnualLeaves: fields.leaves,
                    companyPostCode: fields.zipCode,
                    subscriptionType: 0,
                    companyMobile: data.phone,
                    locationOnAttendance:true
                }
            })

            if (res.data.responseMsg == 'Company Created Successfully') {
                const res = await API({
                    method: 'POST',
                    url: `api/Auth/Login?username=${data.email}&password=${data.password}&latitude=${null}&longitude=${null}`,
                })
                await setInternetCredentials(baseURL, data.email, res.data.responseData)
                await loginUser(data.email, data.password, null,null, context.dispatch)
                // await setLogin({
                //     userEmail: data.email,
                //     password: data.password,
                // })
                // navigation.navigate('Account setup');

            }
            if (res.data.responseMsg == 'Comapny cannot be Created because CompanyName Already exists') {
                toast.show({
                    title: 'Error',
                    description: 'Company name already exists'
                })
            }
            if (res.data.responseMsg == 'Comapny cannot be Created because Company Email Already exists') {
                toast.show({
                    title: 'Error',
                    description: 'Company email already exists'
                })
            } else {
                toast.show({
                    description: res.data.responseMsg
                })
            }
        } catch (e) {
            console.log(e)
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }




    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader >Registration</BackHeader>
            <ScrollView showsVerticalScrollIndicator={false} >
                <Stack space={3} mx={4}>
                    <UpdateComponent
                        inputs={[
                            // {
                            //     label: 'Company Name',
                            //     key: 'name',
                            //     required: true,

                            // },
                            // {
                            //     label: 'Email',
                            //     key: 'email',
                            //     required: true,
                            //     regex: /\S+@\S+\.\S+/

                            // },
                            // {
                            //     label: 'Password',
                            //     key: 'password',
                            //     required: true,

                            // },
                            // {
                            //     label: 'Phone',
                            //     keyboard: 'phone-pad',
                            //     key: 'phone'
                            // },
                            // {
                            //     label: 'Address',
                            //     key: 'address'
                            // },
                            // {
                            //     label: 'Indutry',
                            //     type: 'select',
                            //     values: industry,
                            //     selectLabel: 'name',
                            //     key: 'id',
                            //     required: true,

                            // },
                            {
                                label: 'Start Time',
                                type: 'datetime',
                                key: 'startTime',
                                mode: 'time',
                                signup: true,
                                defaultValue: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0)).toISOString()
                            },
                            {
                                label: 'End Time',
                                type: 'datetime',
                                key: 'endTime',
                                mode: 'time',
                                signup: true,
                                defaultValue: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 5, 30, 0)).toISOString()
                            },
                            {
                                label: 'Annual Leaves',
                                key: 'leaves',
                                keyboard: 'phone-pad',
                                signup: true,
                                num: 20
                            },
                        ]}

                        datePickers={[
                            { startTime: false },
                            { endTime: false }
                        ]}
                        isNavigate={false}
                        uiLoading={loading}
                        saveFunction={(fields) => handleRegister(fields)}

                    />
                </Stack>
            </ScrollView>
        </Box >
    )
}

const mapStateToProps = state => {
    return {
        industry: state.admin.industry
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getIndustry: () => dispatch(getAllIndustries()),
        setLogin: (data) => dispatch(setLoginCerdentionals(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)