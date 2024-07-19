import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Center, Divider, FlatList, HStack, Heading, Stack, useSafeArea, useToast } from 'native-base'

// React navigation
import { useNavigation } from '@react-navigation/native'

// Context API
import AuthGlobal from '../../../context/store/AuthGlobal'

// Redux
import { connect } from 'react-redux'
import { getLeaveRequests, getLoanRequests, updateLeaveRequest, updateLoanRequest } from '../../../redux/actions/adminActions'

// Components
import LoadingIndicator from '../../../components/LoadingIndicator'
import Card from '../../../components/Card'
import LeaveCard from '../../../components/Cards/LeaveCard'
import LoanCard from '../../../components/Cards/LoanCard'
import { Pressable } from 'react-native'


const ApprovalScreen = (props) => {

    const { loanRequests, leaveRequests, getLeaveRequests, getLoanRequests, updateLoanRequest, updateLeaveRequest, } = props

    const context = useContext(AuthGlobal)
    const toast = useToast()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadingRequest, setLoadingRequest] = useState({ id: null, status: '' });
    const [refetch, setRefetch] = useState(0)

    navigation.addListener('focus', () => (
        setRefetch(val => val + 1)
    ))


    const LoadData = async () => {
        setLoading(true)
        try {
            await getLeaveRequests()
            await getLoanRequests()
        } catch (error) {
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        LoadData()
    }, [refetch])


    const handlerequest = async (type, data, status) => {
        setLoadingRequest({ id: data.id, status });
        try {
            if (type === 'Loan') {
                await updateLoanRequest({
                    id: data.id,
                    status: status,
                    tenure: data.tenure,
                    amount: data.amount
                });
            } else {
                await updateLeaveRequest({
                    id: data.id,
                    status: status,
                    reason: data.reason || ''
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingRequest({ id: null, status: '' });
        }
    }



    return (
        <Box variant={'container'} safeAreaTop >
            <Center>
                <Heading >Approvals</Heading>
            </Center>
            <LoadingIndicator loading={loading}>
                <Stack my={4} space={4}>
                    {
                        leaveRequests?.length >= 1 &&
                        <Card
                            heading={'Leave Requests'}
                        >
                            <FlatList
                                data={leaveRequests}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item, index }) => (
                                    <Stack py={2} >
                                        {/* <Pressable
                                      _pressed={{
                                        transform: [{ scale: 0.95 }]
                                      }}
                                      onPress={() => setRequest({
                                        type: 'Leave',
                                        data: item
                                      })}
                                    > */}
                                        <LeaveCard data={item} isAdmin={false} />
                                        {/* </Pressable> */}
                                        <HStack my={4} space={2} justifyContent={'flex-end'} >
                                            <Button
                                                w={'32%'}
                                                variant={'subtle'}
                                                colorScheme={'error'}
                                                size={"sm"}
                                                onPress={() => handlerequest('Leave', item, 'Reject')}
                                                isLoading={(loadingRequest.id == item.id && loadingRequest.status === 'Reject')?true:false}
                                                isDisabled={(loadingRequest.id && loadingRequest.status)?true:false}
                                            >Reject</Button>
                                            <Button
                                                w={'32%'}
                                                variant={'subtle'}
                                                colorScheme={'success'}
                                                size={"sm"}
                                                onPress={() => handlerequest('Leave', item, 'Approved')}
                                                isLoading={(loadingRequest.id == item.id && loadingRequest.status === 'Approved')?true:false}
                                                isDisabled={(loadingRequest.id && loadingRequest.status)?true:false}
                                            >Approve</Button>
                                        </HStack>
                                        {index !== leaveRequests.length - 1 && <Divider />}
                                    </Stack>
                                )}
                            />

                        </Card>
                    }
                    {
                        loanRequests?.length >= 1 &&
                        <Card
                            heading={'Loan Requests'}
                        >
                            <FlatList
                                data={loanRequests}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item, index }) => (
                                    <Stack py={2} >
                                        <Pressable
                                            _pressed={{
                                                transform: [{ scale: 0.95 }]
                                            }}
                                        >
                                            <LoanCard data={item} />
                                        </Pressable>
                                        <HStack my={4} space={2} justifyContent={'flex-end'} >
                                            <Button
                                                w={'32%'}
                                                variant={'subtle'}
                                                colorScheme={'error'}
                                                size={"sm"}
                                                onPress={() => handlerequest('Loan', item, 'Reject')}
                                                isLoading={(loadingRequest.id == item.id && loadingRequest.status === 'Reject')?true:false}
                                                isDisabled={(loadingRequest.id && loadingRequest.status)?true:false}
                                            >Reject</Button>
                                            <Button
                                                w={'32%'}
                                                variant={'subtle'}
                                                colorScheme={'success'}
                                                size={"sm"}
                                                onPress={() => handlerequest('Loan', item, 'Approved')}
                                                isLoading={(loadingRequest.id == item.id && loadingRequest.status === 'Approved')?true:false}
                                                isDisabled={(loadingRequest.id && loadingRequest.status)?true:false}
                                            >Approve</Button>
                                        </HStack>
                                        {index !== loanRequests.length - 1 && <Divider />}
                                    </Stack>
                                )}
                            />

                        </Card>
                    }
                </Stack>
            </LoadingIndicator>
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        leaveRequests: state.admin.leaves.request,
        loanRequests: state.admin.loans.request,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getLeaveRequests: (data) => dispatch(getLeaveRequests()),
        getLoanRequests: (data) => dispatch(getLoanRequests()),
        updateLoanRequest: (data) => dispatch(updateLoanRequest(data)),
        updateLeaveRequest: (data) => dispatch(updateLeaveRequest(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalScreen)