import React, { useContext, useRef, useState } from 'react'

import { Box, FlatList, IconButton, Icon, Heading, Text, Stack, HStack, Pressable, Avatar, Menu, Badge } from 'native-base';

// Navigation 
import { useNavigation } from '@react-navigation/native';

// Icons
import Entypo from 'react-native-vector-icons/Entypo'

// mOMENT 
import moment from 'moment';

// Redux
import { connect } from 'react-redux';
import { getAllShifts } from '../../../../../../redux/actions/employeeActions';

// context
import AuthGlobal from '../../../../../../context/store/AuthGlobal';

const MyShift = (props) => {

    const { myShifts, getAllShift, flatListRef } = props

    // console.log(myShifts,'my shifts console')

    const ITEM_HEIGHT = 120;

    const navigation = useNavigation()
    const context = useContext(AuthGlobal)

    const [loading, setLoading] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            await getAllShift({
                id: context.stateUser.userID,
                status: 'My Shift'
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // const renderItem = ({ item, index }) => {
    //   const showDateHeader = index === 0 || moment(item.shiftDate).format('ddd, MMM D') !== moment(allShifts[index - 1].shiftDate).format('ddd, MMM D');

    //   return (
    //     <Box>
    //       {showDateHeader && (
    //         <Stack borderColor={'gray.200'} borderBottomWidth={1} p={4}>
    //           <Heading size={'sm'}>{moment(item.shiftDate).format('ddd, MMM D')}</Heading>
    //         </Stack>
    //       )}
    //       <Pressable
    //         _pressed={{ backgroundColor: 'gray.50' }}
    //         onPress={() => navigation.navigate('Shift Details Screen', { data: item })}
    //         borderColor={'gray.200'}
    //         borderBottomWidth={1}
    //         p={4}
    //         display={'flex'}
    //         flexDirection={'row'}
    //         alignItems={'center'}
    //       >
    //         <Avatar />
    //         <Stack ml={3}>
    //           <Heading size={'sm'}>
    //             {moment(item.startTime).format('H:mm a')}-{moment(item.endTime).format('H:mm a')}
    //           </Heading>
    //           <Text>
    //             {item.employeeName} as {item.position} at {item.scheduleName}
    //           </Text>
    //         </Stack>
    //       </Pressable>
    //     </Box>
    //   );
    // };


    const renderItem = ({ item }) => {
        return (
            <Box variant={'card'} mx={4} my={2} p={0} >
                <HStack space={2}>
                    <Stack width={70} alignItems={'center'} justifyContent={'center'} backgroundColor={'#36294f'} borderTopLeftRadius={14} borderLeftRadius={14} >
                        <Avatar
                        // source={{ uri: `${baseURL}${item.image.substring(2)}` }}
                        />
                    </Stack>
                    <Stack ml={-2} width={1} backgroundColor={'#9580d6'} />
                    <Stack py={2} space={1} >
                        {
                            item.allDay ?
                                <Text fontSize={14} >{moment(item.startDate).format('ddd MMM DD')}{item.startDate == item.endDate ? ' (All Day)' : ` - ${moment(item.endDate).format('ddd MMM DD')}`}</Text> :
                                <Text fontSize={14} >{moment(item.shiftDate).format('ddd MMM DD')} , {moment(item.startTime).format('h:ma')}-{moment(item.endTime).format('h:ma')}</Text>
                        }
                        {
                            item.employeeName ?
                                <Text>
                                    {item.employeeName}  at {item.scheduleName}
                                </Text> :
                                <Text>
                                    Open Shift  at {item.scheduleName}
                                </Text>
                        }
                    </Stack>
                </HStack>

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
                        <Menu.Item
                            onPress={() => navigation.navigate('Shift Details Screen',
                                { item: item, list: 'Open Shift' })
                            }
                        >Deatils</Menu.Item>
                    </Menu>
                }
            </Box>
        )
    }



    return (
        <FlatList
            ref={flatListRef}
            data={myShifts}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item.shiftId.toString()}
            renderItem={renderItem}
            getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
            })}
            onScrollToIndexFailed={info => {
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                    flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                })
            }}
            refreshing={loading}
            onRefresh={loadData}
            ListFooterComponent={() => <Box pb={16} ></Box>}
        />
    )
}

const mapStateToProps = state => {
    return {
        myshifts: state.employee.schedule.shifts.myshift
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllShift: data => dispatch(getAllShifts(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyShift)