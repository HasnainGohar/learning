import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useFocusEffect } from '@react-navigation/native'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Badge, Box, Center, Divider, FlatList, Heading, HStack, Stack, Text, useToast, Fab, Icon } from 'native-base'


// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'

// Components
import moment from 'moment'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import LoanCard from '../../../../../components/Cards/LoanCard'
import BackHeader from '../../../../../components/BackHeader'

// Redux 
import { connect } from 'react-redux'
import { getLoanDetails } from '../../../../../redux/actions/adminActions'

// Context 
import AuthGlobal from '../../../../../context/store/AuthGlobal'

const LoanDetail = (props) => {

    const {
        route,
        loans,
        getLoanDetails
    } = props

    const { data } = route.params
    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)


    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [refetch, setRefetch] = useState(0)

    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
    })

    const loadLoans = async () => {
        setLoading(true)
        try {
            await getLoanDetails({
                id: data.id
            })
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

    useEffect(() => {
        loadLoans()

    }, [refetch])

    const calculateProgress = () => {
        const totalAmount = data.amount;
        const paidAmount = data.paid;
        const progress = (paidAmount / totalAmount) * 100;
        return progress;
    };

    const renderLoans = loans.sort((a, b) => new Date(b.date) - new Date(a.date));
    // const paid = loans.map((item, index) => item.paid)
    // const remaining = loans.map((item, index) => item.remaining)
    // console.log(loans)

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Loan Details</BackHeader>
            <LoadingIndicator loading={loading} >
                <Stack space={4} mx={4} >
                    {/* <HStack justifyContent={'space-between'}> 
                        <HStack>
                            <Text>Amount: </Text>
                            <Text>
                                {data.amount}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text>Remaining: </Text>
                            <Text>
                                {remaining}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text>Paid: </Text>
                            <Text>
                                {paid}
                            </Text>
                        </HStack>
                    </HStack>*/}
                    <FlatList
                        data={renderLoans}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <Box variant={'card'} key={index} mt={4} >
                                <Stack>
                                    <HStack justifyContent={'space-between'} alignItems={'center'} >
                                        <Text fontSize={14} bold >Rs.{item.paid}</Text>
                                        <Badge borderRadius={'15'} colorScheme={'success'}>{`${data.tenure} Months`}</Badge>
                                    </HStack>
                                    <Text fontSize={12} >{moment(item.date).format("DD-MM-YYYY")}</Text>
                                </Stack>
                            </Box>
                        )}
                        keyExtractor={(item) => item.id}
                        refreshing={loading}
                        onRefresh={loadLoans}
                    />
                </Stack>
            </LoadingIndicator>
            
            {
                context.stateUser.user.RoleCode == 'AD' &&
                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Repay Loan Screen", { id: data.id })}
                />
            }
        </Box>
    )
}


const mapStateToProps = state => {
    return {
        loans: state.admin.loans.repay
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getLoanDetails: (data) => dispatch(getLoanDetails(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoanDetail)

