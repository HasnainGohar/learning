import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Context
import AuthGlobal from '../../../../../context/store/AuthGlobal'

// Redux
import { connect } from 'react-redux'
import { createPosition, updatePosition } from '../../../../../redux/actions/adminActions'

// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import withDataLoader from '../../../../../components/withDataLoader'


const AddPositionScreen = (props) => {

    const [loading, setLoading] = useState(false)

    const {
        route,
        createPosition,
        updatePosition
    } = props

    const { updateData } = route.params

    const inputs = [
        {
            label: 'Name',
            key: 'name',
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
                <BackHeader>{!updateData ? 'Add' : 'Update'} Position</BackHeader>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Stack mx={4} mt={2} >
                        {
                            !updateData ? (
                                <CreateData
                                    saveFunction={createPosition}
                                    inputs={inputs}
                                />
                            ) : (
                                <UpdateComponent
                                    saveFunction={updatePosition}
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

    }
}

const mapDispatchToProps = dispatch => {
    return {
        createPosition: (data) => dispatch(createPosition(data)),
        updatePosition: (data) => dispatch(updatePosition(data))
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(AddPositionScreen)