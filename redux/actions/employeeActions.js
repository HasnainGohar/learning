import API from "../../utils/API";

import {
    BREAK_TIME,
    GET_USER_ATTENDANCE,
    GET_ALL_LEAVE_REQUESTS,
    GET_ALL_LOAN_REQUESTS,
    GET_USER_ANNOUNCEMENTS,
    UPDATE_USER_ANNOUNCEMENT,
    GET_EMPLOYEE_TASKS,
    SUBMIT_TASK,
    GET_DASHBOARD_DATA,
    USER_LOAN_DETAILS,
    CLEAR_DASHBOARD_DATA,
    CLEAR_ALL_DATA,
    GET_USER_BY_ID,
    EMPLOYEE_TASK_DETAILS,
    GET_ALL_OFF_Time_REQUESTS,
    DELETE_OFF_Time_REQUESTS,
    GET_USER_SHIFTS,
    GET_USER_OFF_Time_REQUESTS,
    DELETE_USER_OFF_Time_REQUESTS,
    GET_USER_ALL_SHIFTS,
    GET_USER_OPEN_SHIFTS

} from "./actionTypes";

/*
  Dashboard
*/

export const getDashboardData = (data) => async (dispatch) => {
    const { userId, date } = data

    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: `api/UserEmployee/UserDashboard?UserId=${userId}&Date=${date}`,
            requireAuth: true,

        })
        if (res.responseMsg === 'User Dashboard Data Displayed Successfully') {
            dispatch({
                type: GET_DASHBOARD_DATA,
                payload: {
                    onTime: res.result?.dayData.onTimePercent,
                    present: res.result?.dayData.presentPercent,
                    absent: res.result?.dayData.absentPercent,
                    late: res.result?.dayData.latePercent,
                    leave: res.result?.dayData.leavePercent,
                    allocateLeaves: res.result?.dayData.annualLeaves,
                    remainingLeave: res.result?.dayData.remainingLeaves,
                    checkOut: res.result?.dayData.checkOutTime,
                    checkIn: res.result?.dayData.checkInTime,
                    status: res.result?.dayData.status,
                    startBreak: res.result?.dayData.breakInTime,
                    endBreak: res.result?.dayData.breakOutTime,
                    totalBreak: res.result?.dayData.totalBreakTime,
                    weeklyHours: res.result?.dayData.currrentWeek,
                    monthlyHours: res.result?.dayData.currentMonth,
                    yearlyHours: res.result?.dayData.currentYear,
                    unReadAnnouncements: res.result?.dayData.unReadAnnouncements,
                    startTime: res.result?.dayData.startTime,
                    endTime: res.result?.dayData.endTime,
                    monthlyData: res.result?.monthlyData.map((item) => ({
                        monthName: item.month,
                        present: item.present,
                        absent: item.absent,
                        late: item.late,
                        leave: item.leave
                    }))

                }
            })
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }

}

export const clearDashboardData = () => {
    return {
        type: CLEAR_DASHBOARD_DATA
    }
}



export const getUserDetails = (userId) => async (dispatch, getState) => {

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/User/UserbyUserId?UserId=${userId}`,
            requireAuth: true,
        })
        if (res.responseMsg == 'User Detail Displayed Successfully') {
            dispatch({
                type: GET_USER_BY_ID,
                payload: {
                    id: res.result.userId,
                    firstName: res.result.userFirstName,
                    name: `${res.result.userFirstName}`,
                    email: res.result.userLogin,
                    password: res.result.userPassword,
                    description: res.result.userDescription,
                    phone: res.result.userPhone,
                    role: res.result.roleCode,
                    postalCode: res.result.userZipPostalCode,
                    country: res.result.userCountry,
                    gender: res.result.genderId,
                    city: res.result.userCity,
                    image: res.result.file,
                    siteId: res.result.siteId,
                    DOC: res.result.createdDate,
                    address: res.result.userAddress1,
                    photo: res.result.photo
                }
            })
        } else {
            return new Error('Network Error')
        }
    }
    catch (e) {
        console.log(e)
        throw new Error(e)
    }
}


/*
  Break
*/




export const markBreak = (data) => async (dispatch) => {

    const { mode } = data
    const time = new Date().toString()

    try {
        const { data: res, abortController } = await API({
            method: 'Post',
            url: 'api/Attendance/MarkBreak',
            requestConfig: {
                userId: 0,
                breakTime: time,
                breakMode: mode
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
  Task
*/

export const getAllTasks = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/UserEmployee/UserTaskList',
        })
        if (res.responseMsg == 'Task List Displayed Successfully') {
            dispatch({
                type: GET_EMPLOYEE_TASKS,
                payload: res.result.map((item) => ({
                    taskId: item.taskId,
                    name: item.taskName,
                    status: item.status,
                    formDate: item.formDate,
                    toDate: item.toDate,
                    description: item.description
                }))
            })
        } else if (res.responseMsg == 'No Task List Displayed Successfully') {

            dispatch({
                type: GET_EMPLOYEE_TASKS,
                payload: []
            })
        }
        else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const taskDetails = (id) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: `api/UserEmployee/UserTaskDetailList?taskId=${id}`,
        })

        if (res.responseMsg == 'Task Detail Displayed Successfully') {
            const item = res.result[0];
            dispatch({
                type: EMPLOYEE_TASK_DETAILS,
                payload: {
                    taskId: item.taskId,
                    name: item.taskName,
                    status: item.status,
                    formDate: item.formDate,
                    toDate: item.toDate,
                    description: item.description,
                    documents: item.attachments.map((attachment) => attachment)
                }
            });
        } else if (res.responseMsg == 'No Task List Displayed Successfully') {

            dispatch({
                type: EMPLOYEE_TASK_DETAILS,
                payload: []
            })
        }
        else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}


export const submitTask = (data) => async (dispatch) => {
    const { taskId, status } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Task/UpdateUserStatus',
            requireAuth: true,
            requestConfig: {
                taskId: taskId,
                status: status
            }
        })
        if (res.message === '') {
            dispatch({
                type: SUBMIT_TASK,
                payload: {
                    id: id,
                    status: status
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

/*
  Announcement
*/

export const getTodaysAnnouncements = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Announcement/TodayAnnouncement',
        })
        if (res.responseMsg == `Today's Announcement Displayed Successfully`) {
            dispatch({
                type: GET_USER_ANNOUNCEMENTS,
                payload: res.result?.map((item) => ({
                    id: item.announcementId,
                    title: item.announcementTitle,
                    description: item.announcementDescription,
                    status: item.status
                }))
            })
        } else if (res.responseMsg == 'No Announcement Today') {
            dispatch({
                type: GET_USER_ANNOUNCEMENTS,
                payload: []
            })
        }
        else {
            throw new Error('Network Error announcement')
        }
        return { abortController }
    } catch (error) {
        throw new Error(error)
    }
}
export const updateAnnouncementStatus = (data) => async (dispatch) => {
    const { id, status } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Announcement/UpdateUserAnnouncementStatus',
            requestConfig: {
                announcementId: id,
                status: status
            }
        })
        if (res.responseMsg == 'User Announcement Status Updated Successfully') {
            return true
        } else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

/*
  Attendance
*/

export const getUserAttendance = (data) => async (dispatch) => {

    const { fromDate, toDate, week, month, year } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/UserEmployee/UserAttendanceList',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                week: week,
                month: month,
                year: year,
            }
        })
        if (res.responseMsg == 'Attendance List Displayed Successfully') {
            dispatch({
                type: GET_USER_ATTENDANCE,
                payload: res.result?.map((item) => ({
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
                }))
            })
        } else if (res.responseMsg == 'No Attendance List to Display') {
            dispatch({
                type: GET_USER_ATTENDANCE,
                payload: []
            })
        }
        else {
            throw new Error('Network Error')
        }

    } catch (error) {
        throw new Error(error)
    }
}

/*
  Leave
*/

export const getAllRequestLeaves = (data) => async (dispatch, getState) => {
    try {

        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/UserEmployee/UserLeaveList',
            requireAuth: true,
        })
        if (res.responseMsg == 'Leave List Displayed Successfully') {
            dispatch({
                type: GET_ALL_LEAVE_REQUESTS,
                payload: res.result?.map((item) => ({
                    id: item.leaveId,
                    name: item.firstName,
                    status: item.leaveStatus,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    reason: item.leaveReason,
                    description: item.leaveDescription,
                    leaveTitle: item.leaveTitle,
                    titleId: item.leaveTitleId
                }))
            })
        } else if (res.responseMsg == 'No Leave List to Display') {
            dispatch({
                type: GET_ALL_LEAVE_REQUESTS,
                payload: []
            })
        }
        else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const createLeaveRequest = (data) => async (dispatch, getState) => {
    const { status, reason, toDate, fromDate, description, titleId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/UserEmployee/UserLeaveRequest',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                leaveReason: description,
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
  Loan
*/

export const getAllRequestLoans = (data) => async (dispatch, getState) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/UserEmployee/UserLoanList',
            requireAuth: true
        })
        if (res.responseMsg == 'Loan List Displayed Successfully') {
            dispatch({
                type: GET_ALL_LOAN_REQUESTS,
                payload: res.result?.map((item) => ({
                    id: item.loanId,
                    amount: item.loanAmount,
                    status: item.loanStatus,
                    loanDate: item.loanDate,
                    tenure: item.loanReason,
                    titleId: item.loanTitleId
                }))
            })
        } else if (res.responseMsg == 'No Loan List to Display') {
            dispatch({
                type: GET_ALL_LOAN_REQUESTS,
                payload: []
            })
        }
        else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}


export const createLoanRequest = (data) => async (dispatch, getState) => {
    const { amount, loanDate, titleId, reason } = data
    console.log(data)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/UserEmployee/UserLoanRequest',
            requireAuth: true,
            requestConfig: {
                requestId: null,
                loanAmount: amount,
                loanDate: loanDate,
                loanTitleId: titleId,
                loanReason: reason,
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

export const UpdateLoanRequest = (data) => async (dispatch, getState) => {

    const { amount, toDate, loanTitleId, reason, requestId } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/UserUpdateloanrequest',
            requireAuth: true,
            requestConfig: {
                requestId: requestId ? requestId : null,
                loanAmount: amount,
                loanDate: toDate,
                loanTitleId: loanTitleId,
                loanReason: reason,
            },
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

export const loanDetails = (data) => async (dispatch, getState) => {

    const { loanId } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/UserEmployee/UserLoanDetailList',
            requireAuth: true,
            requestConfig: {
                requestId: loanId
            }
        })
        dispatch({
            type: USER_LOAN_DETAILS,
            payload: res.responseData.map((item) => ({
                amount: item.repayAmount,
                date: item.repayDate,
                paid: item.paidAmmount,
                remaining: item.outstandingAmount
            }))
        })

    } catch (error) {
        throw new Error(error)
    }
}

export const SubmitEOD = (data) => async (dispatch, getState) => {

    const { report } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/UserEmployee/UserEndOfDayReport',
            requireAuth: true,
            requestConfig: {
                endOfDayReport: report
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


/**
 * Schdeules
 */

// SHifts
export const getAllShifts = (data) => async (dispatch) => {
    const { id, status } = data

    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: `api/Shift/UserShiftList?UserId=${id}&ShiftStatus=${status}`,
            requireAuth: true,
        })
        if (res.responseType == 1) {
            if (status == 'My Shift') {
                console.log('My Shift')
                dispatch({
                    type: GET_USER_SHIFTS,
                    payload: res.result.map((item) => ({
                        shiftId: item.shiftId,
                        employeeId: item.employeeId,
                        name: item.employeeName,
                        repeatWeek: item.repeatWeek,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        shiftDate: item.shiftDate,
                        unpaidBreak: item.unpaidBreak,
                        positionId: item.positionId,
                        shiftNotes: item.shiftNotes,
                        shiftStatus: item.shiftStatus,
                        saveAsSchedule: item.saveAsSchedule
                    }))
                })
            }
            if (status == 'All Shift') {
                console.log('All SHIft')
                dispatch({
                    type: GET_USER_ALL_SHIFTS,
                    payload: res.result.map((item) => ({
                        shiftId: item.shiftId,
                        employeeId: item.employeeId,
                        name: item.employeeName,
                        repeatWeek: item.repeatWeek,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        shiftDate: item.shiftDate,
                        unpaidBreak: item.unpaidBreak,
                        positionId: item.positionId,
                        shiftNotes: item.shiftNotes,
                        shiftStatus: item.shiftStatus,
                        saveAsSchedule: item.saveAsSchedule
                    }))
                })
            }
            if (status == 'Open Shift') {
                console.log('Open Shift action',)
                dispatch({
                    type: GET_USER_OPEN_SHIFTS,
                    payload: res.result.map((item) => ({
                        shiftId: item.shiftId,
                        employeeId: item.employeeId,
                        name: item.employeeName,
                        repeatWeek: item.repeatWeek,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        shiftDate: item.shiftDate,
                        unpaidBreak: item.unpaidBreak,
                        positionId: item.positionId,
                        shiftNotes: item.shiftNotes,
                        shiftStatus: item.shiftStatus,
                        saveAsSchedule: item.saveAsSchedule
                    }))
                })
            }
        }
        else if (res.responseMsg == 'No List to Display') {
            dispatch({
                type: GET_USER_SHIFTS,
                payload: []
            })
        }
        else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const ShiftDecision = (data) => async (dispatch) => {

    const { shiftId, status } = data

    try {
        const res = await API({
            method: 'POST',
            url: 'api/Shift/ShiftDecision',
            requestConfig: {
                shiftId: shiftId,
                shiftStatus: status
            }
        })

    } catch (error) {
        throw new Error(error)
    }
}

export const takeShift = (data) => async (dispatch) => {
    console.log(data)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `/api/Shift/TakeShift?ShiftId=${1}`,
        })
        console.log(res)
        if (res.responseType == 1) {
            console.log(res.responseMsg)
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

export const dropShift = (data) => async (dispatch) => {

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Shift/DropShift?ShiftId=${data}`,
        })
        console.log(res)
        if (res.responseType == 1) {
            console.log(res.responseMsg)
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

// Requests

export const getAllTimeOffList = (data) => async (dispatch) => {
    const { timeOffType, employeeId, status } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Shift/UserTimeOffRequestList',
            requireAuth: true,
            requestConfig: {
                timeOffType: timeOffType,
                employeeId: employeeId,
                status: status
            }
        })
        if (res.responseMsg == 'List Displayed Successfully') {
            dispatch({
                type: GET_USER_OFF_Time_REQUESTS,
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
                type: GET_USER_OFF_Time_REQUESTS,
                payload: []
            })
        }

    } catch (e) {
        throw new Error(e)
    }
}

export const createTimeOff = (data) => async () => {
    const { id, allDay, typeId, shiftDate, startTime, endTime, startDate, endDate, message } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Shift/UserOffTimeRequest',
            requireAuth: true,
            requestConfig: {
                allDay: allDay,
                type: typeId,
                start: new Date(startTime).toString(),
                end: new Date(endTime).toString(),
                startDate: startDate,
                endDate: endDate,
                message: message,
                shiftDate: shiftDate,
            }
        })

        if (res.responseType == 1) {
            console.log(res.responseMsg)
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

export const updateTimeOff = (data) => async (dispatch) => {
    try {
        const { data: res } = await API({
            method: 'POST',
            url: 'api/Shift/UserUpdateTimeOffRequest',
            requireAuth: true,
            requestConfig: {
                allDay: data.allDay,
                type: data.typeId,
                start: new Date(data.startTime).toString(),
                end: new Date(data.endTime).toString(),
                startDate: data.startDate,
                endDate: data.endDate,
                message: data.message,
                shiftDate: data.shiftDate,
                leaveId: data.leaveId
            }
        });

        if (res.responseType == 1) {
            console.log(res.responseMsg);
            return {
                status: 'success',
                msg: res.responseMsg
            };
        } else if (res.responseType == 2) {
            return {
                status: 'error',
                msg: res.responseMsg
            };
        } else {
            throw new Error('Network Error');
        }
    } catch (error) {
        console.error("Error in updateTimeOff:", error.message);
        throw new Error(error.message); // Make sure to throw an Error object with a message
    }
};



export const deleteTimeOff = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Shift/DeleteTimeOffRequest?LeaveId=${deleteID}`,
        })
        if (res.responseMsg == 'True') {
            dispatch({
                type: DELETE_USER_OFF_Time_REQUESTS,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
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