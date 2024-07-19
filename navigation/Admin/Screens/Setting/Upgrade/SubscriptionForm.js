import React, { useContext, useEffect, useState } from 'react';
import { Alert, Keyboard, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Box, Center, FormControl, HStack, Heading, Input, Modal, Spinner, Stack, Text, useToast } from 'native-base';
import { PlatformPay, PlatformPayButton, confirmPlatformPayPayment, initPaymentSheet, isPlatformPaySupported } from '@stripe/stripe-react-native';
import { connect } from 'react-redux';
import { createPaymentIntent, getPaymentDetail, subscribeUser } from '../../../../../redux/actions/adminActions';
import AuthGlobal from '../../../../../context/store/AuthGlobal';
import { loginUser } from '../../../../../context/actions/Auth.actions';
import BackHeader from '../../../../../components/BackHeader';

const SubscriptionForm = (props) => {
    const { getPaymentDetail, createPaymentIntent, subscribeUser } = props;
    const context = useContext(AuthGlobal);
    const navigation = useNavigation();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [paymentDetail, setPaymentDetail] = useState(null);

    const initializePaymentSheet = async () => {
        const { error } = await initPaymentSheet({
            returnURL: 'workforceverse://stripe-redirect',
            merchantDisplayName: "WorkForceVerse",
            applePay: {
                merchantCountryCode: 'PK',
                paymentMode: 'automatic',
            },
            googlePay: {
                merchantCountryCode: 'PK',
                testEnv: true, // Set to false for production
            },
        });
        if (!error) {
            console.log('PaymentSheet initialized successfully');
        } else {
            console.error('Error initializing PaymentSheet:', error);
        }
    };

    const loadPaymentDetail = async () => {
        setLoading(true);
        try {
            const res = await getPaymentDetail();
            console.log(res)
            setPaymentDetail(res.result);
        } catch (e) {
            toast.show({
                title: 'Error',
                status: 'error',
                description: e.message,
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initializePaymentSheet();
        loadPaymentDetail();
    }, []);

    useEffect(() => {
        (async function () {
            if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
                Alert.alert('Google Pay is not supported.');
                return;
            }
        })();
    }, [])

    const pay = async () => {
        const res = await createPaymentIntent();
        setLoading(true);
        const clientSecret = res.clientSecret.clientSecret;
        const { error } = await confirmPlatformPayPayment(
            clientSecret,
            {
                googlePay: Platform.OS === 'android' ? {
                    testEnv: true,
                    merchantName: 'My merchant name',
                    merchantCountryCode: 'US',
                    currencyCode: 'USD',
                    billingAddressConfig: {
                        format: PlatformPay.BillingAddressFormat.Full,
                        isPhoneNumberRequired: true,
                        isRequired: true,
                    },
                } : undefined,
                applePay: Platform.OS === 'ios' ? {
                    cartItems: [
                        {
                            label: 'WorkForceVerse subscription',
                            amount: paymentDetail.totalAmount.toString(),
                            paymentType: PlatformPay.PaymentType.Immediate,
                        },
                    ],
                    merchantCountryCode: 'US',
                    currencyCode: 'USD',
                    requiredShippingAddressFields: [
                        PlatformPay.ContactField.PostalAddress,
                    ],
                    requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
                } : undefined,
            }
        );

        if (!error) {
            await subscribeUser({
                clientSecret: clientSecret,
            });
            toast.show({
                title: 'Success',
                status: 'success',
                description: 'Payment Successful',
                duration: 3000,
                isClosable: true,
            });
            await loginUser(context.stateUser.user.UserLogin, context.stateUser.user.UserPassword, null, null, context.dispatch);
            navigation.navigate('Setting Screen');
        } else {
            console.error('Payment Error:', error.message);
            toast.show({
                title: 'Error',
                status: 'error',
                description: error.message,
                duration: 3000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    return (
        <Box variant={'container'} safeAreaTop>
            <BackHeader>Subscription</BackHeader>
            <Stack px={4} my={4} flex={1} justifyContent={'space-between'}>
                <Stack space={4}>
                    {paymentDetail && (
                        <Box variant={'card'}>
                            <Stack space={2}>
                                <Heading size={'md'} color={'black'}>Invoice</Heading>
                                <Stack space={4}>
                                    <HStack alignItems={'flex-end'} justifyContent={'space-between'}>
                                        <Stack space={1}>
                                            <Text>£ 1 x {paymentDetail.totalEmployees} Employees</Text>
                                        </Stack>
                                        <Heading size={'sm'}>£{parseInt(paymentDetail.totalEmployees)}</Heading>
                                    </HStack>
                                    <Stack space={2}>
                                        <HStack alignItems={'flex-end'} justifyContent={'space-between'}>
                                            <Text>Subtotal</Text>
                                            <Text color={'black'} fontSize={14}>£{parseInt(paymentDetail.totalAmount)}</Text>
                                        </HStack>
                                        <HStack alignItems={'flex-end'} justifyContent={'space-between'}>
                                            <Text>Discount</Text>
                                            <Text color={'black'} fontSize={14}>0 %</Text>
                                        </HStack>
                                        <HStack alignItems={'flex-end'} justifyContent={'space-between'}>
                                            <Text>Total</Text>
                                            <Heading size={'sm'}>£{parseInt(paymentDetail.totalAmount)} / month</Heading>
                                        </HStack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                    )}
                </Stack>

                <Modal isOpen={loading} _overlay={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner />
                </Modal>

                {paymentDetail && (
                    <PlatformPayButton
                        onPress={pay}
                        type={PlatformPay.ButtonType.Pay}
                        appearance={Platform.OS === 'ios' ? PlatformPay.ButtonStyle.Black : PlatformPay.ButtonStyle.Black}
                        borderRadius={4}
                        style={{ width: '100%', height: 50 }}
                    />
                )}
            </Stack>
        </Box>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPaymentDetail: () => dispatch(getPaymentDetail()),
        createPaymentIntent: () => dispatch(createPaymentIntent()),
        subscribeUser: (data) => dispatch(subscribeUser(data)),
    };
};

export default connect(null, mapDispatchToProps)(SubscriptionForm);
