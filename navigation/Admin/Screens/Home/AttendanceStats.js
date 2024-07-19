import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

//Native Base
import { Avatar, Box, FlatList, Stack, useToast, Text, HStack, Heading } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { getDailyAbsent, getDailyAttendance } from '../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../components/BackHeader'
import AttendanceCard from '../../../../components/Cards/AttendanceCard'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import EmployeeCard from '../../../../components/Cards/EmployeeCard'
import baseURL from '../../../../assets/common/baseURL'

const AttendanceStats = (props) => {

    const {
        route,
        stats,
        present,
        late,
        absent,
        leave,
        getDailyAttendance,
        getDailyAbsent
    } = props

    const { screenName } = route.params

    const toast = useToast()

    const [loading, setLoading] = useState(false)

    // useFocusEffect(
    //     useCallback(() => {
    //         loadStats()
    //     }, [])
    // )

    // const loadStats = async () => {
    //     setLoading(true)
    //     try {
    //         if (screenName === 'Present' || screenName === 'Late') {
    //             await getDailyAttendance({
    //                 fromDate: new Date(),
    //                 toDate: new Date(),
    //                 name: null,
    //                 status: screenName
    //             })
    //         } else {
    //             await getDailyAbsent({
    //                 fromDate: new Date(),
    //                 toDate: new Date(),
    //                 name: null,
    //                 status: screenName
    //             })
    //         }
    //     } catch (error) {
    //         toast.show({
    //             title: 'Error',
    //             description: 'An Error Occured, Try Again Later!'
    //         })
    //         console.log(error)
    //     }
    //     finally {
    //         setLoading(false)
    //     }
    // }


    const loadData = () => {
        switch (screenName) {
            case 'Present':
                return present
            case 'Late':
                return late
            case 'Absent':
                return absent
            case 'Leave':
                return leave
        }
    }


    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <BackHeader>{screenName}</BackHeader>
                <FlatList
                    data={loadData()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return screenName === 'Present' || screenName === 'Late' ?
                            <AttendanceCard data={item} key={index} /> :
                            <Box variant={'card'} mx={4} my={2} >
                                <HStack alignItems={'center'} space={2} >
                                    <Avatar
                                        source={{ uri: `${baseURL}${item.image.substring(2)}` }}>
                                    </Avatar>
                                    <Stack space={1}>
                                        <Heading size={'sm'} >{item.firstName}</Heading>
                                        <Text fontSize={12}>{item.email}</Text>
                                    </Stack>
                                </HStack>
                            </Box>
                    }}
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={<Box mb={'16'} ></Box>}
                    refreshing={loading}
                // onRefresh={loadStats}
                />
            </LoadingIndicator>
        </Box>
    )
}


const mapStateToProps = state => {
    return {
        present: state.admin.dashboard.stats.details.present,
        late: state.admin.dashboard.stats.details.late,
        absent: state.admin.dashboard.stats.details.absent,
        leave: state.admin.dashboard.stats.details.leave,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        // getDailyAttendance: (data) => dispatch(getDailyAttendance(data)),
        // getDailyAbsent: (data) => dispatch(getDailyAbsent(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AttendanceStats)
