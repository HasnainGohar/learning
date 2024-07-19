import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast, Checkbox, PresenceTransition, Button, Icon, Text, IconButton, HStack, Pressable, useTheme, } from 'native-base'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'

// Context
import AuthGlobal from '../../../../context/store/AuthGlobal'

// Redux
import { connect } from 'react-redux'
import { createEmployee, getAllSites, updateEmployee, getAllPositions, addEmployeePassport, addEmployeeVisa, addEmployeeEducation, addEmployeeBank, addComplinceDocuments, getEmployeeByEmployeeId } from '../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../components/BackHeader'
import CreateData from '../../../../components/CreateData'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import withDataLoader from '../../../../components/withDataLoader'
import { Passport, bankDetails, complinceDocuments, contactdetails, education, visa } from './createDatainputs'

const AddEmployeeScreen = (props) => {

    const {
        route,
        sites,
        getAllSites,
        createEmployee,
        updateEmployee,
        getPositions,
        positions,
        addPassport,
        addVisa,
        addEducation,
        addBank,
        addComplinceDoc,
        getDetails,
        employee,
    } = props

    const { updateData, showDetails } = route.params



    const toast = useToast()
    const context = useContext(AuthGlobal)
    const isTakeImage = context.stateUser.user.IsTakeImage


    const [loading, setLoading] = useState(false)
    const [employeeSave, setEmployeeSave] = useState(false)
    const [employeeId, setEmployeeId] = useState(updateData ? updateData.id : null)
    const [openSection, setOpenSection] = useState(showDetails ? showDetails : 'employeeDetails')

    useEffect(() => {
        loadData()
    }, [])


    const loadData = async () => {
        setLoading(true)
        try {
            await getPositions({})
            await getDetails(employeeId)
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


    const toggleSection = (sectionKey) => {
        if (openSection === sectionKey) {
            setOpenSection(null);
        } else {
            setOpenSection(sectionKey)
        };
    }

    const employeeDetails = [
        {
            label: 'Profile Picture',
            type: 'image',
            key: 'image'
        },
        {
            label: 'Site',
            type: 'select',
            values: sites,
            selectLabel: 'name',
            key: 'siteId',
            required: true
        },
        {
            label: 'Position',
            type: 'select',
            values: positions,
            selectLabel: 'name',
            key: 'positionId',
            required: true
        },
        {
            label: 'First Name',
            key: 'firstName',
            required: true
        },
        {
            label: 'Last Name',
            key: 'lastName',
        },
        {
            label: 'Email',
            key: 'email',
            required: true,
            regex: /\S+@\S+\.\S+/
        },
        {
            label: 'Checkin Code',
            keyboard: 'numeric',
            key: 'code',
            required: true
        },
        {
            label: 'Date of Birth',
            type: 'datetime',
            key: 'dob',
            mode: 'date',
        },
        {
            label: 'Start Date',
            type: 'datetime',
            key: 'startDate',
            mode: 'date',
        },
        {
            label: 'End Date',
            type: 'datetime',
            key: 'endDate',
            mode: 'date',
        },
        {
            label: 'Starting Time',
            type: 'datetime',
            key: 'startTime',
            mode: 'time',
            required: true,

        },
        {
            label: 'Annual Leaves',
            keyboard: 'numeric',
            key: 'allocateLeave',
            required: true

        },
        {
            label: 'Working Hours',
            keyboard: 'numeric',
            key: 'workingHours',
            required: true
        },
        {
            label: 'CV',
            type: 'document',
            key: 'cv',
            multi: false
        },
        {
            checkBoxLabel: 'Allow user acess into the app?',
            key: 'createAppUser',
            type: 'checkbox',
        },
        {
            checkBoxLabel: 'Allow Self Attendance?',
            key: 'selfCheckIn',
            type: 'checkbox',
        },
        {
            checkBoxLabel: 'Employee Sponsored',
            key: 'sponsored',
            type: 'checkbox',
        },
        {
            checkBoxLabel: 'EU/EEA Nationals',
            key: 'EUEEANational',
            type: 'checkbox',
        },
    ]

    const TakeImageEmployeeDetails = isTakeImage == 'True' && [...employeeDetails, {
        checkBoxLabel: 'Take attendance image',
        key: 'takeImage',
        type: 'checkbox',
    }]


    const saveEmployeeDetails = async (values) => {
        setEmployeeSave(true)
        try {
            const res = await createEmployee(values)
            console.log(res)
            if (res.msg == 'Employee Code already Exists' || res.msg == 'You Cannot Enter More Employee. Upgrade to Pro!!') {
                toast.show({
                    description: res.msg
                })
            }
            if (res.status == 'success' && res.msg !== 'Employee Code already Exists') {
                setEmployeeId(res.employeeId)
                setOpenSection('contactDetails')
            }
        } catch (error) {
            toast.show({
                description: 'Network Error'
            })
        } finally {
            setEmployeeSave(false)
        }
    }


    const UpdateEmployeeDetails = updateData ? withDataLoader(CreateData, employee) : null
    const UpdateContactDetails = updateData ? withDataLoader(CreateData, employee) : null
    const UpdatePassportDetails = updateData ? withDataLoader(CreateData, employee?.passportDetail) : null
    const UpdateVisaDetails = updateData ? withDataLoader(CreateData, employee?.visaDetail) : null
    const UpdateBankDetails = updateData ? withDataLoader(CreateData, employee?.bankDetail) : null
    const UpdateEducationalDetails = updateData ? withDataLoader(CreateData, Array.isArray(employee?.educationDetail) ? employee?.educationDetail[0] : employee?.educationDetail) : null
    const UpdateAdditionalDetails = updateData ? withDataLoader(CreateData, Array.isArray(employee?.complinceDocuments) ? employee?.complinceDocuments[0] : employee?.complinceDocuments) : null

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader >{!updateData ? 'Add' : 'Update'} Employee</BackHeader>
            <LoadingIndicator loading={loading} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} space={2}  >
                        {!updateData ? (
                            <Stack space={3}>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    onPress={() => toggleSection('employeeDetails')}>

                                    <Text color={'white'}>
                                        Employee Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'employeeDetails' ? 'up' : 'down'} color={'white'} />
                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'employeeDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scaleY: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'employeeDetails' ? 'auto' : 0 }}>
                                        <CreateData
                                            saveFunction={(employeeDetails) => saveEmployeeDetails(employeeDetails)}
                                            inputs={isTakeImage == 'True' ? TakeImageEmployeeDetails : employeeDetails}
                                            datePickers={[
                                                { dob: false },
                                                { startDate: false },
                                                { endDate: false },
                                                { startTime: false }
                                            ]}
                                            saveButtonText={'Next'}
                                            isNavigate={false}
                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}

                                    onPress={() => toggleSection('contactDetails')}
                                >
                                    <Text color={'white'}>
                                        Contact Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'contactDetails' ? 'up' : 'down'} color={'white'} />

                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'contactDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scaleY: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'contactDetails' ? 'auto' : 0 }}>
                                        <CreateData
                                            saveFunction={(values) => {
                                                updateEmployee({
                                                    ...values,
                                                    id: employeeId
                                                })
                                                setOpenSection('educationDetails')
                                            }}
                                            inputs={contactdetails}
                                            saveButtonText={'Next'}
                                            isNavigate={false}
                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}

                                    onPress={() => toggleSection('educationDetails')}
                                >
                                    <Text color={'white'}>
                                        Educational Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'educationDetails' ? 'up' : 'down'} color={'white'} />

                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'educationDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scaleY: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'educationDetails' ? 'auto' : 0 }}>
                                        <CreateData
                                            saveFunction={(values) => {
                                                addEducation({
                                                    ...values,
                                                    id: employeeId
                                                })
                                                setOpenSection('bankDetails')
                                            }}
                                            inputs={education}
                                            isNavigate={false}
                                            showSaveButton={false}
                                            doubleButtons={true}
                                            saveButtonText='Next'
                                            AddMore={(values) => addEducation({
                                                ...values,
                                                id: employeeId
                                            })}
                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    onPress={() => toggleSection('bankDetails')}
                                >
                                    <Text color={'white'}>
                                        Bank Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'bankDetails' ? 'up' : 'down'} color={'white'} />

                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'bankDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scaleY: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'bankDetails' ? 'auto' : 0 }}>
                                        <CreateData
                                            saveFunction={(values) => {
                                                updateEmployee({
                                                    ...values,
                                                    id: employeeId
                                                })
                                                setOpenSection('passportDetails')
                                            }}
                                            inputs={bankDetails}
                                            saveButtonText={'Next'}
                                            datePickers={[
                                                { salaryDate: false }
                                            ]}
                                            isNavigate={false}
                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    onPress={() => toggleSection('passportDetails')}
                                >
                                    <Text color={'white'}>
                                        Passport Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'passportDetails' ? 'up' : 'down'} color={'white'} />
                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'passportDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'passportDetails' ? 'auto' : 0 }}>
                                        <CreateData
                                            saveFunction={(passportDetails) => {
                                                addPassport({
                                                    ...passportDetails,
                                                    id: employeeId
                                                })
                                                setOpenSection('visaDetails')
                                            }}
                                            inputs={Passport}
                                            saveButtonText='Next'
                                            datePickers={[
                                                { issueDate: false },
                                                { expiryDate: false }
                                            ]}
                                            isNavigate={false}
                                        />
                                    </Stack>
                                </PresenceTransition>

                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    onPress={() => toggleSection('visaDetails')}
                                >
                                    <Text color={'white'}>
                                        Visa Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection == 'visaDetails' ? 'up' : 'down'} color={'white'} />
                                </Pressable>
                                <PresenceTransition
                                    visible={openSection == 'visaDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection == 'visaDetails' ? 'auto' : 0 }}>
                                        <CreateData
                                            inputs={visa}
                                            saveFunction={(visaDetails) => {
                                                addVisa({
                                                    ...visaDetails,
                                                    id: employeeId,
                                                })

                                                setOpenSection('additionalDetails')
                                            }}
                                            isNavigate={false}
                                            datePickers={[
                                                { issueDate: false },
                                                { expiryDate: false },
                                            ]}
                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    onPress={() => toggleSection('additionalDetails')}>
                                    <Text color={'white'}>
                                        Additional DOC
                                    </Text>
                                    <Icon as={AntDesign} name={openSection == 'visaDetails' ? 'up' : 'down'} color={'white'} />
                                </Pressable>
                                <PresenceTransition
                                    visible={openSection == 'additionalDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection == 'additionalDetails' ? 'auto' : 0 }}>
                                        <CreateData
                                            isNavigate={false}
                                            showSaveButton={false}
                                            doubleButtons={true}
                                            inputs={complinceDocuments}
                                            saveFunction={(values) => addComplinceDoc({
                                                ...values,
                                                id: employeeId
                                            })}
                                            datePickers={[
                                                { issueDate: false },
                                                { expiryDate: false }
                                            ]}
                                            AddMore={(values) => addEducation({
                                                ...values,
                                                id: employeeId
                                            })}

                                        />

                                    </Stack>
                                </PresenceTransition>

                            </Stack>
                            //null
                        ) : (
                            <Stack space={3}>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    onPress={() => toggleSection('employeeDetails')}>

                                    <Text color={'white'}>
                                        Employee Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'employeeDetails' ? 'up' : 'down'} color={'white'} />
                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'employeeDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scaleY: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'employeeDetails' ? 'auto' : 0 }}>
                                        <UpdateEmployeeDetails
                                            saveFunction={(val) => {
                                                updateEmployee({
                                                    ...val,
                                                    id: employeeId
                                                })
                                                setOpenSection('contactDetails')
                                            }}
                                            inputs={isTakeImage == 'True' ? TakeImageEmployeeDetails : employeeDetails}
                                            datePickers={[
                                                { startTime: false },
                                                { dob: false },
                                                { startDate: false },
                                                { endDate: false },
                                            ]}
                                            saveButtonText={'Next'}
                                            isNavigate={false}
                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}

                                    onPress={() => toggleSection('contactDetails')}
                                >
                                    <Text color={'white'}>
                                        Contact Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'contactDetails' ? 'up' : 'down'} color={'white'} />

                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'contactDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scaleY: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'contactDetails' ? 'auto' : 0 }}>
                                        <UpdateContactDetails
                                            saveFunction={(values) => {
                                                updateEmployee({
                                                    ...values,
                                                    id: employeeId
                                                })
                                                setOpenSection('educationDetails')
                                            }}
                                            datePickers={[
                                                { startTime: false }
                                            ]}
                                            inputs={contactdetails}
                                            saveButtonText={'Next'}
                                            isNavigate={false}
                                            uiLoading={employeeSave}
                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}

                                    onPress={() => toggleSection('educationDetails')}
                                >
                                    <Text color={'white'}>
                                        Educational Documents
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'educationDetails' ? 'up' : 'down'} color={'white'} />

                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'educationDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scaleY: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'educationDetails' ? 'auto' : 0 }}>
                                        <UpdateEducationalDetails
                                            saveFunction={(values) => {
                                                addEducation({
                                                    ...values,
                                                    id: employeeId
                                                })
                                                setOpenSection('bankDetails')
                                            }}
                                            inputs={education}
                                            isNavigate={false}
                                            showSaveButton={false}
                                            saveButtonText={'Next'}
                                            doubleButtons={true}
                                            AddMore={(values) => {
                                                addEducation({
                                                    ...values,
                                                    id: employeeId
                                                })
                                            }}

                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}

                                    onPress={() => toggleSection('bankDetails')}
                                >
                                    <Text color={'white'}>
                                        Bank Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'bankDetails' ? 'up' : 'down'} color={'white'} />

                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'bankDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scaleY: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'bankDetails' ? 'auto' : 0 }}>
                                        <UpdateBankDetails
                                            saveFunction={(values) => {
                                                updateEmployee({
                                                    ...values,
                                                    id: employeeId
                                                })
                                                setOpenSection('passportDetails')
                                            }}
                                            datePickers={[
                                                { salaryDate: false }
                                            ]}
                                            inputs={bankDetails}
                                            saveButtonText={'Next'}
                                            isNavigate={false}
                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    onPress={() => toggleSection('passportDetails')}
                                >
                                    <Text color={'white'}>
                                        Passport Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection === 'passportDetails' ? 'up' : 'down'} color={'white'} />
                                </Pressable>
                                <PresenceTransition
                                    visible={openSection === 'passportDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection === 'passportDetails' ? 'auto' : 0 }}>
                                        <UpdatePassportDetails
                                            saveFunction={(passportDetails) => {
                                                addPassport({
                                                    ...passportDetails,
                                                    id: employeeId
                                                })
                                                setOpenSection('visaDetails')
                                            }}
                                            inputs={Passport}
                                            isNavigate={false}
                                            saveButtonText={'Next'}
                                            datePickers={[
                                                { issueDate: false },
                                                { expiryDate: false },
                                            ]}
                                        />
                                    </Stack>
                                </PresenceTransition>

                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    onPress={() => toggleSection('visaDetails')}
                                >
                                    <Text color={'white'}>
                                        Visa Details
                                    </Text>
                                    <Icon as={AntDesign} name={openSection == 'visaDetails' ? 'up' : 'down'} color={'white'} />
                                </Pressable>
                                <PresenceTransition
                                    visible={openSection == 'visaDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection == 'visaDetails' ? 'auto' : 0 }}>
                                        <UpdateVisaDetails
                                            saveFunction={(visaDetails) => {
                                                addVisa({
                                                    ...visaDetails,
                                                    id: employeeId,
                                                })
                                                setOpenSection('additionalDetails')
                                            }}
                                            inputs={visa}
                                            saveButtonText='Next'
                                            datePickers={[
                                                { issueDate: false },
                                                { expiryDate: false },
                                            ]}
                                            isNavigate={false}
                                        />
                                    </Stack>
                                </PresenceTransition>
                                <Pressable
                                    backgroundColor={'primary.600'}
                                    _pressed={{
                                        backgroundColor: 'primary.800'
                                    }}
                                    borderRadius={15}
                                    px={3}
                                    py={'2.5'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    onPress={() => toggleSection('additionalDetails')}>
                                    <Text color={'white'}>
                                        Additional DOC
                                    </Text>
                                    <Icon as={AntDesign} name={openSection == 'additionalDetails' ? 'up' : 'down'} color={'white'} />
                                </Pressable>
                                <PresenceTransition
                                    visible={openSection == 'additionalDetails'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, transition: { duration: 250 } }}
                                >
                                    <Stack style={{ height: openSection == 'additionalDetails' ? 'auto' : 0 }}>
                                        <UpdateAdditionalDetails
                                            inputs={complinceDocuments}
                                            isNavigate={false}
                                            showSaveButton={false}
                                            doubleButtons={true}
                                            saveFunction={(values) => addComplinceDoc({
                                                ...values,
                                                id: employeeId
                                            })}
                                            AddMore={(values) => addComplinceDoc({
                                                ...values,
                                                id: employeeId
                                            })}
                                            datePickers={[
                                                { issueDate: false },
                                                { expiryDate: false }
                                            ]}
                                        />
                                    </Stack>
                                </PresenceTransition>

                            </Stack>
                            //null
                        )}
                    </Stack>
                </ScrollView>
            </LoadingIndicator>
        </Box>
    )
}


const mapStateToProps = state => {
    return {
        sites: state.admin.sites,
        positions: state.admin.positions,
        employee: state.admin.employeeDetails

    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllSites: (data) => dispatch(getAllSites(data)),
        createEmployee: (data) => dispatch(createEmployee(data)),
        updateEmployee: (data) => dispatch(updateEmployee(data)),
        getPositions: (data) => dispatch(getAllPositions(data)),
        addPassport: (data) => dispatch(addEmployeePassport(data)),
        addVisa: (data) => dispatch(addEmployeeVisa(data)),
        addEducation: (data) => dispatch(addEmployeeEducation(data)),
        addBank: (data) => dispatch(addEmployeeBank(data)),
        addComplinceDoc: (data) => dispatch(addComplinceDocuments(data)),
        getDetails: (data) => dispatch(getEmployeeByEmployeeId(data)),
    }
}




export default connect(mapStateToProps, mapDispatchToProps)(AddEmployeeScreen)