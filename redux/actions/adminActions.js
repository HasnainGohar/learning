import moment from "moment";
import API, { apiInstance } from "../../utils/API";
import { formDataInstance } from "../../utils/API";

import {
    GET_ALL_INDUSTRY,
    GET_BARCHART_DATA,
    GET_LEAVE_REQUESTS,
    UPDATE_LEAVE_REQUEST,
    GET_LOAN_REQUESTS,
    UPDATE_LOAN_REQUEST,
    GET_TODAYS_ATTENDANCE,
    GET_COMPANY_DETAILS,
    UPDATE_COMPANY_DETAILS,
    GET_ALL_EMPLOYEES,
    DELETE_EMPLOYEE,
    GET_ALL_SITES,
    GET_ALL_USERS,
    GET_ALL_ANNOUNCEMENT,
    GET_ALL_ATTENDANCE,
    GET_ABSENT_EMPLOYEES,
    DELETE_LOAN,
    GET_ALL_HOLIDAYS,
    REPAY_LOAN,
    GET_ALL_LEAVES,
    GET_ALL_LOANS,
    GET_LOAN_TITLES,
    GET_ALL_ONTIME,
    DELETE_ANNOUNCEMENT,
    DELETE_HOLIDAY,
    GET_ALL_LATE,
    GET_LEAVE_EMPLOYEES,
    GET_PRESENT_EMPLOYEES,
    GET_LATE_EMPLOYEES,
    DELETE_SITE,
    GET_ALL_POSITION,
    DELETE_POSITION,
    LOGINDETAILS,
    CLEAR_ALL_ATTENDANCE,
    DELETE_USER,
    CLEAR_TODAYS_ATTENDANCE,
    CLEAR_ALL_DATA,
    GET_BREAK_USERS,
    GET_COMPANY_DASHBOARD,
    GET_LEAVES_DASHBOARD,
    EMPLOYEE_LEAVES_DASHBOARD,
    GET_ALL_ROLES,
    TOGGLE_EMPLOYEE_STATUS,
    DELETE_ROLES,
    GET_ALL_TASKS,
    TASK_DETAILS,
    DELETE_TASK,
    GET_TASK_CHART,
    GET_ALL_OFF_REQUEST_TYPES,
    DELETE_SCHEDULE,
    GET_ALL_SCHEDULE,
    GET_ALL_SHIFTS,
    GET_ALL_OFF_Time_REQUESTS,
    DELETE_OFF_Time_REQUESTS,
    GET_ALL_SHIFT_REQUESTS,
    GET_OPEN_SHIFT,
    GET_MY_SHIFTS,
    TAKE_SHIFT_LIST,
    GET_ALL_OPEN_SHIFT_REQUESTS,
    DELETE_ALL_SHIFTS,
    DELETE_GET_OPEN_SHIFT,
    GET_LEAVE_TITLES,
    DELETE_EMPLOYEE_EDUCATION,
    DELETE_EMPLOYEE_PASSPORT,
    DELETE_EMPLOYEE_BANK,
    DELETE_EMPLOYEE_VISA,
    DELETE_EMPLOYEE_COMPLINCE,
    GET_SINGLE_EMPLOYEES,
    COMPLIANCE_DASHBOARD,
    GET_EMPLOYEE_COUNT,
    GET_SITES,
} from "./actionTypes";

/*
  Dashboard
*/

export const getPaymentDetail = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: '/api/StripePayment/GetUserDetailsForPayment',
            requireAuth: true,
        })
        return res
    } catch (e) {
        throw new Error(e)
    }
}

export const createPaymentIntent = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: '/api/StripePayment/CreatePaymentIntent',
            requireAuth: true,
        })
        return res
    } catch (e) {
        throw new Error(e)
    }

}

export const subscribeUser = (data) => async (dispatch) => {
    const { clientSecret } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: '/api/Company/SubscribedUser',
            requireAuth: true,
            requestConfig: {
                clientSecret
            }
        })
        return res
    } catch (e) {
        throw new Error(e)
    }

}

// export const getDashboard = (data) => async (dispatch, getState) => {

//     const { date, siteId, } = data
//     try {
//         const { data: res, abortController } = await API({
//             method: 'POST',
//             url: 'api/Dashboard/DashboardAPI',
//             requireAuth: true,
//             requestConfig: {
//                 todayDate: date,
//                 siteId: siteId
//             }
//         })
//         if (res.responseMsg == 'Dashboard Data Displayed Successfully') {
//             dispatch({
//                 type: GET_COMPANY_DASHBOARD,
//                 payload: {
//                     stats: {
//                         present: res.result.dayData.present,
//                         absent: res.result.dayData.absent,
//                         leave: res.result.dayData.leave,
//                         late: res.result.dayData.late,
//                         employeesLenght: res.result.dayData.totalCompanyEmployee,
//                         positionsLenght: res.result.dayData.positionCount,
//                         siteList: res.result.siteLocationList.map((item) => ({
//                             name: item.siteName,
//                             siteId: item.siteId
//                         })),
//                         details: {
//                             present: res.result.presentList?.map((item) => (
//                                 {
//                                     workingTime: item.workingTime,
//                                     breakTime: item.totalBreakTime,
//                                     onTime: item.isOnTime,
//                                     allocateHours: item.allocateHours,
//                                     checkInImage: item.checkInImage,
//                                     checkOutImage: item.checkInImage,
//                                     checkInLatitude: item.checkInLatitude,
//                                     checkOutLatitude: item.checkOutLatitude,
//                                     checkOutLongitude: item.checkOutLongitude,
//                                     checkInLongitude: item.checkInLongitude,
//                                     reason: item.earlyCheckOutReason,
//                                     name: item.employeeName,
//                                     checkOutTime: item.checkOutTime,
//                                     checkInTime: item.checkInTime,
//                                     email: item.emailEmployee
//                                 }
//                             )),
//                             absent: res.result.absentlist?.map((item) => ({
//                                 firstName: item.firstName,
//                                 email: item.email,
//                                 image: item.image

//                             })),
//                             leave: res.result.leaveList?.map((item) => ({
//                                 firstName: item.firstName,
//                                 email: item.email,
//                                 image: item.image

//                             })),
//                             late: res.result.lateList?.map((item) => ({
//                                 workingTime: item.workingTime,
//                                 breakTime: item.totalBreakTime,
//                                 onTime: item.isOnTime,
//                                 allocateHours: item.allocateHours,
//                                 checkInImage: item.checkInImage,
//                                 checkOutImage: item.checkInImage,
//                                 checkInLatitude: item.checkInLatitude,
//                                 checkOutLatitude: item.checkOutLatitude,
//                                 checkOutLongitude: item.checkOutLongitude,
//                                 checkInLongitude: item.checkInLongitude,
//                                 reason: item.earlyCheckOutReason,
//                                 name: item.employeeName,
//                                 checkOutTime: item.checkOutTime,
//                                 checkInTime: item.checkInTime,
//                                 email: item.emailEmployee
//                             })),

//                         }
//                     },
//                     barChart: res.result?.chartData?.map((item) => ({
//                         present: item.present,
//                         absent: item.absent,
//                         leave: item.leave,
//                         late: item.late,
//                         date: item.date
//                     })),
//                     leaveRequests: res.result?.pendingleavelist?.map((item) => ({
//                         id: item.leaveId,
//                         name: item.firstName,
//                         fromDate: item.fromDate,
//                         toDate: item.toDate,
//                         leaveTitle: item.leaveTitle,
//                         titleId: item.leaveTitleId,
//                         status: item.leaveStatus,

//                     })),
//                     loanRequests: res.result?.pendingloanList?.map((item) => ({
//                         id: item.requestId,
//                         name: item.firstName,
//                         amount: item.loanAmount,
//                         status: item.loanStatus,
//                         loanDate: item.loanDate,
//                         tenure: item.loanReason
//                     }))
//                 }
//             })
//         } else {
//             return new Error('Network Error')
//         }
//         return { abortController }
//     }
//     catch (error) {
//         throw new Error(error)
//     }
// }

export const getEmployeeCount = (data) => async (dispatch, getState) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/EmployeeCount',
            requireAuth: true,
            requestConfig: data
        })
        if (res.responseMsg === 'Dashboard Data Displayed Successfully') {
            dispatch({
                type: GET_EMPLOYEE_COUNT,
                payload: res.result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}


export const clearDashboardData = (data) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CLEAR_DASHBOARD_DATA
        })
    }
    catch (error) {
        throw new Error(error)
    }
}


export const getLeaveRequests = (data) => async (dispatch, getState) => {

    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Leave/PendingLeaveLists',
            requireAuth: true,
        })
        // console.log(res)
        if (res.responseMsg === 'Leave List Displayed Successfully') {
            dispatch({
                type: GET_LEAVE_REQUESTS,
                payload: res.result?.map((item) => ({
                    id: item.leaveId,
                    name: item.firstName,
                    status: item.leaveDuration,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    reason: item.leaveReason,
                    isApproved: item.leaveStatus,
                    leaveTitle: item.leaveTitle,
                    titleId: item.leaveTitleId
                }))
            })
        } else if (res.responseMsg == 'No Leave List to Display') {
            dispatch({
                type: GET_LEAVE_REQUESTS,
                payload: []
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }

}

export const updateLeaveRequest = (data) => async (dispatch, getState) => {

    const { id, status, reason } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Leave/LeaveDecision',
            requireAuth: true,
            requestConfig: {
                leaveId: id,
                leaveStatus: status,
                rejectReason: reason,
            }
        })
        if (res.responseMsg == 'Employee Leave Approved Successfully' || res.responseMsg == 'Employee Leave Reject Successfully') {
            dispatch({
                type: UPDATE_LEAVE_REQUEST,
                payload: id
            })
        } else {
            throw new Error('Network Error')
        }

    } catch (error) {
        throw new Error(error)
    }
}

export const getLoanRequests = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Loan/PendingLoanList',
            requrieAuth: true
        })
        // console.log(res)
        if (res.responseMsg == 'Pending Loan Lists Displayed Successfully') {
            dispatch({
                type: GET_LOAN_REQUESTS,
                payload: res.result?.map((item) => ({
                    id: item.requestId,
                    name: item.firstName,
                    amount: item.loanAmount,
                    status: item.loanStatus,
                    date: item.loanDate,
                    tenure: item.loanReason
                }))
            })
        } else if (res.responseMsg == 'No Pending Loan List to Display') {
            dispatch({
                type: GET_LOAN_REQUESTS,
                payload: []
            })
        }
        else {
            return new Error('Network Error')
        }
        return { abortController }
    } catch (error) {
        throw new Error(error)
    }
}

export const updateLoanRequest = (data) => async (dispatch, getState) => {

    const { id, status, amount, tenure } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/LoanDecision',
            requrieAuth: true,
            requestConfig: {
                requestId: id,
                loanStatus: status,
                loanAmount: amount,
                loanReason: tenure
            }
        })
        if (res.responseMsg == 'Loan Approved Successfully' || res.responseMsg == 'Loan Reject Successfully') {
            dispatch({
                type: UPDATE_LOAN_REQUEST,
                payload: id
            })
        }
        else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getHolidayStatus = (data) => async (dispatch) => {

    const { fromDate, toDate, employeeName, attendancestatus } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/HolidayStatus',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employee_Name: employeeName,
                attendancestatus: attendancestatus
            }
        })
        dispatch({
            type: GET_ABSENT_EMPLOYEES,
            payload: res.responseData?.map((item) => ({
                name: item.firstName,
                email: item.email,
                image: item.image
            }))
        })
    } catch (error) {
        throw new Error('Error in fetching todays attendance')
    }
}


/*
   Attendance
 */

export const getAllAttendance = (data) => async (dispatch) => {

    const { fromDate, toDate, id, siteId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Attendance/AttendanceList',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employeeId: id,
                siteId: siteId

            }
        })
        // console.log(res)
        if (res.responseMsg == 'Attendance List Displayed Successfully') {
            const allAttendance = [];
            const breakUsers = [];
            res.result.forEach((item) => {
                const attendanceData = {
                    workingTime: item.workingTime,
                    breakTime: item.totalBreakTime,
                    onTime: item.isOnTime,
                    allocateHours: item.allocateHours,
                    checkInImage: item.checkInImage,
                    checkOutImage: item.checkOutImage,
                    checkInLatitude: item.checkInLatitude,
                    checkOutLatitude: item.checkOutLatitude,
                    checkOutLongitude: item.checkOutLongitude,
                    checkInLongitude: item.checkInLongitude,
                    reason: item.earlyCheckOutReason,
                    name: item.employeeName,
                    checkOutTime: item.checkOutTime,
                    checkInTime: item.checkInTime,
                    email: item.emailEmployee,
                    EOD: item.endOfDayReport,
                    onBreak: item.isOnBreak,
                    breakInTime: item.breakInTime
                }
                if (item.isOnBreak) {
                    breakUsers.push(attendanceData);
                } else {
                    allAttendance.push(attendanceData);
                }
            });
            dispatch({
                type: GET_ALL_ATTENDANCE,
                payload: allAttendance
            })
            dispatch({
                type: GET_BREAK_USERS,
                payload: breakUsers
            });
        } else if (res.responseMsg === 'No Attendance List to Display') {
            dispatch({
                type: GET_ALL_ATTENDANCE,
                payload: []
            })
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const clearAllAttendance = () => async (dispatch) => {

    try {
        dispatch({
            type: CLEAR_ALL_ATTENDANCE
        })
    } catch (error) {
        throw new Error(error)
    }
}


export const getPresentEmployees = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/PresentEmployees',
            requireAuth: true,
            requestConfig: data
        })
        if (res.responseMsg == 'Present Employees Displayed Successfully') {
            dispatch({
                type: GET_PRESENT_EMPLOYEES,
                payload: res.result?.map((item) => ({
                    workingTime: item.workingTime,
                    breakTime: item.totalBreakTime,
                    onTime: item.isOnTime,
                    allocateHours: item.allocateHours,
                    checkInImage: item.checkInImage,
                    checkOutImage: item.checkInImage,
                    checkInLatitude: item.checkInLatitude,
                    checkOutLatitude: item.checkOutLatitude,
                    checkOutLongitude: item.checkOutLongitude,
                    checkInLongitude: item.checkInLongitude,
                    reason: item.earlyCheckOutReason,
                    name: item.employeeName,
                    checkOutTime: item.checkOutTime,
                    checkInTime: item.checkInTime,
                    email: item.emailEmployee
                }))
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getAbsentEmployees = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/AbsentEmployees',
            requireAuth: true,
            requestConfig: data
        })
        if (res.responseMsg == 'Absent List Displayed Successfully') {
            dispatch({
                type: GET_ABSENT_EMPLOYEES,
                payload: res.result?.map((item) => ({
                    name: item.firstName,
                    positionName: item.positionName,
                    email: item.email,
                    image: item.image
                }))
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getLateEmployees = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/LateEmployees',
            requireAuth: true,
            requestConfig: data
        })
        if (res.responseMsg == 'Late Employees Displayed Successfully') {
            dispatch({
                type: GET_LATE_EMPLOYEES,
                payload: res.result?.map((item) => ({
                    workingTime: item.workingTime,
                    breakTime: item.totalBreakTime,
                    onTime: item.isOnTime,
                    allocateHours: item.allocateHours,
                    checkInImage: item.checkInImage,
                    checkOutImage: item.checkInImage,
                    checkInLatitude: item.checkInLatitude,
                    checkOutLatitude: item.checkOutLatitude,
                    checkOutLongitude: item.checkOutLongitude,
                    checkInLongitude: item.checkInLongitude,
                    reason: item.earlyCheckOutReason,
                    name: item.employeeName,
                    checkOutTime: item.checkOutTime,
                    checkInTime: item.checkInTime,
                    email: item.emailEmployee
                }))
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}
export const getLeaveEmployees = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/OnLeaveEmployees',
            requireAuth: true,
            requestConfig: data
        })
        if (res.responseMsg == 'Leave List Displayed Successfully') {
            dispatch({
                type: GET_LEAVE_EMPLOYEES,
                payload: res.result?.map((item) => ({
                    name: item.firstName,
                    positionName: item.positionName,
                    email: item.email,
                    image: item.image
                }))
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}


export const getSites = (data) => async (dispatch, getState) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/SiteDetail',
            requireAuth: true,
            requestConfig: data
        })
        if (res.responseMsg == 'Site Detail Displayed Successfully') {
            dispatch({
                type: GET_SITES,
                payload: res.result.siteDetails.map((item) => ({
                    name: item.siteName,
                    siteId: item.siteId
                })),
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }

}


export const markAttendance = (data) => async (dispatch) => {
    try {
        const {
            image,
            employeeCode,
            mode,
            latitude,
            longitude
        } = data

        const time = new Date().toString()
        const formData = new FormData()
        formData.append('Image', image)
        formData.append('EmployeeCode', employeeCode)
        formData.append('Mode', mode)
        formData.append('AttendanceTime', time)
        if (mode === 'Check-In') {
            formData.append('CheckInLatitude', latitude)
            formData.append('CheckInLongitude', longitude)
            formData.append('CheckOutLatitude', null)
            formData.append('CheckOutLongitude', null)
        } else if (mode === 'Check-Out') {
            formData.append('CheckInLatitude', null)
            formData.append('CheckInLongitude', null)
            formData.append('CheckOutLatitude', latitude)
            formData.append('CheckOutLongitude', longitude)
        }
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Attendance/MarkAttendance',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        return res.responseMsg
    } catch (error) {
        throw new Error(error)
    }
}

export const earlyCheckOutReason = (data) => async (dispatch) => {
    const { code, reason } = data
    try {
        const { data: res, abortController } = await API({
            instance: apiInstance,
            method: 'POST',
            url: 'api/Attendance/EarlyCheckOutReason',
            requireAuth: true,
            requestConfig: {
                employeeCode: code,
                earlyCheckOutReason: reason,
            }
        })
        return res.responseMsg
    } catch (error) {
        throw new Error(error)
    }
}

export const checkTakeImage = (data) => async (dispatch) => {
    const { code } = data
    try {
        const { data: res, abortController } = await API({
            instance: apiInstance,
            method: 'GET',
            url: `api/Attendance/CheckIsTakeImage?EmployeeCode=${code}`,
            requireAuth: true,
        })
        return res.result
    } catch (error) {
        throw new Error(error)
    }
}


/*
  Company
*/

export const getCompanyDetails = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Company/CompanyList',
            requireAuth: true,
        })
        if (res.responseMsg == 'Company List Displayed Successfully') {
            dispatch({
                type: GET_COMPANY_DETAILS,
                payload: {
                    companyId: res.result.companyId,
                    companyLogo: res.result.companyLogo,
                    companyName: res.result.companyName,
                    companyCode: res.result.companyCode,
                    companyEmail: res.result.companyEmail,
                    companyMobile: res.result.companyMobile,
                    companyAddress1: res.result.companyAddress1,
                    companyCity: res.result.companyCity,
                    companyCountry: res.result.companyCountry,
                    companyNote: res.result.companyNote,
                    companyLeaves: res.result.companyAnnualLeaves,
                    startTime: res.result.startTime,
                    endTime: res.result.endTime,
                    takeImage: res.result.isTakeImage,
                    useLocation: res.result.locationOnAttendance

                }
            })
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

// FormDataApi

export const updateCompanyDetails = (data) => async (dispatch) => {

    const formData = new FormData()
    data.companyId && formData.append('CompanyId', data.companyId)
    data.companyLogo && formData.append('CompanyLogo', data.companyLogo)
    data.companyName && formData.append('CompanyName', data.companyName)
    data.companyCode && formData.append('CompanyCode', data.companyCode)
    data.companyEmail && formData.append('CompanyEmail', data.companyEmail)
    data.companyMobile && formData.append('CompanyMobile', data.companyMobile)
    data.companyAddress1 && formData.append('CompanyAddress1', data.companyAddress1)
    data.companyCity && formData.append('CompanyCity', data.companyCity)
    data.companyCountry && formData.append('CompanyCountry', data.companyCountry)
    data.companyNote && formData.append('CompanyNote', data.companyNote)
    data.smtpEmail && formData.append('CompanySMTPEmail', data.smtpEmail)
    data.smtpPort && formData.append('CompanySMTPPort', data.smtpPort)
    data.smtpURL && formData.append('CompanySMTPURL', data.smtpURL)
    data.smtpPassword && formData.append('CompanySMTPPassword', data.smtpPassword)
    data.takeImage && formData.append('IsTakeImage', data.takeImage)
    data.startTime && formData.append('start', new Date(data.startTime).toString())
    data.endTime && formData.append('end', new Date(data.endTime).toString())
    data.useLocation && formData.append('LocationOnAttendance', data.useLocation)

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Company/UpdateCompany',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteCompany = () => async () => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Company/DeleteCompany`
        })
    } catch (error) {
        throw new Error('Error in Deleteing')
    }
}

/*
  Employees Actions
*/

export const getAllEmployees = (data) => async (dispatch) => {
    const { name, fromDate, toDate, siteId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/EmployeeList',
            requireAuth: true,
            requestConfig: {
                employee_Name: name,
                fromDate: fromDate,
                toDate: toDate,
                siteId: siteId
            }
        })


        if (res.responseMsg == 'Employee List Displayed Successfully') {
            await dispatch({
                type: GET_ALL_EMPLOYEES,
                payload: res.result?.map((item) => ({
                    id: item.employeeId,
                    userID: item.employeeUserId,
                    name: `${item.firstName} ${item.lastName}`,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    checkoutReason: item.checkOutReason,
                    allocateLeave: item.annualLeaves,
                    email: item.email,
                    gender: item.gender,
                    password: item.password,
                    phone: item.contactNumber,
                    address: item.addresses,
                    code: item.employeeCode,
                    dob: item.dateOfBirth,
                    city: item.city,
                    department: item.departmentName,
                    image: item.image,
                    startTime: item.startTime,
                    workingHours: item.workingHours,
                    isActive: item.activeBit,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    companyId: item.companyId,
                    siteId: item.siteId,
                    positionName: item.positionName,
                    positionId: item.positionId,
                    takeImage: item.isTakeImage,
                    siteName: item.siteName,
                    createAppUser: item.createAppUser,
                    activeBit: item.activeBit,
                    selfCheckIn: item.selfCheckIn,
                    passportDetail: {
                        documentId: item.documentId,
                        images: item?.passportDetail?.imagePath,
                        issueDate: item?.passportDetail?.issueDate,
                        expiryDate: item?.passportDetail?.expiryDate,
                        nationality: item?.passportDetail?.nationality
                    },
                    visaDetail: {
                        documentId: item?.visaDetail?.documentId,
                        images: item?.visaDetail?.imagePath,
                        issueDate: item?.visaDetail?.issueDate,
                        expiryDate: item?.visaDetail?.expiryDate,
                        category: item?.visaDetail?.category,
                        visaType: item?.visaDetail?.visaType,
                        status: item?.visaDetail?.status
                    },
                    bankDetail: {
                        bankDetailId: item?.bankDetail?.bankDetailId,
                        employeeId: item?.bankDetail?.employeeId,
                        bankName: item?.bankDetail?.bankName,
                        accountHolderName: item?.bankDetail?.accountHolderName,
                        accountNumber: item?.bankDetail?.accountNumber,
                        accountType: item?.bankDetail?.accountType,
                        country: item?.bankDetail?.country,
                        securityCode: item?.bankDetail?.securityCode,
                        month: item?.bankDetail?.month,
                        address: item?.bankDetail?.address,
                        postalCode: item?.bankDetail?.postalCode,
                        city: item?.bankDetail?.city,
                        salaryDate: item?.bankDetail?.salaryDate
                    },
                    educationDetail: item?.educationDetail?.map((item) => ({
                        educationId: item.educationId,
                        employeeId: item.employeeId,
                        qualification: item.qualification,
                        degree: item.degree,
                        year: item.year,
                        grade: item.grade,
                        degreeImage: item.degreeImage,
                        imagePath: item.imagePath
                    })),
                    complinceDocuments: item?.additionalDocumentDetails?.map((item) => ({
                        documentId: item?.documentId,
                        images: item?.imagePath,
                        issueDate: item?.issueDate,
                        expiryDate: item?.expiryDate,
                        status: item?.status,
                        category: item?.category,
                        notification: item?.notification,
                    })),
                    EUEEANational: item.eueeaNationals,
                    sponsored: item.employeeSponsored,
                    nationality: item.nationality,
                    nino: item.niNo,
                    cv: item.cvPath,
                    ecd: item.emergencyContactDetail
                }))
            })
        }
        else if (res.responseMsg == 'No Employee List to Display') {
            dispatch({
                type: GET_ALL_EMPLOYEES,
                payload: []
            })
        }
        else {
            return new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const getEmployeeByEmployeeId = (employeeId) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Employee/GetEmployeeByEmployeeId?EmployeeId=${employeeId}`,
            requireAuth: true,
        })


        if (res.responseMsg == 'Employee Details Displayed Successfully') {
            await dispatch({
                type: GET_SINGLE_EMPLOYEES,
                payload: {
                    id: res.result.employeeId,
                    userID: res.result.employeeUserId,
                    name: `${res.result.firstName} ${res.result.lastName}`,
                    firstName: res.result.firstName,
                    lastName: res.result.lastName,
                    checkoutReason: res.result.checkOutReason,
                    allocateLeave: res.result.annualLeaves,
                    email: res.result.email,
                    gender: res.result.gender,
                    password: res.result.password,
                    phone: res.result.contactNumber,
                    address: res.result.addresses,
                    code: res.result.employeeCode,
                    dob: res.result.dateOfBirth,
                    city: res.result.city,
                    department: res.result.departmentName,
                    image: res.result.image,
                    startTime: res.result.startTime,
                    workingHours: res.result.workingHours,
                    isActive: res.result.activeBit,
                    startDate: res.result.startDate,
                    endDate: res.result.endDate,
                    companyId: res.result.companyId,
                    siteId: res.result.siteId,
                    positionName: res.result.positionName,
                    positionId: res.result.positionId,
                    takeImage: res.result.isTakeImage,
                    siteName: res.result.siteName,
                    createAppUser: res.result.createAppUser,
                    activeBit: res.result.activeBit,
                    selfCheckIn: res.result.selfCheckIn,
                    passportDetail: {
                        documentId: res.result?.passportDetail?.documentId,
                        images: res.result?.passportDetail?.imagePath,
                        issueDate: res.result?.passportDetail?.issueDate,
                        expiryDate: res.result?.passportDetail?.expiryDate,
                        nationality: res.result?.passportDetail?.nationality
                    },
                    visaDetail: {
                        documentId: res.result?.visaDetail?.documentId,
                        images: res.result?.visaDetail?.imagePath,
                        issueDate: res.result?.visaDetail?.issueDate,
                        expiryDate: res.result?.visaDetail?.expiryDate,
                        category: res.result?.visaDetail?.category,
                        visaType: res.result?.visaDetail?.visaType,
                        status: res.result?.visaDetail?.status
                    },
                    bankDetail: {
                        bankDetailId: res.result?.bankDetail?.bankDetailId,
                        employeeId: res.result?.bankDetail?.employeeId,
                        bankName: res.result?.bankDetail?.bankName,
                        accountHolderName: res.result?.bankDetail?.accountHolderName,
                        accountNumber: res.result?.bankDetail?.accountNumber,
                        accountType: res.result?.bankDetail?.accountType,
                        country: res.result?.bankDetail?.country,
                        securityCode: res.result?.bankDetail?.securityCode,
                        month: res.result?.bankDetail?.month,
                        address: res.result?.bankDetail?.address,
                        postalCode: res.result?.bankDetail?.postalCode,
                        city: res.result?.bankDetail?.city,
                        salaryDate: res.result?.bankDetail?.salaryDate
                    },
                    educationDetail: res.result?.educationDetail?.map((item) => ({
                        educationId: item.educationId,
                        employeeId: item.employeeId,
                        qualification: item.qualification,
                        degree: item.degree,
                        year: item.year,
                        grade: item.grade,
                        degreeImage: item.degreeImage,
                        imagePath: item.imagePath
                    })),
                    complinceDocuments: res.result?.additionalDocumentDetails?.map((item) => ({
                        documentId: item?.documentId,
                        images: item?.imagePath,
                        issueDate: item?.issueDate,
                        expiryDate: item?.expiryDate,
                        status: item?.status,
                        category: item?.category,
                        notification: item?.notification,
                    })),
                    EUEEANational: res.result?.eueeaNationals,
                    sponsored: res.result?.employeeSponsored,
                    nationality: res.result?.nationality,
                    nino: res.result?.niNo,
                    cv: res.result?.cvPath,
                    ecd: res.result?.emergencyContactDetail
                }
            })
        }
        // else if (res.responseMsg == 'Employee Details Displayed Successfully') {
        //     dispatch({
        //         type: GET_SINGLE_EMPLOYEES,
        //         payload: {}
        //     })
        // }
        else {
            return new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const createEmployee = (data) => async (dispatch, getState) => {



    const formData = new FormData();
    if (data.image) {
        formData.append('Image', data.image);
    }

    data.siteId && formData.append('SiteId', data.siteId);
    data.positionId && formData.append('PositionId', data.positionId);
    data.firstName && formData.append('FirstName', data.firstName);
    data.lastName && formData.append('LastName', data.lastName);
    data.code && formData.append('EmployeeCode', data.code);
    data.startTime && formData.append('StartTime', data.startTime ? moment(data.startTime).format('hh:mm:ss A') : '');
    data.allocateLeave && formData.append('AnnualLeaves', data.allocateLeave);
    data.workingHours && formData.append('WorkingHours', data.workingHours);
    data.takeImage && formData.append('IsTakeImage', data.takeImage);
    data.selfCheckIn && formData.append('SelfCheckIn', data.selfCheckIn)
    data.createAppUser && formData.append('CreateAppUser', data.createAppUser);
    data.dob && formData.append('DateOfBirth', data.dob ? moment(data.dob).format('YYYY-MM-DD') : '')
    data.startDate && formData.append('StartDate', data.startDate ? moment(data.startDate).format('YYYY-MM-DD') : '')
    data.endDate && formData.append('EndDate', data.endDate ? moment(data.endDate).format('YYYY-MM-DD') : '')
    data.sponsored && formData.append('EmployeeSponsored', data.sponsored);
    data.EUEEANational && formData.append('EUEEANational', data.EUEEANational);
    data.email && formData.append('Email', data.email)



    if (Array.isArray(data.cv) && data.cv.length > 0) {
        const cvFile = data.cv[0];
        formData.append('CV', {
            name: cvFile.name,
            uri: cvFile.uri,
            type: cvFile.type,
        });
    }


    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/AddEmployee',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg,
                employeeId: res.result
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}


export const updateEmployee = (data) => async (dispatch, getState) => {

    const formData = new FormData();

    if (data.image) {
        formData.append('Image', data.image);
    }

    // EmployeeDetails
    data.siteId && formData.append('SiteId', data.siteId);
    data.positionId && formData.append('PositionId', data.positionId);
    data.firstName && formData.append('FirstName', data.firstName);
    data.lastName && formData.append('LastName', data.lastName);
    data.code && formData.append('EmployeeCode', data.code);
    data.startTime && formData.append('StartTime', data.startTime ? moment(data.startTime).format('hh:mm:ss A') : '');
    data.allocateLeave && formData.append('AnnualLeaves', data.allocateLeave);
    data.workingHours && formData.append('WorkingHours', data.workingHours);
    data.takeImage && formData.append('IsTakeImage', data.takeImage);
    data.selfCheckIn && formData.append('SelfCheckIn', data.selfCheckIn)
    data.createAppUser && formData.append('CreateAppUser', data.createAppUser);
    data.dob && formData.append('DateOfBirth', data.dob ? moment(data.dob).format('YYYY-MM-DD') : '')
    data.startDate && formData.append('StartDate', data.startDate ? moment(data.startDate).format('YYYY-MM-DD') : '')
    data.endDate && formData.append('EndDate', data.endDate ? moment(data.endDate).format('YYYY-MM-DD') : '')
    data.sponsored && formData.append('EmployeeSponsored', data.sponsored);
    data.EUEEANational && formData.append('EUEEANational', data.EUEEANational);

    // Contact Details
    data.email && formData.append('Email', data.email)
    data.phone && formData.append('ContactNumber', data.phone);
    data.nino && formData.append('NiNo', data.nino);
    data.ecd && formData.append('EmergencyContactDetail', data.ecd);
    data.address && formData.append('Addresses', data.address);
    data.city && formData.append('City', data.city);

    // bankDetails
    if (data.bankDetailId) {
        data.bankDetailId && formData.append('BankDetailId', data.bankDetailId)
    }
    data.bankName && formData.append('BankName', data.bankName)
    data.accountHolderName && formData.append('AccountHolderName', data.accountHolderName)
    data.accountNumber && formData.append('AccountNumber', data.accountNumber)
    data.accountType && formData.append('AccountType', data.accountType)
    data.country && formData.append('Country', data.country)
    data.securityCode && formData.append('SecurityCode', data.securityCode)
    data.salaryDate && formData.append('SalaryDate', data.salaryDate)

    if (data.id) {
        formData.append('EmployeeId', data.id);
    }

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/UpdateEmployee',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    }
    catch (e) {
        console.log()
        throw new Error(e)

    }
}

export const addEmployeeEducation = (data) => async (dispatch, getState) => {

    const formData = new FormData();

    if (data.image) {
        formData.append('DegreeImage', data.image);
    }
    if (data.educationId) {
        formData.append('EducationId', data.educationId)
    }
    data.id && formData.append('EmployeeId', data.id)
    data.qualification && formData.append('Qualification', data.qualification)
    data.degree && formData.append('Degree', data.degree)
    data.grade && formData.append('Grade', data.grade)
    data.year && formData.append('Year', data.year)


    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/EmployeeEducationalDetail',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg,
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const addEmployeePassport = (data) => async (dispatch, getState) => {

    const formData = new FormData();

    data?.images?.forEach((img, index) => {
        const file = {
            uri: img.uri,
            name: img.name,
            type: img.type
        };

        formData.append('Images', file, `Images[${index}]`);
    });


    data.id && formData.append('EmployeeId', data.id);
    data.issueDate && formData.append('IssueDate', data.issueDate ? moment(data.issueDate).format('YYYY-MM-DD') : '');
    data.expiryDate && formData.append('ExpiryDate', data.expiryDate ? moment(data.expiryDate).format('YYYY-MM-DD') : '');
    data.nationality && formData.append('Nationality', data.nationality);

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/EmployeePassportDocuments',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg,
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const addEmployeeVisa = (data) => async (dispatch, getState) => {

    const formData = new FormData()

    data?.images?.forEach((img, index) => {
        const file = {
            uri: img.uri,
            name: img.name,
            type: img.type
        };

        formData.append('Images', file, `Images[${index}]`)
    })


    data.documentId && formData.append('DocumentId', data.documentId)
    data.id && formData.append('EmployeeId', data.id)
    data.category && formData.append('Category', data.category)
    data.visaType && formData.append('VisaType', data.category)
    data.status && formData.append('Status', data.status)
    data.issueDate && formData.append('IssueDate', data.issueDate ? moment(data.issueDate).format('YYYY-MM-DD') : '')
    data.expiryDate && formData.append('ExpiryDate', data.expiryDate ? moment(data.expiryDate).format('YYYY-MM-DD') : '')

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/EmployeeVisaDocuments',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg,
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const addComplinceDocuments = (data) => async (dispatch, getState) => {



    const formData = new FormData()

    if (data.documentId) {
        formData.append('DocumentId', data.documentId)
    }

    data?.images?.forEach((img, index) => {
        const file = {
            uri: img.uri,
            name: img.name,
            type: img.type
        };

        formData.append('Images', file, `Images[${index}]`)
    })

    data?.notification?.forEach((item, index) => {
        formData.append('Notification', item, `Notification[${index}]`)
    })

    data.id && formData.append('EmployeeId', data.id);
    data.category && formData.append('Category', data.category)
    data.issueDate && formData.append('IssueDate', data.issueDate ? moment(data.issueDate).format('YYYY-MM-DD') : '')
    data.expiryDate && formData.append('ExpiryDate', data.expiryDate ? moment(data.expiryDate).format('YYYY-MM-DD') : '')
    data.status && formData.append('Status', data.status)

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/AdditionalDocuments',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg,
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const deleteEmployeeDocuments = (data) => async (dispatch) => {

    const { deleteID, docName } = data
    console.log(data)

    const getType = () => {
        switch (docName) {
            case 'Education':
                dispatch({
                    type: DELETE_EMPLOYEE_EDUCATION,
                    payload: deleteID
                })
            case 'Passport':
                dispatch({
                    type: DELETE_EMPLOYEE_PASSPORT,
                    payload: deleteID
                })
            case 'Bank':
                dispatch({
                    type: DELETE_EMPLOYEE_BANK,
                    payload: deleteID
                })
            case 'Visa':
                dispatch({
                    type: DELETE_EMPLOYEE_VISA,
                    payload: deleteID
                })
            case 'Additional':
                dispatch({
                    type: DELETE_EMPLOYEE_COMPLINCE,
                    payload: deleteID
                })

        }
    }
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Employee/DeleteEmployeeDocument?Id=${deleteID}&Document=${docName}`,
            requireAuth: true,
        })
        if (res.responseType == 1) {
            getType()
        }
        else {
            throw new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const deleteEmployee = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Employee/DeleteEmployee?EmployeeId=${deleteID}`,
            requireAuth: true,
        })
        dispatch({
            type: DELETE_EMPLOYEE,
            payload: deleteID
        })
    }
    catch (e) {
        throw new Error('Error in delete')
    }
}

export const EmployeeStatus = (employeeId) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Employee/EmployeeStatus?EmployeeId=${employeeId}`,
            requireAuth: true,
        })
        if (res.responseMsg == 'Employee status update Successfully') {
            dispatch({
                type: TOGGLE_EMPLOYEE_STATUS
            })
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const complianceDashboard = (data) => async (dispatch) => {
    const { siteId, date, employeeId } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Employee/EmployeeComplianceDashboard`,
            requireAuth: true,
            requestConfig: {
                siteId: siteId,
                todayDate: date,
                employeeId: employeeId
            }
        })
        if (res.responseMsg == 'Employee compliance dashboard data displayed successfully') {
            dispatch({
                type: COMPLIANCE_DASHBOARD,
                payload: res.result
            })
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const employeesWithPendingDetails = (data) => async (dispatch) => {
    const { siteId, userId, employeeId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/TotalPendingEmployeeDetails',
            requireAuth: true,
            requestConfig: {
                siteId: siteId,
                userId: userId,
                employeeId: employeeId,
            }
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const employeesWithDocumentsToBeExpire = (data) => async (dispatch) => {
    const { siteId, userId, employeeId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/DocumentsToBeExpire',
            requireAuth: true,
            requestConfig: {
                siteId: siteId,
                userId: userId,
                employeeId: employeeId,
            }
        })
    } catch (error) {
        throw new Error(error)
    }
}
export const employeesWithExpiredDocuments = (data) => async (dispatch) => {
    const { siteId, userId, employeeId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/DocumentsExpired',
            requireAuth: true,
            requestConfig: {
                siteId: siteId,
                userId: userId,
                employeeId: employeeId,
            }
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const DocumentExpiryInNintyDays = (data) => async (dispatch) => {
    const { siteId, userId, employeeId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/DocumentsExpiredIn90Days',
            requireAuth: true,
            requestConfig: {
                siteId: siteId,
                userId: userId,
                employeeId: employeeId,
            }
        })
    } catch (error) {
        throw new Error(error)
    }
}

/*
  Leaves
*/

export const getLeaveDashboard = (data) => async (dispatch) => {
    const { siteId, date } = data
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: `api/Leave/LeaveChart?SiteId=${siteId}&Date=${date}`,
            requireAuth: true,

        })
        if (res.responseMsg == 'Data Displayed') {
            dispatch({
                type: GET_LEAVES_DASHBOARD,
                payload: {
                    monthlyStats: res.result.monthlyStats?.map((item) => ({
                        month: item.monthName,
                        leaves: item.leaves
                    })),
                    companyStats: res.result.companyStats?.map((item) => ({
                        employeeId: item.employeeId,
                        image: item.imageUrl,
                        name: item.name,
                        siteId: item.siteId,
                        email: item.email,
                        leavesTaken: item.leavesTaken,
                        allocatedLeaves: item.allocatedLeaves
                    }))
                }
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }

}

export const getEmployeeLeavesDashboard = (data) => async (dispatch) => {
    const { siteId, employeeId, year } = data
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: `api/Leave/EmployeeLeaveChart?EmployeeId=${employeeId}&SiteId=${siteId}&Date=${year}`,
            requireAuth: true,

        })
        // console.log(res)
        if (res.responseMsg == 'Data Displayed') {
            dispatch({
                type: EMPLOYEE_LEAVES_DASHBOARD,
                payload: {
                    monthlyStats: res.result?.monthlyStats?.map((item) => ({
                        month: item.monthName,
                        leaves: item.leaves
                    })),
                    employeeLeaveStats: res.result?.employeeLeaveStats?.map((item) => ({
                        fromDate: item.fromDate,
                        toDate: item.toDate,
                        leaveDuration: item.leaveDuration,
                        leaveReason: item.leaveReason
                    })),
                    yearlyLeave: res.result?.employeeLeavesTakens?.map((item) => ({
                        name: item.name,
                        leavesTaken: item.leavesTaken,
                        allocatedLeaves: item.allocatedLeaves
                    }))
                }
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }

}


export const getAllLeaves = (data) => async (dispatch) => {
    const { name, fromDate, toDate, siteId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Leave/EmployeeLeaveList',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                siteId: siteId,
                employee_Name: name
            }
        })
        if (res.responseMsg == 'Employee Leave List Displayed Successfully') {
            dispatch({
                type: GET_ALL_LEAVES,
                payload: res.result?.map((item) => ({
                    id: item.leaveId,
                    name: item.firstName,
                    status: item.leaveStatus,
                    reason: item.leaveReason,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    employeeName: item.firstName,
                    allocateLeaves: item.allocatedLeaves,
                    takenLeaves: item.takenLeaves,
                    leaveTitle: item.leaveTitle,
                    titleId: item.leaveTitleId
                }))
            })
        } else if (res.responseMsg == 'No Leave List to Display') {
            dispatch({
                type: GET_ALL_LEAVES,
                payload: []
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }

}

export const getLeaveTitle = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Leave/LeaveTitleList',
            requireAuth: true,
        })

        dispatch({
            type: GET_LEAVE_TITLES,
            payload: res.result?.map((item) => ({
                title: item.leaveTitle,
                titleId: item.leaveTitleId,
            }))
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const createLeave = (data) => async (dispatch) => {
    const { id, fromDate, toDate, status, titleId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Leave/MarkLeave',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employeeId: id,
                leaveDuration: status,
                leaveReason: '',
                leaveTitleId: titleId
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

/*
 Public holiday
*/

export const getAllHolidays = (data) => async (dispatch) => {
    const { name, fromDate, toDate, siteId } = data
    console.log(data)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Holiday/HolidayList',
            requireAuth: true,
            requestConfig: {
                holidayName: name,
                fromDate: fromDate,
                toDate: toDate,
                siteId: siteId
            }
        })
        if (res.responseMsg == 'Holiday List Displayed Successfully') {
            dispatch({
                type: GET_ALL_HOLIDAYS,
                payload: res.result?.map((item) => ({
                    id: item.holidayId,
                    name: item.holidayName,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    description: item.description
                }))
            })
        } else if (res.responseMsg == 'No Holiday list to Display') {
            dispatch({
                type: GET_ALL_HOLIDAYS,
                payload: []
            })
        }
        else {
            return new Error('Network Error')
        }

    } catch (error) {
        throw new Error(error)
    }

}


export const createPublicHolidays = (data) => async (dispatch) => {
    const { name, fromDate, toDate, description } = data

    console.log(data)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Holiday/AddHoliday',
            requireAuth: true,
            requestConfig: {
                holidayId: null,
                holidayName: name,
                fromDate: fromDate,
                toDate: toDate,
                description: description
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }

}

export const updatePublicHolidays = (data) => async (dispatch) => {

    const { name, fromDate, toDate, id, description } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Holiday/UpdateHoliday',
            requireAuth: true,
            requestConfig: {
                holidayId: id ? id : null,
                holidayName: name,
                fromDate: fromDate,
                toDate: toDate,
                description: description
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }

}

export const deletePublicHoliday = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Holiday/DeleteHoliday?HolidayId=${deleteID}`,
            requireAuth: true,
        })
        if (res.responseMsg == 'Holiday Deleted Successfully') {
            dispatch({
                type: DELETE_HOLIDAY,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error('Error in delete')
    }
}

/* 
  Loan
*/
export const getAllLoans = (data) => async (dispatch) => {
    const { name, loanDate, siteId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/LoanList',
            requrieAuth: true,
            requestConfig: {
                employeeName: name,
                loanDate: loanDate,
                siteId: siteId
            }
        })
        if (res.responseMsg == 'Loan list Displayed Successfully') {
            dispatch({
                type: GET_ALL_LOANS,
                payload: res.result?.map((item) => ({
                    loanId: item.loanId,
                    name: item.firstName,
                    id: item.employeeId,
                    amount: item.loanAmount,
                    remaingAmount: item.outstandingAmount,
                    paidAmount: item.paidAmount,
                    tenure: item.loanReason,
                    titleId: item.loanTitleId,
                    title: item.loanTitle,
                    status: item.loanStatus,
                    date: item.loanDate
                }))
            })
        } else if (res.responseMsg == 'No Loan list to Display') {
            dispatch({
                type: GET_ALL_LOANS,
                payload: []
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const createLoan = (data) => async (dispatch) => {

    const { id, amount, titleId, tenure, status } = data


    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/AddLoan',
            requireAuth: true,
            requestConfig: {
                employeeId: id,
                loanAmount: amount,
                loanDate: new Date(),
                loanTitleId: titleId,
                loanReason: tenure,
                loanStatus: status,
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const updateLoan = (data) => async (dispatch) => {

    const { loanId, id, amount, titleId, date, tenure, status } = data


    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/UpdateLoan',
            requireAuth: true,
            requestConfig: {
                loanId: loanId,
                employeeId: id,
                loanAmount: amount,
                loanDate: date,
                loanTitleId: titleId,
                loanReason: tenure,
                loanStatus: status,
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getLoanDetails = (data) => async (dispatch) => {

    const { id } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Loan/LoanDetailList?LoanId=${id}`,
            requireAuth: true,
        })
        if (res.responseMsg == 'Loan Detail List Displayed Successfully') {
            dispatch({
                type: REPAY_LOAN,
                payload: res.result?.map((item) => ({
                    amount: item.repayAmount,
                    date: item.repayDate,
                    paid: item.payAmount,
                    remaining: item.outstandingAmount,
                    tenure: item.loanReason
                }))
            })
        } else {
            throw new Error('Network Error')
        }

    } catch (error) {
        throw new Error(error)
    }
}

export const getLoanTitle = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/LoanTitleList',
            requireAuth: true,
        })

        dispatch({
            type: GET_LOAN_TITLES,
            payload: res.result?.map((item) => ({
                title: item.loanTitle,
                titleId: item.loanTitleId,
            }))
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const repayLoan = (data) => async (dispatch) => {

    const { id, amount, fromDate } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/LoanPayment',
            requireAuth: true,
            requestConfig: {
                loanId: id,
                payAmount: amount,
                repayDate: fromDate
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}



export const deleteLoan = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Loan/DeleteLoan?LoanId=${deleteID}`,
            requireAuth: true
        })
        dispatch({
            type: DELETE_LOAN,
            payload: deleteID
        })

    } catch (error) {
        throw new Error('Error in loan list')
    }
}

/*
  Sites
*/
export const getAllSites = (data) => async (dispatch) => {
    const { name, fromDate, toDate } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Site/SiteList',
            requireAuth: true,
            requestConfig: {
                siteName: name,
                fromDate: fromDate,
                toDate: toDate
            }
        })
        if (res.responseMsg == 'Site List Displayed Successfully') {
            dispatch({
                type: GET_ALL_SITES,
                payload: res.result?.map((item) => ({
                    logo: item.siteLogo,
                    siteId: item.siteId,
                    name: item.siteName,
                    code: item.siteCode,
                    note: item.siteNote,
                    email: item.siteEmail,
                    address: item.siteAddress1,
                    city: item.siteCity,
                    postalCode: item.siteZipPostalCode,
                    phone: item.sitePhone,
                    country: item.siteCountry,
                    date: item.createdDate,
                    latitude: item.siteLatitude,
                    longitude: item.siteLongitude,
                    ipAddress: item.ipAddress,
                    useIp: item.useIpAddress,
                    useLocation: item.useRadius
                }))
            })
        } else if (res.responseMsg == 'No Site List to Display') {
            dispatch({
                type: GET_ALL_SITES,
                payload: []
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

// FormApi
export const createSite = (data) => async (dispatch) => {

    const formData = new FormData()
    data.logo && formData.append('SiteImage', data.logo)
    data.userId && formData.append('UserId', data.userId)
    data.name && formData.append('SiteName', data.name)
    data.code && formData.append('SiteCode', data.code)
    data.note && formData.append('SiteNote', data.note)
    data.email && formData.append('SiteEmail', data.email)
    data.address && formData.append('SiteAddress1', data.address)
    data.city && formData.append('SiteCity', data.city)
    data.postalCode && formData.append('SiteZipPostalCode', data.postalCode)
    data.phone && formData.append('SitePhone', data.phone)
    data.country && formData.append('SiteCountry', data.country)
    data.latitude && formData.append('SiteLongitude', data.latitude)
    data.longitude && formData.append('SiteLatitude', data.longitude)
    data.ipAddress && formData.append('IpAddress', data.ipAddress)
    data.useIp && formData.append('UseIpAddress', data.useIp)
    data.useLocation && formData.append('UseRadius', data.useLocation)

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Site/AddSite',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData,
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}
// Formapi
export const updateSite = (data) => async (dispatch) => {

    const formData = new FormData()
    data.logo && formData.append('SiteImage', data.logo)
    data.name && formData.append('SiteName', data.name)
    data.code && formData.append('SiteCode', data.code)
    data.note && formData.append('SiteNote', data.note)
    data.email && formData.append('SiteEmail', data.email)
    data.address && formData.append('SiteAddress1', data.address)
    data.city && formData.append('SiteCity', data.city)
    data.postalCode && formData.append('SiteZipPostalCode', data.postalCode)
    data.phone && formData.append('SitePhone', data.phone)
    data.country && formData.append('SiteCountry', data.country)
    data.siteId && formData.append('SiteId', data.siteId)
    data.latitude && formData.append('SiteLongitude', data.latitude)
    data.longitude && formData.append('SiteLatitude', data.longitude)
    data.ipAddress && formData.append('IpAddress', data.ipAddress)
    data.useIp && formData.append('UseIpAddress', data.useIp)
    data.useLocation && formData.append('UseRadius', data.useLocation)

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Site/UpdateSite',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData,
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteSite = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Site/DeleteSite?SiteId=${deleteID}`,
            requireAuth: true,
        })
        if (res.responseMsg == 'Site Deleted Successfully') {
            dispatch({
                type: DELETE_SITE,
                payload: deleteID
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

/* 
  Users
*/

export const getAllUsers = (data) => async (dispatch, getState) => {
    const { firstName, fromDate, toDate, siteId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/User/UserList',
            requireAuth: true,
            requestConfig: {
                user_Name: firstName,
                fromDate: fromDate,
                toDate: toDate,
                siteId: siteId
            }
        })
        if (res.responseMsg == 'User List Displayed Successfully') {

            dispatch({
                type: GET_ALL_USERS,
                payload: res.result?.map((item) => ({
                    id: item.userId,
                    firstName: item.userFirstName,
                    lastName: item.userLastName,
                    name: `${item.userFirstName} ${item.userLastName}`,
                    email: item.userEmail,
                    password: item.userPassword,
                    description: item.userDescription,
                    phone: item.userPhone,
                    roleId: item.roleId,
                    postalCode: item.userZipPostalCode,
                    country: item.userCountry,
                    gender: item.genderId,
                    city: item.userCity,
                    image: item.photo,
                    siteId: item.siteIds.map(item => item),
                    DOC: item.createdDate
                }))
            })

        } else if (res.responseMsg = 'No User List to Display') {
            dispatch({
                type: GET_ALL_USERS,
                payload: []
            })
        } else {
            return new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const createUser = (data) => async (dispatch, getState) => {

    const siteId = Array.isArray(data.siteId) ? data.siteId : [data.siteId];

    const formData = new FormData()
    if (data.image) {
        formData.append('file', data.image)
    }
    data.firstName && formData.append('UserFirstName', data.firstName)
    data.lastName && formData.append('UserLastName', data.lastName)
    data.description && formData.append('UserDescription', data.description)
    data.email && formData.append('UserEmail', data.email)
    data.siteId && formData.append('SiteId', siteId)
    data.gender && formData.append('GenderId', data.gender)
    data.roleId && formData.append('RoleId', data.roleId)
    data.code && formData.append('Code', data.code)
    data.phone && formData.append('UserPhone', data.phone)
    data.address && formData.append('UserAddress1', data.address)
    data.city && formData.append('UserCity', data.city)
    data.country && formData.append('UserCountry', data.country)
    data.postalCode && formData.append('UserZipPostalCode', data.postalCode)
    data.password && formData.append('UserPassword', data.password)

    console.log(formData.siteId)

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/User/AddUser',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}


export const updateUser = (data) => async (dispatch, getState) => {


    const siteId = Array.isArray(data.siteId) ? data.siteId : [data.siteId];

    const formData = new FormData()
    if (data.image) {
        formData.append('file', data.image)
    }

    data.id && formData.append('UserId', data.id)
    data.firstName && formData.append('UserFirstName', data.firstName)
    data.lastName && formData.append('UserLastName', data.lastName)
    data.description && formData.append('UserDescription', data.description)
    data.email && formData.append('UserEmail', data.email)
    data.siteId && formData.append('SiteId', siteId)
    data.gender && formData.append('GenderId', data.gender)
    data.roleId && formData.append('RoleId', data.roleId)
    data.code && formData.append('Code', data.code)
    data.phone && formData.append('UserPhone', data.phone)
    data.address && formData.append('UserAddress1', data.address)
    data.city && formData.append('UserCity', data.city)
    data.country && formData.append('UserCountry', data.country)
    data.postalCode && formData.append('UserZipPostalCode', data.postalCode)
    data.password && formData.append('UserPassword', data.password)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/User/UpdateUser',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    }

    catch (e) {
        throw new Error(e)
    }
}

export const deleteUser = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/User/DeleteUser?UserId=${deleteID}`
        })
        dispatch({
            type: DELETE_USER,
            payload: deleteID
        })
    }
    catch (e) {
        throw new Error(e)
    }
}

/* 
  Announcement
*/
export const getAllAnnouncement = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Announcement/GetAllAnnouncements',
            requireAuth: true,
        })
        if (res.responseMsg == 'Announcement List Displayed Successfully') {
            dispatch({
                type: GET_ALL_ANNOUNCEMENT,
                payload: res.result?.map((item, index) => (
                    {
                        id: item.announcementId,
                        title: item.announcementTitle,
                        description: item.announcementDescription,
                        isSend: item.isSend,
                        status: item.status
                    }
                ))
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {

        throw new Error(error)
    }
}

export const createAnnouncement = (data) => async (dispatch) => {
    const { id, title, description } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Announcement/CreateAnnouncement',
            requireAuth: true,
            requestConfig: {
                announcementId: id ? id : 0,
                announcementTitle: title,
                announcementDescription: description
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        return new Error('Network Error');
    }
}

export const updateAnnouncement = (data) => async (dispatch) => {
    const { id, title, description } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Announcement/UpdateAnnouncement',
            requireAuth: true,
            requestConfig: {
                announcementId: id ? id : 0,
                announcementTitle: title,
                announcementDescription: description
            }
        });
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }

    } catch (error) {
        return new Error('Network Error');
    }
}

export const deleteAnnouncement = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Announcement/DeleteAnnouncement?AnnouncementId=${deleteID}`,
        })
        if (res.responseMsg == 'Announcement Deleted Successfully') {
            dispatch({
                type: DELETE_ANNOUNCEMENT,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error('Network Error or other error occurred')
    }
}

export const getAnnouncementNotification = () => async () => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Announcement/GetAnnouncementNotification',
        })
    } catch (error) {
        throw new Error('Network Error or other error occurred')
    }
}

// Task

export const getAllTask = (data) => async (dispatch) => {
    const { siteId, id, fromDate, toDate, status } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Task/TaskList',
            requireAuth: true,
            requestConfig: {
                employeeId: id,
                siteId: siteId,
                status: status,
                toDate: toDate,
                fromDate: fromDate,
            }
        })
        // console.log(res.result.tasklst[0])
        if (res.responseMsg == 'Task List Displayed Successfully') {
            dispatch({
                type: GET_ALL_TASKS,
                payload: {
                    chart: res.result.pieChart,
                    list: res.result.tasklst?.map((item) => ({
                        taskId: item.taskId,
                        name: item.taskName,
                        description: item.description,
                        status: item.status,
                        toDate: item.toDate
                    }))
                }

            })
        }
        else {
            return new Error('Network Error')
        }

    } catch (error) {
        return new Error(error)
    }
}
export const taskDetails = (taskId) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: `api/Task/TaskDetailList?TaskId=${taskId}`,
            requireAuth: true
        })
        if (res.responseMsg == 'Task Detail Displayed Successfully') {
            dispatch({
                type: TASK_DETAILS,
                payload: {
                    fromDate: res.result.fromDate,
                    toDate: res.result.toDate,
                    status: res.result.status,
                    taskId: res.result.taskId,
                    name: res.result.taskName,
                    description: res.result.description,
                    employeeDetail: res.result.employeeDetail.map((item) => ({
                        id: item.employeeId,
                        name: item.firstName,
                        status: item.status
                    })),
                    id: res.result.employeeDetail.map((item) => (item.employeeId)),
                    document: res.result.attachments.map((item) => ({
                        name: item.name,
                        uri: item.uri,
                        type: item.extension
                    }))
                }
            })

        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getTaskChart = (data) => async (dispatch) => {
    const { siteId, fromDate, toDate } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Task/TaskChart',
            requireAuth: true,
            requestConfig: {
                siteId: siteId,
                toDate: toDate,
                fromDate: fromDate,
            }
        })
        if (res.responseMsg == 'Task Detail Displayed Successfully') {
            dispatch({
                type: GET_TASK_CHART,
                payload: {
                    chart: res.result
                }

            })
        }
        else {
            return new Error('Network Error')
        }

    } catch (error) {
        return new Error(error)
    }
}

export const createTask = (data) => async (dispatch) => {


    const formData = new FormData()
    data.name && formData.append('TaskName', data.name);
    data.id && formData.append('EmployeeId', data.id);
    data.description && formData.append('Description', data.description);
    // data.fromDate && formData.append('FromDate', moment(data.fromDate).format('DD-MM-YYYY'));
    // data.toDate && formData.append('ToDate', moment(data.toDate).format('DD-MM-YYYY'));
    data.fromDate && formData.append('FDate', new Date(data.fromDate).toString());
    data.toDate && formData.append('TDate', new Date(data.toDate).toString());
    data?.document?.forEach((doc, index) => {
        const file = {
            uri: doc.uri,
            name: doc.name,
            type: doc.type
        };

        formData.append('Documents', file, `Documents[${index}].${doc.type.split('/')[1]}`);
    });

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Task/AddTask',
            instance: formDataInstance,
            requireAuth: true,
            requestConfig: formData
        });
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        return new Error('Network Error');
    }
}

// formData
export const updateTask = (data) => async (dispatch) => {

    employeeIds = data?.id.map((item) => parseInt(item, 10))


    const formData = new FormData()

    data.taskId && formData.append('TaskId', data.taskId)
    data.name && formData.append('TaskName', data.name);
    data.id && formData.append('EmployeeId', employeeIds);
    data.description && formData.append('Description', data.description);
    data.fromDate && formData.append('FDate', new Date(data.fromDate).toString());
    data.toDate && formData.append('TDate', new Date(data.toDate).toString());
    data?.document?.forEach((doc, index) => {
        console.log(doc)
        const file = {
            uri: doc.uri,
            name: doc.name,
            type: doc.type
        };

        formData.append('Documents', file, `Documents[${index}].${doc.type.split('/')[1]}`);
    })

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Task/UpdateTask',
            instance: formDataInstance,
            requireAuth: true,
            requestConfig: formData,
            isFormData: true,
        });

        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }

    } catch (error) {
        return new Error(error);
    }
}


export const deleteTask = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Task/DeleteTask?TaskId=${deleteID}`,
            requireAuth: true
        })
        if (res.responseMsg == 'Task Deleted Successfully') {
            dispatch({
                type: DELETE_TASK,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }

    } catch (error) {
        throw new Error(error)
    }
}

/*
  Positions
*/



export const getAllPositions = (data) => async (dispatch) => {

    const { name, positionId } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Position/GetPositionsList',
            requireAuth: true,
            requestConfig: {
                positionId: positionId,
                positionName: name
            }
        })
        if (res.responseMsg == 'Position List Displayed Successfully') {
            dispatch({
                type: GET_ALL_POSITION,
                payload: res.result?.map((item, index) => (
                    {
                        industryId: item.industryId,
                        positionId: item.positionId,
                        name: item.positionName,
                        description: item.positionDescription,
                        DOC: item.createdDate
                    }
                ))
            })
        } else if (res.responseMsg == ' No Position List to Display') {
            dispatch({
                type: GET_ALL_POSITION,
                payload: []
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const createPosition = (data) => async (dispatch) => {
    const { name, description } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Position/AddPosition',
            requireAuth: true,
            requestConfig: {
                positionName: name,
                positionDescription: description
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        return new Error('Network Error');
    }
}

export const updatePosition = (data) => async (dispatch) => {
    const { positionId, name, description } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Position/UpdatePosition',
            requireAuth: true,
            requestConfig: {
                positionId: positionId,
                positionName: name,
                positionDescription: description
            }
        });
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }

    } catch (error) {
        return new Error('Network Error');
    }
}

export const deletePosition = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Position/DeletePosition?PositionId=${deleteID}`,
        })
        if (res.responseMsg == 'Position Deleted Successfully') {
            dispatch({
                type: DELETE_POSITION,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}


/*
  Industry
*/

export const getAllIndustries = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Position/IndustryList',
            requireAuth: true,
        })
        if (res.responseMsg == 'Industry List Displayed Successfully') {
            dispatch({
                type: GET_ALL_INDUSTRY,
                payload: res.result?.map((item, index) => (
                    {
                        id: item.industryId,
                        name: item.industryName,
                    }
                ))
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

/*
  Reports
*/

export const getCompanyReports = (data) => async (dispatch) => {
    const { companyId, siteId, employeeId, fromDate, toDate, type } = data
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Dashboard/DashboardStatsApi',
            requireAuth: true,
            requestConfig: {
                fileType: type,
                employeeId: employeeId,
                fromDate: fromDate,
                toDate: toDate,
                siteId: siteId,
                companyId: companyId,
            }
        })
        if (res.responseMsg == '') {

        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}



/*
  Role
*/

export const getAllRoles = (data) => async (dispatch) => {
    const { roleId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: `api/Role/RoleList?RoleId=${roleId}`,
            requireAuth: true,
        })
        if (res.responseMsg == 'Role List Displayed Successfully') {
            dispatch({
                type: GET_ALL_ROLES,
                payload: res.result.map((item) => ({
                    roleId: item.roleId,
                    companyId: item.companyId,
                    name: item.roleName,
                    description: item.roleDescription,
                    roleCode: item.roleCode,
                    //Leave
                    canViewLeave: item.viewLeaveModule,
                    addLeave: item.canAddLeave,
                    updateLeave: item.canUpdateLeave,
                    deleteLeave: item.canDeleteLeave,
                    //loan
                    canViewLoan: item.viewLoanModule,
                    addLoan: item.canAddLoan,
                    updateLoan: item.canUpdateLoan,
                    deleteLoan: item.canDeleteLoan,
                    //employee
                    canViewEmployee: item.viewEmployeeModule,
                    addEmployee: item.canAddEmployee,
                    updateEmployee: item.canUpdateEmployee,
                    deleteEmployee: item.canDeleteEmployee,
                    //Holiday
                    canViewHoliday: item.viewOfficeHolidayModule,
                    addHoliday: item.canAddOfficeHoliday,
                    updateHoliday: item.canUpdateOfficeHoliday,
                    deleteHoliday: item.canDeleteOfficeHoliday,
                    //role
                    canViewRole: item.viewRoleModule,
                    addRole: item.canAddRole,
                    updateRole: item.canUpdateRole,
                    deleteRole: item.canDeleteRole,
                    //user
                    canViewUser: item.viewUserModule,
                    addUser: item.canAddUser,
                    updateUser: item.canUpdateUser,
                    deleteUser: item.canDeleteUser,
                    //site
                    canViewSite: item.viewSiteModule,
                    addSite: item.canAddSite,
                    updateSite: item.canUpdateSite,
                    deleteSite: item.canDeleteSite,
                    //attendance
                    canViewAttendance: item.viewAttendanceModule,
                    //company
                    canViewCompany: item.viewCompanyModule,
                    addCompany: item.canAddCompany,
                    updateCompany: item.canUpdateCompany,
                    deleteCompany: item.canDeleteCompany,
                    //position
                    canViewPosition: item.viewPositionModule,
                    addPosition: item.canAddPosition,
                    updatePosition: item.canUpdatePosition,
                    deletePosition: item.canDeletePosition,

                    //Announcement
                    canViewAnnouncement: item.viewAnnouncementModule,
                    addAnnouncement: item.canAddAnnouncement,
                    updateAnnouncement: item.canUpdateAnnouncement,
                    deleteAnnouncement: item.canDeleteAnnouncement,

                    //Role
                    canViewRole: item.viewRoleModule,
                    addRole: item.canAddRole,
                    updateRole: item.canUpdateRole,
                    deleteRole: item.canDeleteRole,
                    // Task
                    canViewTask: item.viewTaskModule,
                    addTask: item.canAddTask,
                    updateTask: item.canUpdateTask,
                    deleteTask: item.canDeleteTask,

                    // mark attendance
                    canViewMarkAttendance: item.viewCheckInCheckOutModule,

                    //site
                    isMultiSite: item.isMultiSite,
                    isSingleSite: item.isSingleSite,

                    // Schedule
                    canViewSchedule: item.viewScheduleModule,
                    addSchedule: item.canAddSchedule,
                    updateSchedule: item.canUpdateSchedule,
                    deleteSchedule: item.canDeleteSchedule,


                }))
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const createRole = (data) => async (dispatch) => {
    const {
        name, description, roleCode,
        canViewLeave, canViewAttendance, canViewEmployee,
        canViewLoan, canViewHoliday, addLeave, updateLeave, deleteLeave,
        addEmployee, updateEmployee, deleteEmployee, addHoliday, updateHoliday, deleteHoliday,
        addUser, updateUser, deleteUser, addSite, updateSite, deleteSite, addCompany, updateCompany, deleteCompany,
        isSingleSite, isMultiSite, addPosition, updatePosition, deletePosition, canViewUser, canViewSite, canViewCompany,
        canViewPosition, canViewMarkAttendance, addLoan, updateLoan, deleteLoan, canViewRole, addRole, updateRole, deleteRole, canViewAnnouncement,
        updateAnnouncement, addAnnouncement, deleteAnnouncement, canViewTask, addTask, updateTask, deleteTask, canViewSchedule, addSchedule, updateSchedule, deleteSchedule
    } = data




    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Role/AddRole`,
            requireAuth: true,
            requestConfig: {
                roleName: name,
                roleDescription: description,
                roleCode: roleCode,
                viewLeaveModule: canViewLeave,
                viewLoanModule: canViewLoan,
                viewEmployeeModule: canViewEmployee,
                viewOfficeHolidayModule: canViewHoliday,
                canAddOfficeHoliday: addHoliday,
                canUpdateOfficeHoliday: updateHoliday,
                canDeleteOfficeHoliday: deleteHoliday,
                viewRoleModule: canViewRole,
                viewUserModule: canViewUser,
                viewSiteModule: canViewSite,
                viewAttendanceModule: canViewAttendance,
                viewCompanyModule: canViewCompany,
                viewPositionModule: canViewPosition,
                viewCheckInCheckOutModule: canViewMarkAttendance,
                canAddCompany: addCompany,
                canUpdateCompany: updateCompany,
                canDeleteCompany: deleteCompany,
                canAddEmployee: addEmployee,
                canUpdateEmployee: updateEmployee,
                canDeleteEmployee: deleteEmployee,
                canAddLeave: addLeave,
                canUpdateLeave: updateLeave,
                canDeleteLeave: deleteLeave,
                canAddLoan: addLoan,
                canUpdateLoan: updateLoan,
                canDeleteLoan: deleteLoan,
                canAddOfficeHoliday: addHoliday,
                canUpdateHoliday: updateHoliday,
                canDeleteHoliday: deleteHoliday,
                canAddUser: addUser,
                canUpdateUser: updateUser,
                canDeleteUser: deleteUser,
                canAddPosition: addPosition,
                canUpdatePosition: updatePosition,
                canDeletePosition: deletePosition,
                canAddSite: addSite,
                canUpdateSite: updateSite,
                canDeleteSite: deleteSite,
                canAddCompany: addCompany,
                canUpdateCompany: updateCompany,
                canDeleteCompany: deleteCompany,
                isSingleSite: isSingleSite,
                isMultiSite: isMultiSite,
                canAddRole: addRole,
                canUpdateRole: updateRole,
                canDeleteRole: deleteRole,
                viewAnnouncementModule: canViewAnnouncement,
                canAddAnnouncement: addAnnouncement,
                canUpdateAnnouncement: updateAnnouncement,
                canDeleteAnnouncement: deleteAnnouncement,
                canAddRole: addRole,
                canUpdateRole: updateRole,
                canDeleteRole: deleteRole,
                viewTaskModule: canViewTask,
                canAddTask: addTask,
                canUpdateTask: updateTask,
                canDeleteTask: deleteTask,
                viewScheduleModule: canViewSchedule,
                canAddSchedule: addSchedule,
                canUpdateSchedule: updateSchedule,
                canDeleteSchedule: deleteSchedule
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const updateRole = (data) => async (dispatch) => {
    const {
        roleId, name, description, roleCode,
        canViewLeave, canViewAttendance, canViewEmployee,
        canViewLoan, canViewHoliday, addLeave, updateLeave, deleteLeave,
        addEmployee, updateEmployee, deleteEmployee, addHoliday, updateHoliday, deleteHoliday,
        addUser, updateUser, deleteUser, addSite, updateSite, deleteSite, addCompany, updateCompany, deleteCompany,
        isSingleSite, isMultiSite, addPosition, updatePosition, deletePosition, canViewUser, canViewSite, canViewCompany,
        canViewPosition, canViewMarkAttendance, addLoan, updateLoan, deleteLoan, canViewRole, addRole, updateRole, deleteRole,
        canViewAnnouncement, updateAnnouncement, addAnnouncement, deleteAnnouncement, canViewTask, addTask, updateTask, deleteTask,
        canViewSchedule, addSchedule, updateSchedule, deleteSchedule
    } = data


    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Role/UpdateRole`,
            requireAuth: true,
            requestConfig: {
                roleId: roleId,
                roleName: name,
                roleDescription: description,
                roleCode: roleCode,
                viewLeaveModule: canViewLeave,
                viewLoanModule: canViewLoan,
                viewEmployeeModule: canViewEmployee,
                viewOfficeHolidayModule: canViewHoliday,
                canAddOfficeHoliday: addHoliday,
                canUpdateOfficeHoliday: updateHoliday,
                canDeleteOfficeHoliday: deleteHoliday,
                viewRoleModule: canViewRole,
                viewUserModule: canViewUser,
                viewSiteModule: canViewSite,
                viewAttendanceModule: canViewAttendance,
                viewCompanyModule: canViewCompany,
                viewPositionModule: canViewPosition,
                viewCheckInCheckOutModule: canViewMarkAttendance,
                canAddCompany: addCompany,
                canUpdateCompany: updateCompany,
                canDeleteCompany: deleteCompany,
                canAddEmployee: addEmployee,
                canUpdateEmployee: updateEmployee,
                canDeleteEmployee: deleteEmployee,
                canAddLeave: addLeave,
                canUpdateLeave: updateLeave,
                canDeleteLeave: deleteLeave,
                canAddLoan: addLoan,
                canUpdateLoan: updateLoan,
                canDeleteLoan: deleteLoan,
                canAddOfficeHoliday: addHoliday,
                canUpdateHoliday: updateHoliday,
                canDeleteHoliday: deleteHoliday,
                canAddUser: addUser,
                canUpdateUser: updateUser,
                canDeleteUser: deleteUser,
                canAddPosition: addPosition,
                canUpdatePosition: updatePosition,
                canDeletePosition: deletePosition,
                canAddSite: addSite,
                canUpdateSite: updateSite,
                canDeleteSite: deleteSite,
                canAddCompany: addCompany,
                canUpdateCompany: updateCompany,
                canDeleteCompany: deleteCompany,
                isSingleSite: isSingleSite,
                isMultiSite: isMultiSite,
                canAddRole: addRole,
                canUpdateRole: updateRole,
                canDeleteRole: deleteRole,
                viewAnnouncementModule: canViewAnnouncement,
                canAddAnnouncement: addAnnouncement,
                canUpdateAnnouncement: updateAnnouncement,
                canDeleteAnnouncement: deleteAnnouncement,
                canAddRole: addRole,
                canUpdateRole: updateRole,
                canDeleteRole: deleteRole,
                viewTaskModule: canViewTask,
                canAddTask: addTask,
                canUpdateTask: updateTask,
                canDeleteTask: deleteTask,
                viewScheduleModule: canViewSchedule,
                canAddSchedule: addSchedule,
                canUpdateSchedule: updateSchedule,
                canDeleteSchedule: deleteSchedule
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }

    } catch (error) {
        throw new Error(error)
    }
}

export const deleteRole = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Role/DeleteRole?RoleId=${deleteID}`,
        })
        if (res.responseMsg == 'Role Deleted Successfully') {
            dispatch({
                type: DELETE_ROLES,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}



export const setLoginCerdentionals = (data) => async (dispatch) => {
    dispatch({
        type: LOGINDETAILS,
        payload: data
    })

}

export const clearState = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CLEAR_ALL_DATA,
        })
    } catch (error) {
        throw new Error(error)
    }
}

/**
 *  Shift Verse
 */


// Shift

export const createShift = (data) => async (dispatch) => {

    const { id, repeatWeek, startTime, endTime, shiftDate, shiftStatus, unpaidBreak, positionId, shiftNotes, saveAsSchedule, siteId, numberOfShifts, scheduleId } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Shift/AddShift`,
            requireAuth: true,
            requestConfig: {
                employeeId: id,
                repeatWeek: repeatWeek,
                start: new Date(startTime).toString(),
                end: new Date(endTime).toString(),
                shiftDate: shiftDate,
                unpaidBreak: unpaidBreak,
                positionId: positionId,
                shiftNotes: shiftNotes,
                shiftStatus: shiftStatus,
                saveAsSchedule: saveAsSchedule,
                siteId: siteId,
                scheduleId: scheduleId,
                noOfShiftsAllowed: numberOfShifts,
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const updateShift = (data) => async (dispatch) => {

    const { shiftId, id, repeatWeek, startTime, endTime, shiftDate, shiftStatus, unpaidBreak, positionId, shiftNotes, saveAsSchedule } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Shift/AddShift`,
            requireAuth: true,
            requestConfig: {
                shiftId, shiftId,
                employeeId: id,
                repeatWeek: repeatWeek,
                startTime: startTime,
                endTime: endTime,
                shiftDate: shiftDate,
                unpaidBreak: unpaidBreak,
                positionId: positionId,
                shiftNotes: shiftNotes,
                shiftStatus: shiftStatus,
                saveAsSchedule: saveAsSchedule
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getAllShifts = (data) => async (dispatch) => {
    const { siteId, employeeId, scheduleId, positionId, shiftStatus } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Shift/ShiftList',
            requireAuth: true,
            requestConfig: {
                siteId: siteId,
                employeeId: employeeId,
                scheduleId: scheduleId,
                positionId: positionId,
                shiftStatus: shiftStatus
            }
        })
        if (res.responseType == 1) {
            const mappedShifts = res.result.map((item) => ({
                shiftId: item.shiftId,
                repeatWeek: item.repeatWeek,
                employeeName: item.employeeName,
                employeeId: item.employeeId,
                startTime: item.startTime,
                endTime: item.endTime,
                shiftDate: item.shiftDate,
                unpaidBreak: item.unpaidBreak,
                positionId: item.positionId,
                shiftNotes: item.shiftNotes,
                shiftStatus: item.shiftStatus,
                saveAsSchedule: item.saveAsSchedule,
                scheduleName: item.scheduleName,
                numberOfShifts: item.noOfShiftsAllowed
            }))
            if (shiftStatus == 'All Shift') {
                dispatch({
                    type: GET_ALL_SHIFTS,
                    payload: mappedShifts
                })

            }
            if (shiftStatus == 'Open Shift') {
                dispatch({
                    type: GET_OPEN_SHIFT,
                    payload: mappedShifts
                })
            }
            if (shiftStatus == 'My Shift') {
                dispatch({
                    type: GET_MY_SHIFTS,
                    payload: mappedShifts
                })
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const ShiftDecision = (data) => async (dispatch) => {

    const { shiftId, status } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Shift/ShiftDecision',
            requestConfig: {
                shiftId: shiftId,
                shiftStatus: status
            }
        })
        console.log(res)

        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        }
        else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}



// Requets

export const getRequestOffList = (data) => async (dispatch) => {
    const {
        timeOffType,
        employeeId,
        status } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Shift/AdminTimeOffRequestList',
            requireAuth: true,
            requestConfig: {
                timeOffType: 0,
                employeeId: 0,
                status: ''
            }
        })
        if (res.responseMsg == 'List Displayed Successfully') {
            dispatch({
                type: GET_ALL_OFF_Time_REQUESTS,
                payload: res.result.map((item) => ({
                    userId: item.userId,
                    leaveId: item.leaveId,
                    id: item.employeeId,
                    typeId: item.type,
                    allDay: item.allDay,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    shiftDate: item.shiftDate,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    message: item.message,
                    employeeName: item.employeeName,
                    leaveType: item.leaveType,
                    image: item.image,
                    status: item.status,
                }))
            })
        } else {
            dispatch({
                type: GET_ALL_OFF_Time_REQUESTS,
                payload: []
            })
        }

    } catch (e) {
        throw new Error(e)
    }
}

export const getRequestShiftList = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Shift/TakeShiftList',
        })
        if (res.responseType == 1) {
            console.log(res.result.filter((item) => item.status == 'Drop Shift').map((item) => item), 'drop Shift')
            dispatch({
                type: GET_ALL_SHIFT_REQUESTS,
                payload: res.result.filter((item) => item.status == 'Drop Shift').map((item) => ({
                    shiftId: item.shiftId,
                    employeeName: item.employeeName,
                    employeeId: item.employeeId,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    shiftDate: item.shiftDate,
                    scheduleId: item.scheduleId,
                    scheduleName: item.scheduleName
                }))
            })
        } else if (res.responseType == 2) {
            dispatch({
                type: GET_ALL_SHIFT_REQUESTS,
                payload: [],
            })
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getRequestOpenShiftList = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Shift/TakeShiftList',
        })
        if (res.responseType == 1) {
            console.log(res)
            dispatch({
                type: GET_ALL_OPEN_SHIFT_REQUESTS,
                payload: res.result.filter((item) => item.status == 'Take Shfit').map((item) => ({
                    shiftId: item.shiftId,
                    employeeName: item.employeeName,
                    employeeId: item.employeeId,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    shiftDate: item.shiftDate,
                    scheduleId: item.scheduleId,
                    scheduleName: item.scheduleName
                }))
            })
        } else if (res.responseType == 2) {
            dispatch({
                type: GET_ALL_OPEN_SHIFT_REQUESTS,
                payload: [],
            })
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getRequestOffTypes = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: '/api/Shift/LeaveTypes',
            requireAuth: true,
        })
        if (res.responseMsg == 'Leave Type List Displayed Successfully') {
            dispatch({
                type: GET_ALL_OFF_REQUEST_TYPES,
                payload: res.result.map((item) => ({
                    typeId: item.typeId,
                    typeName: item.type
                }))
            })
        } else {
            dispatch({
                type: GET_ALL_OFF_REQUEST_TYPES,
                payload: []
            })
        }

    } catch (e) {
        throw new Error(e)
    }
}

export const createRequestTimeOff = (data) => async (dispatch) => {
    const { id, allDay, typeId, shiftDate, startTime, endTime, startDate, endDate, message } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Shift/AdminTimeOffRequest',
            requireAuth: true,
            requestConfig: {
                employeeId: id,
                allDay: allDay,
                type: typeId,
                start: new Date(startTime).toString(),
                end: new Date(endTime).toString(),
                startDate: startDate,
                endDate: endDate,
                message: message,
                shiftDate: shiftDate
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const updateRequestTimeOff = (data) => async (dispatch) => {
    const { id, allDay, typeId, shiftDate, startTime, endTime, startDate, endDate, message, leaveId } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Shift/AdminUpdateTimeOffRequest',
            requireAuth: true,
            requestConfig: {
                employeeId: id,
                allDay: allDay,
                type: typeId,
                start: new Date(startTime).toString(),
                end: new Date(endTime).toString(),
                startDate: startDate,
                endDate: endDate,
                message: message,
                shiftDate: shiftDate,
                leaveId: leaveId
            }
        })
        if (res.responseMsg) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}


export const deleteRequestTimeOff = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Shift/DeleteTimeOffRequest?LeaveId=${deleteID}`,
        })
        if (res.responseMsg == 'True') {
            dispatch({
                type: DELETE_OFF_Time_REQUESTS,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const updateUserRequestTimeOff = (data) => async (dispatch, getState) => {

    const { leaveId, status, reason } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Shift/TimeOffRequestDecision',
            requireAuth: true,
            requestConfig: {
                leaveId: leaveId,
                leaveStatus: status,
                rejectReason: '',
            }
        })
        if (res.responseMsg == 'Employee Leave Approved Successfully' || res.responseMsg == 'Employee Leave Reject Successfully') {
            throw new Error('Leave Approved')
        } else {
            throw new Error('Network Error')
        }

    } catch (error) {
        throw new Error(error)
    }
}

export const requestDecision = (data) => async (dispatch) => {
    const { shiftId, employeeId, shiftStatus, list } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Shift/TakeShiftDecision',
            requrieAuth: true,
            requestConfig: {
                shiftId: shiftId,
                employeeId: employeeId,
                shiftStatus: shiftStatus
            }
        })
        if (res.responseMsg == 'Shift Approved Successfully' || res.responseMsg == 'Shift Rejected Successfully') {
            dispatch({
                type: list == 'Open Shift' ? DELETE_ALL_SHIFTS : DELETE_GET_OPEN_SHIFT,
                payload: shiftId
            })
            return {
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Schedule
 */
export const getAllSchdeules = (data) => async (dispatch) => {

    const { name, siteId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'Post',
            url: 'api/Schedule/ScheduleList',
            requrieAuth: true,
            requestConfig: {
                scheduleId: 0,
                scheduleName: '',
                siteId: 0
            }
        })
        // console.log(res)
        if (res.responseType == 1) {
            dispatch({
                type: GET_ALL_SCHEDULE,
                payload: res.result.map((item) => ({
                    scheduleId: item.scheduleId,
                    name: item.scheduleName,
                    site: item.siteName,
                    siteId: item.siteId
                }))
            })
        } else if (res.responseMsg == "No Schedule List to Display") {
            dispatch({
                type: GET_ALL_SCHEDULE,
                payload: []
            })
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}


export const createSchedule = (data) => async (dispatch) => {

    const { name, siteId } = data
    try {
        const { data: res, abortController } = API({
            method: 'Post',
            url: 'api/Schedule/AddSchedule',
            requireAuth: true,
            requestConfig: {
                scheduleName: name,
                siteId: siteId,
                latitude: '',
                longitude: '',
            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const updateSchedule = (data) => async (dispatch) => {

    const { scheduleId, name, siteId } = data
    try {
        const { data: res, abortController } = API({
            method: 'Post',
            url: 'api/Schedule/UpdateSchedule',
            requireAuth: true,
            requestConfig: {
                scheduleId: scheduleId,
                scheduleName: name,
                siteId: siteId,
                latitude: '',
                longitude: '',
                maxhours: 0,
                ipAddress: '',

            }
        })
        if (res.responseType == 1) {
            return {
                status: 'success',
                msg: res.responseMsg
            }
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            }
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}


export const deleteSchedule = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Schedule/DeleteSchedule?ScheduleId=${deleteID}`,
        })
        if (res.responseMsg == 'True') {
            dispatch({
                type: DELETE_SCHEDULE,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}