import React, { useState, useEffect, useCallback } from 'react'
import { Linking } from 'react-native';

import { Alert, Box, Button } from 'native-base'

import { CardField, PaymentSheet, PlatformPay, PlatformPayButton, confirmPlatformPayPayment, initPaymentSheet, presentPaymentSheet, useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = () => {


    const initializePaymentSheet = async () => {
        const { error } = await initPaymentSheet({
            returnURL: 'workforceverse://stripe-redirect',
            merchantDisplayName: "WorkForceVerse",
            applePay: {
                merchantCountryCode: 'PK',
                paymentMode: 'automatic',
            }
        });
        if (!error) {
            console.log('PaymentSheet initialized successfully');
        }
        console.log(error)
    };

    useEffect(() => {
        initializePaymentSheet();
    }, []);

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            console.log(error)
        } else {
            console.log('Success', 'Your order is confirmed!');
        }
    };


    const pay = async () => {
        const clientSecret = 'pi_3OPQoOArzfvtwoCX0Yub45Bi_secret_u9kTsx4OT7uhrrPhbJRPc30Td'
        const { error } = await confirmPlatformPayPayment(
            clientSecret,
            {
                applePay: {
                    cartItems: [
                        {
                            label: 'Example item name',
                            amount: '14.00',
                            paymentType: PlatformPay.PaymentType.Immediate,
                        },
                        {
                            label: 'Total',
                            amount: '12.75',
                            paymentType: PlatformPay.PaymentType.Immediate,
                        },
                    ],
                    merchantCountryCode: 'US',
                    currencyCode: 'USD',
                    requiredShippingAddressFields: [
                        PlatformPay.ContactField.PostalAddress,
                    ],
                    requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
                },
            }
        );
        if (error) {
            // handle error
        } else {
            Alert.alert('Success', 'Check the logs for payment intent details.');
            console.log(JSON.stringify(paymentIntent, null, 2));
        }
    };

    return (
        <Box variant={'container'} px={5} safeAreaTop >
            {/* <PaymentSheet /> */}
            {/* <Button onPress={openPaymentSheet}>Pay</Button> */}
            <PlatformPayButton
                onPress={pay}
                type={PlatformPay.ButtonType.Pay}
                appearance={PlatformPay.ButtonStyle.Black}
                borderRadius={4}
                style={{
                    width: '100%',
                    height: 50,
                }}
            />
        </Box>
    )
}

export default PaymentScreen