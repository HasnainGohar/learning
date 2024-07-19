import React, { useEffect, useState, useContext } from 'react'

// Native Base
import { Avatar, Badge, Box, Container, FlatList, HStack, Heading, Icon, IconButton, Menu, Stack, Text } from 'native-base'

// Navigation
import { useNavigation } from '@react-navigation/native'

// moment
import moment from 'moment'
import baseURL from '../../../../../assets/common/baseURL'
import AuthGlobal from '../../../../../context/store/AuthGlobal'

// Icons
import Entypo from 'react-native-vector-icons/Entypo'

// Redux
import { connect } from 'react-redux'
import { getRequestShiftList } from '../../../../../redux/actions/adminActions'

const RequestShiftList = (props) => {

    const { getShiftRquestList, timeRequestList } = props

    console.log(timeRequestList, 'RequestShiftList')

    const context = useContext(AuthGlobal)
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            await getShiftRquestList()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Box variant={'container'}>
            {
                timeRequestList.length > 0 ?
                    <FlatList
                        data={timeRequestList}
                        keyExtractor={(item) => item.leaveId}
                        renderItem={({ item }) => (
                            <Box variant={'card'} mx={4} mt={3} p={0} >
                                <HStack space={2}>
                                    <Stack width={70} alignItems={'center'} justifyContent={'center'} backgroundColor={'#36294f'} borderTopLeftRadius={14} borderLeftRadius={14} >
                                        <Avatar
                                            source={{ uri: `${baseURL}${item?.image?.substring(2)}` }}
                                        />
                                    </Stack>
                                    <Stack ml={-2} width={1} backgroundColor={'#9580d6'} />
                                    <Stack py={2}  >
                                        <Heading size={'sm'} >{item.employeeName}</Heading>
                                        {
                                            item.allDay ?
                                                <Text fontSize={14} >{moment(item.startDate).format('ddd MMM DD')}{item.startDate == item.endDate ? ' (All Day)' : ` - ${moment(item.endDate).format('ddd MMM DD')}`}</Text> :
                                                <Text fontSize={14} >{moment(item.shiftDate).format('ddd MMM DD')} , {moment(item.startTime).format('h:ma')}-{moment(item.endTime).format('h:ma')}</Text>

                                        }
                                        <Text>Drop Shift at {item.scheduleName}</Text>
                                    </Stack>
                                </HStack>
                                {/* <Badge position={'absolute'} right={2} bottom={2} borderRadius={'15'} colorScheme={item.status == 'Approved' ? 'success' : 'error'}>{`${item.status}`}</Badge> */}

                                {
                                    (context.stateUser.user.CanUpdateSite == 'True' || context.stateUser.CanDeleteSite == 'True') &&
                                    <Menu
                                        w={'32'}
                                        placement='left'
                                        trigger={triggerProps => {
                                            return <IconButton
                                                icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                                                position={'absolute'}
                                                right={2}
                                                top={2}
                                                size={'sm'}
                                                {...triggerProps}
                                            />
                                        }}
                                    >
                                        <Menu.Item onPress={() => navigation.navigate('Request Details Screen', { data: item, list: 'Shift' })} >Deatils</Menu.Item>
                                        {/* {context.stateUser.user.CanUpdateSite == 'True' && <Menu.Item onPress={() => navigation.navigate('Add Request Screen', { updateData: item })} >Edit</Menu.Item>}
                                        {context.stateUser.user.CanDeleteSite == 'True' && <Menu.Item onPress={() => setDeleteID(item.leaveId)} >Delete</Menu.Item>} */}
                                    </Menu>
                                }
                            </Box>

                        )}
                        ListFooterComponent={<Box mb={'16'} ></Box>}
                        showsVerticalScrollIndicator={false}
                        refreshing={loading}
                        onRefresh={loadData}
                    />
                    :
                    <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Heading my={2}>Shift Requests</Heading>
                        <Text mx={4} textAlign={'center'}>
                            Let employee drop or swap shifts based on the settings you define you can change these settings from our web app
                        </Text>
                    </Box>
            }
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        timeRequestList: state.admin.request.shiftRequestList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getShiftRquestList: data => dispatch(getRequestShiftList()),

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RequestShiftList)
