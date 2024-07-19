import React from 'react'
import { Platform } from 'react-native'

// Native Base
import { Box, Button, Center, Heading, Stack, Text } from 'native-base'

// React Navogation
import { useNavigation } from '@react-navigation/native'

// Component
import BackHeader from '../../../../../components/BackHeader'

const UpgradeToPro = () => {

    const navigation = useNavigation()

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader >Upgrade to Premium</BackHeader>
            <Stack px={4} space={4} mt={4} >
                <Box variant={'card'} >
                    <Stack space={2} >
                        <Heading size={'md'} color={'black'} >Basic</Heading>
                        <Heading size={'sm'} color={'secondary.600'} >£0 / Month</Heading>
                        <Box>
                            <Text>➟ 1 site only</Text>
                            <Text>➟ Upto 10 employees</Text>
                            <Text>➟ Basic reporting</Text>
                            <Text>➟ Email support</Text>
                        </Box>
                        <Button
                            colorScheme={'secondary'}
                            variant={'subtle'}
                            size={'sm'}
                            isDisabled
                        >Subscribed</Button>
                    </Stack>
                </Box>
                <Box variant={'card'} >
                    <Stack space={2} >
                        <Heading size={'md'} color={'black'} >Standard</Heading>
                        <Heading size={'sm'} >£1 / Employee / Month</Heading>
                        <Box>
                            <Text>➟ Multi Sites</Text>
                            <Text>➟ Upto 500 employees</Text>
                            <Text>➟ Priority support</Text>
                            <Text>➟ Implementation support included</Text>
                        </Box>
                        {Platform.OS === 'ios' ? (
                            <Button
                                variant={'subtle'}
                                size={'sm'}
                                onPress={() => navigation.navigate('Subscription Form Screen')}
                            >Subscribe</Button>
                        ) : (
                            <Button
                                variant={'subtle'}
                                size={'sm'}
                                // disabled
                            onPress={() => navigation.navigate('Subscription Form Screen')}
                            >Subscribe</Button>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}

export default UpgradeToPro