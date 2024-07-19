import React, { useState } from 'react'

import { Box, ScrollView, Stack } from 'native-base'

// Custom Components
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import withDataLoader from '../../../../../components/withDataLoader'

//Redux
import { connect } from 'react-redux'
import { createRole, updateRole } from '../../../../../redux/actions/adminActions'



const AddRoleScreen = (props) => {

    const { route, createRole, updateRole } = props
    const { updateData } = route.params


    const [loading, setLoading] = useState(false)

    const inputs = [
        {
            label: 'Role Name',
            key: 'name',
            required: true
        },
        {
            label: 'Role Description',
            key: 'description'
        },
        {
            label: 'Role Level',
            selectLabel: 'title',
            type: 'select',
            key: 'roleCode',
            values: [
                {
                    roleCode: 'AD',
                    title: 'Admin'
                },
                {
                    roleCode: 'AM',
                    title: 'Area Manager'
                },
                {

                    roleCode: 'SM',
                    title: 'Site Manager'
                },

                {
                    roleCode: 'EM',
                    title: 'Employee'
                },

            ],
            required: true
        },
        {
            label: 'Role Code',
            key: 'roleCode',
            editable: true
        },
        {
            key: 'canViewAttendance',
            checkBoxLabel: 'Attendance history',
            type: 'checkbox',
        },
        {
            key: 'canViewEmployee',
            checkBoxLabel: 'Employee management',
            type: 'checkbox',
            children: [
                { key: 'addEmployee', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateEmployee', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteEmployee', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewLeave',
            checkBoxLabel: 'Leave management',
            type: 'checkbox',
            children: [
                { key: 'addLeave', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateLeave', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteLeave', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewLoan',
            checkBoxLabel: 'Loan management',
            type: 'checkbox',
            children: [
                { key: 'addLoan', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateLoan', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteLoan', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewHoliday',
            checkBoxLabel: 'Public holiday',
            type: 'checkbox',
            children: [
                { key: 'addHoliday', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateHoliday', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteHoliday', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewUser',
            checkBoxLabel: 'User',
            type: 'checkbox',
            children: [
                { key: 'addUser', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateUser', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteUser', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewPosition',
            checkBoxLabel: 'Position',
            type: 'checkbox',
            children: [
                { key: 'addPosition', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updatePosition', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deletePosition', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewSite',
            checkBoxLabel: 'Site',
            type: 'checkbox',
            children: [
                { key: 'addSite', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateSite', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteSite', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewCompany',
            checkBoxLabel: 'Company profile',
            type: 'checkbox',
            children: [
                // { key: 'addCompany', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateCompany', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteCompany', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewRole',
            checkBoxLabel: 'Role',
            type: 'checkbox',
            children: [
                { key: 'addRole', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateRole', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteRole', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewTask',
            checkBoxLabel: 'Task Mangament',
            type: 'checkbox',
            children: [
                { key: 'addTask', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateTask', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteTask', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        {
            key: 'canViewAnnouncement',
            checkBoxLabel: 'View announcemet',
            type: 'checkbox',
            children: [
                { key: 'addAnnouncement', checkBoxLabel: 'Add', type: 'checkbox' },
                { key: 'updateAnnouncement', checkBoxLabel: 'Update', type: 'checkbox' },
                { key: 'deleteAnnouncement', checkBoxLabel: 'Delete', type: 'checkbox' },
            ],
        },
        // {
        //     key: 'canViewSchedule',
        //     checkBoxLabel: 'View Schedule',
        //     type: 'checkbox',
        //     children: [
        //         { key: 'addSchedule', checkBoxLabel: 'Add', type: 'checkbox' },
        //         { key: 'updateSchedule', checkBoxLabel: 'Update', type: 'checkbox' },
        //         { key: 'deleteSchedule', checkBoxLabel: 'Delete', type: 'checkbox' },
        //     ],
        // },
        {
            key: 'isSingleSite',
            checkBoxLabel: 'Single Site',
            type: 'checkbox',
        },
        {
            key: 'isMultiSite',
            checkBoxLabel: 'Multi Site',
            type: 'checkbox',
        },
        // {
        //     label: 'Site Type',
        //     key: 'siteType',
        //     type: 'radio',
        //     options: [
        //         { label: 'Single Site', key: 'isSingleSite' },
        //         { label: 'Multi Site', key: 'isMultiSite' }
        //     ],
        //     required: true
        // }



    ]


    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null

    return (
        <Box variant={'container'}>
            <LoadingIndicator loading={loading}>
                <BackHeader>
                    {!updateData ? 'Add' : 'Update'} Role
                </BackHeader>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Stack mx={4} >
                        {!UpdateComponent ?
                            <CreateData
                                inputs={inputs}
                                saveFunction={createRole}

                            />
                            :
                            <UpdateComponent
                                inputs={inputs}
                                saveFunction={updateRole}
                            />

                        }
                    </Stack>
                </ScrollView>

            </LoadingIndicator>
        </Box>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        createRole: (data) => dispatch(createRole(data)),
        updateRole: (data) => dispatch(updateRole(data))
    }
}

export default connect(null, mapDispatchToProps)(AddRoleScreen)
