import React, { useEffect, useState } from 'react'

import { Box, FlatList, HStack, Heading, Stack, Switch, Text, useToast } from 'native-base'

// Components
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import BackHeader from '../../../../../components/BackHeader'


// Redux
import { connect } from 'react-redux'
import { taskDetails } from '../../../../../redux/actions/adminActions'
import API from '../../../../../utils/API'


const TaskDetailsScreen = (props) => {

    const { details, getTaskDetails, route } = props
    const { updateData } = route.params

    const toast = useToast()

    // const Documents = details.map((item) => item.attachments)

    // const single = Documents.map(item => item[0])
    // // console.log(Documents)

    // console.log(single[0].name)


    const [loading, setLoading] = useState(false)
    const [statusLoading, setStatusLoading] = useState(false)
    const [status, setStatus] = useState()
        

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            await getTaskDetails(updateData.taskId)
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

    const updateTaskStatus = async (employeeId) => {
        setStatusLoading(true)
        try {
            const { res, abortController } = await API({
                method: 'POST',
                uri: 'api/Task/EmployeeTaskStatus',
                requestConfig: {
                    taskId: updateData.taskId,
                    employeeId: employeeId,
                    status: status ? 'Completed' : 'Pending'
                }
            })
            console.log(res)
        } catch (e) {
            console.log(e)
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setStatusLoading(false)
        }
    }

    return (
        <Box variant={'container'} safeAreaTop>
            <LoadingIndicator loading={loading}>
                <Stack space={4}>
                    <BackHeader>
                        Task Details
                    </BackHeader>

                    <FlatList
                        data={details.employeeDetail}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()} // Use index.toString() as the key
                        renderItem={({ item }) => (
                            <Box mx={4} variant={'card'} my={2}>
                                <HStack justifyContent={'space-between'}>
                                    <Heading size={'md'}>{item.name}</Heading>
                                    <HStack space={2} alignItems={'center'}>
                                        <Text>{item.status}</Text>
                                        <Switch
                                            value={status} // Use item.status or its equivalent to set the initial value
                                        // onValueChange={() => {
                                        //     setStatus(!status);
                                        //     updateTaskStatus(item.employeeId); // Pass the employeeId of the current item
                                        // }}
                                        />
                                    </HStack>
                                </HStack>
                            </Box>
                        )}
                    />


                </Stack>
            </LoadingIndicator>

        </Box>
    )
}

const mapStateToProps = state => {
    return {
        details: state.admin.taskDetails
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getTaskDetails: data => dispatch(taskDetails(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailsScreen)