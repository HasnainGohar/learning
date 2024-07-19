import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'

// Native base
import { Avatar, Box, Fab, Heading, HStack, Icon, ScrollView, Stack, Text, Modal, Button } from 'native-base'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// API
import baseURL from '../../../../../assets/common/baseURL'


// Redux 
import { connect } from 'react-redux'
import { deleteCompany, getCompanyDetails } from '../../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../../components/BackHeader'
import LoadingIndicator from '../../../../../components/LoadingIndicator'

//context\
import AuthGlobal from '../../../../../context/store/AuthGlobal'
import { logoutUser } from '../../../../../context/actions/Auth.actions'


const CompanyScreen = (props) => {

    const { company, companyDetails, deleteCompany } = props

    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const [loading, setLoading] = useState(false)
    const [refetch, setRefetch] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)


    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
    })

    useEffect(() => {
        loadData()
    }, [refetch])

    const loadData = async () => {
        setLoading(true)
        try {
            await companyDetails()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        setDeleteLoading(true)
        try {
            await deleteCompany()
            setIsOpen(false)
            logoutUser(context.dispatch)
        } catch (error) {

        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader >Company Details</BackHeader>
            <LoadingIndicator loading={loading}>
                <Stack space={4}  >
                    <Box variant={'card'} mx={4} >
                        <HStack space={4} alignItems={'center'}  >
                            <Avatar
                                source={{ uri: `${baseURL}${company.companyLogo && company.companyLogo.substring(2)}` }}
                            ></Avatar>
                            <Stack space={1} >
                                <Heading fontSize={18} size={'md'} >{company.companyName}</Heading>
                                <Text fontSize={12} >{company.companyEmail}</Text>
                            </Stack>
                        </HStack>
                    </Box>

                    <Box variant={'card'} mx={4} >
                        <Stack space={2} >
                            <HStack alignItems={'center'} space={4} >
                                <Icon as={MaterialCommunityIcons} name={'phone'} color={'primary.600'} />
                                <Text>{company.companyMobile}</Text>
                            </HStack>
                            <HStack alignItems={'center'} w={'95%'} space={4} >
                                <Icon as={MaterialCommunityIcons} name={'map-marker'} color={'primary.600'} />
                                <Text>{company.companyAddress1}  {company.companyCity ? `,${company.companyCity}` : null}{company.companyCountry ? `,${company.companyCountry}` : null}</Text>
                            </HStack>
                        </Stack>
                    </Box>

                    {/* {company.companyNote !== "" && (
                        <Box variant={'card'} mx={4} >
                            <Stack space={2} >
                                <Heading size={'sm'} >Description</Heading>
                                <Text >{company.companyNote}</Text>
                            </Stack>
                        </Box>
                    )}  */}

                </Stack>
            </LoadingIndicator>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Company</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Company?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {
                context.stateUser.user.CanUpdateCompany == 'True' &&
                <Fab
                    bottom={20}
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'edit'} />}
                    onPress={() => navigation.navigate("Update Company Screen", { updateData: company })}
                />
            }

            {
                context.stateUser.user.CanDeleteCompany == 'True' &&
                <Fab
                    colorScheme={'error'}
                    icon={<Icon
                        as={MaterialCommunityIcons}
                        name='delete'
                    />}
                    renderInPortal={false}
                    onPress={() => setIsOpen(true)}
                />
            }
        </Box >
    )
}

const mapStateToProps = state => {
    return {
        company: state.admin.company
    }
}

const mapDispatchToProps = dispatch => {
    return {
        companyDetails: () => dispatch(getCompanyDetails()),
        deleteCompany: () => dispatch(deleteCompany())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyScreen)
