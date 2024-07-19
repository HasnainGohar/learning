import React from 'react'
import { SafeAreaView, TouchableOpacity } from 'react-native'

// React Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Button, Card, Center, Divider, Heading, Stack, Text } from 'native-base'
import SearchDropdown from '../../../components/SearchDropdown'

const SubscriptionScreen = () => {

    const navigation = useNavigation()

    return (
        <Box variant={'container'} justifyContent={'center'} >
            <SafeAreaView>
                <Stack mx={4} space={6}  >
                    <Card backgroundColor={'#009dfb'} position={'relative'}  >
                        <Center>
                            <Stack space={2} alignItems={'center'}  >
                                <Stack alignItems={'center'} >
                                    <Heading color={'white'} my={2} >Free Plan</Heading>
                                    <Text color={'white'} >No cradit card required</Text>
                                </Stack>
                                <Heading color={'white'} >$0 / Month</Heading>

                                <Text color={'white'} >1 site only</Text>
                                <Text color={'white'}>Upto 10 employees</Text>
                                <Text color={'white'}>Basic reporting</Text>
                                <Text color={'white'}>Email support</Text>
                                <Button
                                    zIndex={999}
                                    backgroundColor={'white'}
                                    borderRadius={10}
                                    _text={{ color: '#009dfb', fontWeight: 'bold' }}
                                    onPress={() => navigation.navigate('Register Screen', { subscription: 0 })}
                                >Get Started New</Button>
                            </Stack>
                        </Center>
                    </Card>
                    <Card backgroundColor={'#730cfd'}  >
                        <Center>
                            <Stack space={3} alignItems={'center'}  >
                                <Stack alignItems={'center'} space={2} >
                                    <Heading color={'white'} my={2} >Standard Plan</Heading>
                                    <Heading size={'md'} color={'white'} >$1 / Employee / Month</Heading>
                                </Stack>

                                <Text color={'white'}>Multi Sites</Text>
                                <Text color={'white'}>Upto 500 employees</Text>
                                <Text color={'white'}>Priority support</Text>
                                <Text color={'white'}>Implementation support included</Text>
                                <Button
                                variant={'subtle'}
                                    zIndex={999}
                                    backgroundColor={'white'}
                                    borderRadius={10}
                                    _text={{ color: '#730cfd', fontWeight: 'bold' }}
                                    onPress={() => navigation.navigate('Register Screen', { subscription: 1 })}
                                >Start 14 Days Trail</Button>
                            </Stack>
                        </Center>
                    </Card>
                </Stack>
            </SafeAreaView>
        </Box>
        // <SearchDropdown />
    )
}

export default SubscriptionScreen