import React, { useContext, useEffect, useState } from 'react'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Button, Stack, useToast } from 'native-base'


// Components
import BackHeader from '../../../components/BackHeader'
import CreateData from '../../../components/CreateData'

// Redux
import { connect } from 'react-redux'
import { getAllIndustries, setLoginCerdentionals } from '../../../redux/actions/adminActions'

// Firebase
import { getAnalytics } from '@react-native-firebase/analytics'


const SignupScreen = (props) => {

    const { industry, getIndustry, setLogin, route } = props

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)


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

    const handleNext = (val) => {
        getAnalytics().logEvent('First_Registerion_Screen')
        navigation.navigate('Register Screen', { data: val })
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader >Registration</BackHeader>
            <Stack space={3} mx={4} >
                <CreateData
                    inputs={[
                        {
                            label: 'Company Name',
                            key: 'name',
                            required: true,

                        },
                        {
                            label: 'Email',
                            key: 'email',
                            required: true,
                            regex: /\S+@\S+\.\S+/

                        },
                        {
                            label: 'Password',
                            key: 'password',
                            required: true,
                            password: true

                        },
                        {
                            label: 'Indutry',
                            type: 'select',
                            values: industry,
                            selectLabel: 'name',
                            key: 'id',
                            required: true,

                        },
                        {
                            label: 'Phone',
                            keyboard: 'phone-pad',
                            key: 'phone'
                        },
                        // {
                        //     label: 'Address',
                        //     key: 'address'
                        // },

                    ]}
                    saveButtonText='Next'
                    saveFunction={(val) => handleNext(val)}
                    isNavigate={false}
                />
            </Stack>
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
        getIndustry: () => dispatch(getAllIndustries())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)