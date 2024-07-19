import React, { useState } from 'react'
import { Dimensions } from 'react-native'



// Native Base
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Modal,
  Pressable,
  Stack,
  Text,

} from 'native-base'

// Icon 
import AntDesign from 'react-native-vector-icons/AntDesign'


// Date Time
import moment from 'moment'


// Components

import LeaveCard from '../../../../components/Cards/LeaveCard'
import LoanCard from '../../../../components/Cards/LoanCard'

// Redux
import { connect } from 'react-redux'
import {
  updateLoanRequest,
  updateLeaveRequest,
  getDashboard,
} from '../../../../redux/actions/adminActions'


const width = Dimensions.get('window').width

const PendingRequests = (props) => {
  const { leaveRequests, loanRequests, getDashboard, updateLoanRequest, updateLeaveRequest, siteId } = props

  const [request, setRequest] = useState(null)
  const [requestLoading, setRequestLoading] = useState({ approved: false, reject: false });



  const handlerequest = async (request, status) => {
    setRequestLoading(prev => ({ ...prev, [status.toLowerCase()]: true }));
    try {
      if (request.type === 'Loan') {
        await updateLoanRequest({
          id: request.data.id,
          status: status,
          tenure: request.data.tenure,
          amount: request.data.amount
        });
      } else {
        await updateLeaveRequest({
          id: request.data.id,
          status: status,
          reason: request.data.reason || ''
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      await getDashboard({
        date: new Date(),
        siteId: siteId ? siteId : 0
      });
      setRequestLoading({ approved: false, reject: false });
      setRequest(null);
    }
  }


  return (
    <Box>
      <Stack space={3}>

        {
          leaveRequests?.length >= 1 &&
          <Box variant={'card'} mx={4} >
            <HStack justifyContent={'space-between'} alignItems={'center'} mb={2} >
              <Heading size={'md'} color={'black'} fontSize={18}  >Leave Requests</Heading>
              <Text>{leaveRequests.length} Request{leaveRequests.length !== 1 && 's'}</Text>
            </HStack>

            {leaveRequests.map((item, index) => (
              <Stack key={index} >
                <Divider my={2} />
                {/* <Pressable
                  _pressed={{
                    transform: [{ scale: 0.95 }]
                  }}
                  onPress={() => setRequest({
                    type: 'Leave',
                    data: item
                  })}
                > */}
                <LeaveCard data={item} index={index} isAdmin={false} />
                {/* </Pressable> */}
                <HStack my={4} space={2} justifyContent={'flex-end'} >
                  <Button
                    w={'32%'}
                    variant={'subtle'}
                    colorScheme={'error'}
                    size={"sm"}
                    onPress={() => handlerequest(request, 'Reject')}
                    isLoading={requestLoading.reject}
                    isDisabled={requestLoading.approved || requestLoading.reject}
                  >Reject</Button>
                  <Button
                    w={'32%'}
                    variant={'subtle'}
                    colorScheme={'success'}
                    size={"sm"}
                    onPress={() => handlerequest(request, 'Approved')}
                    isLoading={requestLoading.approved}
                    isDisabled={requestLoading.approved || requestLoading.reject}
                  >Approve</Button>
                </HStack>
              </Stack>
            ))}
          </Box>
        }
        {/* Loan Request */}
        {
          loanRequests?.length >= 1 &&
          <Box variant={'card'} mx={4}  >
            <HStack justifyContent={'space-between'} alignItems={'center'} mb={2} >
              <Heading size={'md'} color={'black'} fontSize={18}  >Loan Requests</Heading>
              <Text>{loanRequests.length} Request{loanRequests.length !== 1 && 's'}</Text>
            </HStack>
            {
              loanRequests.map((item, index) => (
                <Stack key={index} >
                  <Divider my={2} />
                  <Pressable
                    _pressed={{
                      transform: [{ scale: 0.95 }]
                    }}
                    onPress={() => setRequest({
                      type: 'Loan',
                      data: item
                    })}
                  >
                    <LoanCard data={item} index={index} />
                  </Pressable>
                  <HStack my={4} space={2} justifyContent={'flex-end'} >
                    <Button
                      w={'32%'}
                      variant={'subtle'}
                      colorScheme={'error'}
                      size={"sm"}
                      onPress={() => handlerequest(request, 'Reject')}
                      isLoading={requestLoading.reject}
                      isDisabled={requestLoading.approved || requestLoading.reject}
                    >Reject</Button>
                    <Button
                      w={'32%'}
                      variant={'subtle'}
                      colorScheme={'success'}
                      size={"sm"}
                      onPress={() => handlerequest(request, 'Approved')}
                      isLoading={requestLoading.approved}
                      isDisabled={requestLoading.approved || requestLoading.reject}
                    >Approve</Button>
                  </HStack>
                </Stack>
              ))
            }
          </Box>
        }

      </Stack>
      <Modal
        isOpen={Boolean(request)}
        style={{
          display: null,
          alignItems: 'stretch',
          justifyContent: 'space-between'
        }}
        _backdrop={{
          opacity: 1,
          backgroundColor: '#fff'
        }} >
        <Box mt={'16'} mx={4} >
          <HStack alignItems={'center'} justifyContent={'space-between'} >
            <Heading>{request?.type} Request</Heading>
            <IconButton
              size={'sm'}
              icon={<Icon as={AntDesign} name={'close'} />}
              onPress={() => setRequest(null)}
            />
          </HStack>
          {request?.type === 'Leave' && (
            <Stack mt={6} space={2} >
              <Heading fontWeight={'600'} color={'black'} >{request?.data.name}</Heading>
              <Text>{request?.data.reason}</Text>
              <HStack space={4} alignItems={'center'} >
                <Text>{moment(request?.data.fromDate).format("DD MMMM YYYY")}</Text>
                <Divider w={12} />
                <Text>{moment(request?.data.toDate).format("DD MMMM YYYY")}</Text>
              </HStack>
            </Stack>
          )}
          {request?.type === 'Loan' && (
            <Stack mt={6} space={2} >
              <Heading fontWeight={'600'} color={'black'} >{request?.data.name}</Heading>
              <HStack space={2} >
                <Text fontSize={16} fontWeight={'600'} >Rs. {request?.data.amount}</Text>
                <Text fontSize={16} >for</Text>
                <Text fontSize={16} fontWeight={'600'} >{request?.data.tenure} Months</Text>
              </HStack>

              <Text>Dated: {moment(request?.data.loanDate).format("DD MMMM YYYY")}</Text>

            </Stack>
          )}
        </Box>

      </Modal>
    </Box>
  )
}


const mapDispatchToProps = dispatch => {
  return {
    getDashboard: (data) => dispatch(getDashboard(data)),
    updateLoanRequest: (data) => dispatch(updateLoanRequest(data)),
    updateLeaveRequest: (data) => dispatch(updateLeaveRequest(data)),
  }
}

export default connect(null, mapDispatchToProps)(PendingRequests)


