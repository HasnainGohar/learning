import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { createAnnouncement, updateAnnouncement } from '../../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import withDataLoader from '../../../../../components/withDataLoader'
import API from '../../../../../utils/API'


const AddAnnouncemnetScreen = (props) => {

    const [loading, setLoading] = useState(false)

    const {
        route,
        createAnnouncement,
        updateAnnouncement
    } = props

    const { updateData } = route.params
    // console.log(updateData,'params')

  



    const inputs = [
        {
            label: 'Title',
            key: 'title',
            required: true
        },
        {
            label: 'Description',
            key: 'description',
            required: true
        },
    ]

    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null

    return (
        <Box variant={'conatiner'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <BackHeader>{!updateData ? 'Add' : 'Update'} Announcement</BackHeader>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} mt={2} >
                        {
                            !updateData ? (
                                <CreateData
                                    saveFunction={createAnnouncement}
                                    inputs={inputs}
                                />
                            ) : (
                                <UpdateComponent
                                    saveFunction={updateAnnouncement}
                                    inputs={inputs}
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
        announcements: state.admin.announcements
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createAnnouncement: (data) => dispatch(createAnnouncement(data)),
        updateAnnouncement: (data) => dispatch(updateAnnouncement(data))
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(AddAnnouncemnetScreen)