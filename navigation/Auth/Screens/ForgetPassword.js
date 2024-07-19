import React, { useState } from 'react'

import { Box, Input, Stack, Text, Button, useToast } from 'native-base'

import BackHeader from '../../../components/BackHeader'
import API from '../../../utils/API'

const ForgetPassword = () => {

    const toast = useToast()

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleEmail = async () => {
        setLoading(true)
        try {
            const res = await API({
                method: 'GET',
                url: `api/UserEmployee/UserForgetPassword?UserEmail=${email}`,
                requireAuth: true
            })
        } catch (e) {
            toast.show({
                description: e.message
            })

        } finally {
            setLoading(false)
            setEmail('')
        }
    }

    return (
        <Box variant={'container'} safeAreaTop>

            <BackHeader>
                Forget Password
            </BackHeader>

            <Stack flex={1} justifyContent={'center'} mx={4} space={6} >
                <Text textAlign={'center'} fontSize={18} color={'primary.600'} mt={-20}>
                    Please Enter The Email Address Associated With The User Account. A Password Reset String Will Be Sent To You.
                </Text>
                <Input placeholder='Enter your email' value={email} onChangeText={(values) => setEmail(values)} />
                <Button
                    variant={'subtle'}
                    isLoading={loading}
                    onPress={handleEmail}
                >Send Email</Button>

            </Stack>

        </Box>
    )
}

export default ForgetPassword
