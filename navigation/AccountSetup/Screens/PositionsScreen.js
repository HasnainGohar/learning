import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'


// Native Base
import { Box, Button, Center, FormControl, IconButton, Heading, HStack, Icon, Input, Stack, Text, Menu, Modal } from 'native-base'

// Firebase
import analytics from '@react-native-firebase/analytics'

//Icons
import Entypo from 'react-native-vector-icons/Entypo'

// Redux
import { connect } from 'react-redux'
import { createPosition, getAllPositions, deletePosition } from '../../../redux/actions/adminActions'
import BackHeader from '../../../components/BackHeader'

const PositionsScreen = (props) => {

    const { addPosition, loadPosition, positions, deletePosition } = props

    const [name, setName] = useState()
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteID, setDeleteID] = useState(null)

    const onDelete = async () => {
        setDeleteLoading(true)
        try {
            await deletePosition(deleteID)
            setDeleteID(null)
            await loadPosition({
                positionId: 0,
                name: '',
            })
        } catch (error) {
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setDeleteLoading(false)
        }
    }

    // const handleNext = async () => {
    //     await analytics().logEvent('user_proceed_from_positions_screens')
    //     navigation.navigate('Add Employees', { positions: positions })
    // }


    const handlePositions = async () => {
        setLoading(true)
        try {
            await analytics().logEvent('position_created')
            await addPosition({
                name: name,
                description: ''
            })
            await loadPosition({
                positionId: 0,
                name: '',
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setName('')
        }
    }


    return (
        <Box variant={'container'} safeAreaTop >
            <BackHeader>
                Add Position
            </BackHeader>

            <Stack space={4} mx={4} mt={2} >
                <Box variant={'card'} >
                    <Stack space={2} >
                        <FormControl>
                            <FormControl.Label>Position Name</FormControl.Label>
                            <Input
                                placeholder='Name'
                                value={name}
                                onChangeText={(text) => setName(text)}

                            />
                        </FormControl>
                        <Button variant={'subtle'} onPress={handlePositions} isLoading={loading} >Add</Button>

                    </Stack>
                </Box>


                <Heading size={'sm'} >Positions</Heading>
                {
                    positions.map((item, index) => (
                        <Box variant={'card'} key={index}>
                            <HStack justifyContent={'space-between'} alignItems={'center'} >
                                <Text bold fontSize={16}>{item.name}</Text>
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
                                    <Menu.Item onPress={() => setDeleteID(item.positionId)} >Delete</Menu.Item>
                                </Menu>
                            </HStack>
                        </Box>

                    ))
                }
            </Stack>
            
            <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                <Modal.Content>
                    <Modal.Header>
                        <Heading>Delete Position</Heading>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Are you sure want to delete this Position?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

        </Box>
    )
}

const mapStateToProps = state => {
    return {
        positions: state.admin.positions

    }
}

const mapDispatchToProps = dispatch => {
    return {
        addPosition: (data) => dispatch(createPosition(data)),
        loadPosition: data => dispatch(getAllPositions(data)),
        deletePosition: (data) => dispatch(deletePosition(data))

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PositionsScreen)