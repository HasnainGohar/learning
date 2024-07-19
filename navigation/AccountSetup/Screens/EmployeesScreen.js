import React, { useState, useContext } from 'react'

// navigation
import { useNavigation } from '@react-navigation/native'

// Icon
import Entypo from 'react-native-vector-icons/Entypo'

//Context
// import { loginUser } from '../../../context/actions/Auth.actions'
import AuthGlobal from '../../../context/store/AuthGlobal'

//native base
import { Box, Button, FormControl, Heading, HStack, Input, Stack, Text, useToast, Select, Menu, IconButton, Icon, ScrollView, Modal } from 'native-base'

// Firebase
import analytics from '@react-native-firebase/analytics'


//redux
import { connect } from 'react-redux'
import { createEmployee, deleteEmployee, getAllEmployees } from '../../../redux/actions/adminActions'
import BackHeader from '../../../components/BackHeader'
// import { resetInternetCredentials } from 'react-native-keychain'
// import baseURL from '../../../assets/common/baseURL'

const EmployeesScreen = (props) => {

    const { route, createEmployee, employees, loadEmployees, userDetails, deleteEmployee ,positions} = props


    // const { positions } = route.params

    const navigation = useNavigation()
    const toast = useToast()
    const context = useContext(AuthGlobal)

    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [id, setId] = useState('')
    const [loading, setLoading] = useState(false)
    // const [loginLoading, setLoginLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteID, setDeleteID] = useState(null)


    const handleEmployee = async () => {
        setLoading(true)
        try {
            await analytics().logEvent('employee_created')
            const res = await createEmployee({
                firstName: name,
                code: code,
                positionId: id
            })

            if (res) {
                toast.show({
                    description: 'Employee Created '
                })
                loadEmployees({
                    firstName: null,
                    fromDate: null,
                    toDate: null,
                    siteId: null,
                })
            } else {
                toast.show({
                    description: 'Error'
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setName('')
            setCode('')
            setId('')
            loadEmployees({
                firstName: null,
                fromDate: null,
                toDate: null,
                siteId: null,
            })
        }
    }

    const onDelete = async () => {
        setDeleteLoading(true)
        try {
            await deleteEmployee(deleteID)
            setDeleteID(null)
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteLoading(false)
            loadEmployees({
                name: null,
                fromDate: null,
                toDate: null,
                siteId: null,
            })
        }
    }


    // const handleLogin = async () => {
    //     setLoginLoading(true)
    //     try {
    //         await analytics().logEvent('user_proceeded_from_employees_screen')
    //         await resetInternetCredentials(baseURL)
    //         await loginUser(userDetails.userEmail, userDetails.password, context.dispatch)
    //     } catch (e) {
    //         console.log(e)
    //         toast.show({
    //             title: 'Error',
    //             description: 'An Error Occured, Try Again Later!'
    //         })
    //     } finally {
    //         setLoginLoading(true)
    //     }
    // }

    return (
        <Box variant={'container'} safeAreaTop >

            <BackHeader>Add Employee</BackHeader>

            <Stack mb={'80'} space={4} mx={4} mt={2}>
                <FormControl>
                    <FormControl.Label>Employee Name</FormControl.Label>
                    <Input
                        placeholder='First Name'
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Checkin Code</FormControl.Label>
                    <Input
                        placeholder='Checkin Code'
                        value={code}
                        keyboardType='number-pad'
                        onChangeText={(text) => setCode(text)}
                    />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Position</FormControl.Label>
                    <Select selectedValue={id} minWidth="200" placeholder="Choose Position" mt={1} onValueChange={itemValue => setId(itemValue)}>
                        {positions.map((item, index) => (
                            <Select.Item key={index} label={item.name} value={item.positionId} />
                        ))}
                    </Select>
                </FormControl>
                <Button variant={'subtle'} onPress={handleEmployee} isLoading={loading} >Add</Button>

                {/* <HStack mt={2} justifyContent={'space-between'} >
                    <Button w={'48%'} variant={'subtle'} onPress={handleEmployee} isLoading={loading} >Add</Button>
                    <Button w={'48%'} variant={'subtle'} colorScheme={'success'} onPress={handleLogin} isLoading={loginLoading} >Next</Button>
                </HStack> */}
                <Heading size={'sm'} >Employees</Heading>
                <ScrollView showsVerticalScrollIndicator={false} >
                    <Stack mb={80} space={2}>
                        {
                            employees.map((item, index) => (
                                <Box variant={'card'} key={index}>
                                    <HStack justifyContent={'space-between'} alignItems={'center'} >
                                        <Stack>
                                            <Text bold fontSize={16}>{item.firstName}</Text>
                                            <Text>{item.positionName}</Text>
                                        </Stack>
                                        <Menu
                                            w={'32'}
                                            placement='left'
                                            trigger={triggerProps => {
                                                return <IconButton
                                                    icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                                                    size={'sm'}
                                                    {...triggerProps}
                                                />
                                            }}
                                        >
                                            {/* <Menu.Item onPress={() => navigation.navigate('Add Announcement Screen', { updateData: item })} >Edit</Menu.Item> */}
                                            <Menu.Item onPress={() => setDeleteID(item.id)} >Delete</Menu.Item>
                                        </Menu>
                                    </HStack>
                                </Box>
                            ))
                        }
                    </Stack>
                </ScrollView>
            </Stack>
            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Employee</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Employee?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Box >
    )
}

const mapStateToProps = state => {
    return {
        positions: state.admin.positions,
        employees: state.admin.employees,
        userDetails: state.admin.login
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createEmployee: (data) => dispatch(createEmployee(data)),
        loadEmployees: (data) => dispatch(getAllEmployees(data)),
        deleteEmployee: (data) => dispatch(deleteEmployee(data))

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EmployeesScreen)