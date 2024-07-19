import React, { useContext, useEffect, useState, useRef } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { createUser, getAllRoles, getAllSites, updateUser } from '../../../../../redux/actions/adminActions'



// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import withDataLoader from '../../../../../components/withDataLoader'
// import MultiSelect from 'react-native-multiple-select';

const AddUserScreen = (props) => {

    const {
        route,
        sites,
        roles,
        getAllSites,
        createUser,
        updateUser,
        getAllRoles
    } = props

    const toast = useToast()
    const { updateData } = route.params
    // console.log(updateData)



    const [loading, setLoading] = useState(false)
    const [roleId, setRoleId] = useState(updateData ? updateData.roleId : '');
    const [isMultiSite, setIsMultiSite] = useState(false)

    const checkIsMultiSite = () => {
        const selectedRole = roles?.find(role => role.roleId === roleId);

        if (selectedRole) {
            setIsMultiSite(selectedRole.isMultiSite)
        } else {
            setIsMultiSite(false)
        }
    }




    const inputs = [
        {
            label: 'Profile Picture',
            type: 'image',
            key: 'image'
        },
        {
            label: 'First Name',
            key: 'firstName',
            required: true
        },
        {
            label: 'Last Name',
            key: 'lastName'
        },
        {
            label: 'Email',
            key: 'email',
            required: true,
            regex: /\S+@\S+\.\S+/

        },
        {
            label: 'Description',
            key: 'description'
        },
        {
            label: 'Password',
            key: 'password',
            required: true
        },
        {
            label: 'Phone',
            keyboard: 'phone-pad',
            key: 'phone'
        },
        {
            label: 'Role',
            selectLabel: 'name',
            type: 'select',
            key: 'roleId',
            values: roles,
            required: true
        },
        {
            label: 'Site',
            type: isMultiSite ? 'multiSelect' : 'select',
            values: sites,
            selectLabel: 'name',
            key: 'siteId',
            required: true,
            updateKey: 'siteId'
        },
        {
            label: 'Gender',
            selectLabel: 'title',
            type: 'select',
            key: 'gender',
            values: [{
                gender: '0',
                title: 'Male'
            },
            {
                gender: '1',
                title: 'Female'
            }],
            required: true
        },
        // {
        //     label: 'Code',
        //     keyboard: 'numeric',
        //     key: 'code',
        //     required: true
        // },
        {
            label: 'Address',
            key: 'address'
        },
        {
            label: 'City',
            key: 'city'
        },
        {
            label: 'Country',
            key: 'country'
        },
        {
            label: 'Zip/Postal Code',
            keyboard: 'numeric',
            key: 'postalCode'
        },

    ]

    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null

    const loadData = async () => {
        setLoading(true)
        try {
            await getAllSites({
                fromDate: null,
                toDate: null,
                siteName: ''
            })
            await getAllRoles({
                roleId: 0
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
        loadData()
        checkIsMultiSite()
    }, [])

    useEffect(() => {
        checkIsMultiSite()
    }, [roleId])

    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>{!updateData ? 'Add' : 'Update'} User</BackHeader>
            <LoadingIndicator loading={loading} >
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                >
                    <Stack mx={4} mt={2} >
                        {
                            !updateData ? (
                                <CreateData
                                    saveFunction={createUser}
                                    inputs={inputs}
                                    setRoleId={setRoleId}
                                />
                            ) : (
                                <UpdateComponent
                                    saveFunction={updateUser}
                                    inputs={inputs}
                                    setRoleId={setRoleId}
                                />
                            )
                        }

                    </Stack>
                </ScrollView>
            </LoadingIndicator>
        </Box>
    )
}
const mapStateToProps = state => {
    return {
        sites: state.admin.sites,
        roles: state.admin.roles
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getAllSites: (data) => dispatch(getAllSites(data)),
        createUser: (data) => dispatch(createUser(data)),
        updateUser: (data) => dispatch(updateUser(data)),
        getAllRoles: (data) => dispatch(getAllRoles(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUserScreen)