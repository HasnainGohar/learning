import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useFocusEffect } from '@react-navigation/native'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Badge, Box, Center, Divider, FlatList, Heading, HStack, Stack, Text, useToast, Fab, Icon } from 'native-base'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'

// Redux 
import { connect } from 'react-redux'
import { getAllRequestLoans } from '../../../../../redux/actions/employeeActions'
import AuthGlobal from '../../../../../context/store/AuthGlobal'

// Components
import LoanCard from '../../../../../components/Cards/LoanCard'
import BackHeader from '../../../../../components/BackHeader'
import LoadingIndicator from '../../../../../components/LoadingIndicator'

const LoanScreen = (props) => {

    const {
        loans,
        getAllLoans
    } = props

    const toast = useToast()
    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const [loading, setLoading] = useState(false)
    const [refetch, setRefetch] = useState(0)

    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
    })

    const loadLoans = async () => {
        setLoading(true)
        try {
            await getAllLoans({
                name: '',
                loanDate: null,
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

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>Employees Loan</BackHeader>
            <LoadingIndicator loading={loading} >
                <FlatList
                    data={loans}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <Box variant={'card'} mx={4}  mt={4}>
                            <LoanCard data={{
                                ...item,
                                name: context.stateUser.user.UserFirstName
                            }}
                                index={index}
                                isList
                            />
                        </Box>
                    )}
                    keyExtractor={(item) => item.id}
                    refreshing={loading}
                    onRefresh={() => loadLoans()}
                    ListFooterComponent={<Box pb={60} />}
                />
            </LoadingIndicator>
            <Fab
                renderInPortal={false}
                icon={<Icon as={AntDesign} name={'plus'} />}
                onPress={() => navigation.navigate("Employee Add Loan Screen")}
            />
        </Box>
    )
}


const mapStateToProps = state => {
    return {
        loans: state.employee.loans
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllLoans: (data) => dispatch(getAllRequestLoans(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoanScreen)