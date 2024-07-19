import {
    DELETE_EMPLOYEE,
    UPDATE_LEAVE_REQUEST,
    GET_BARCHART_DATA,
    GET_TODAYS_ATTENDANCE,
    GET_ALL_EMPLOYEES,
    GET_ALL_USERS,
    DELETE_USER,
    GET_LEAVE_REQUESTS,
    GET_ALL_LOANS,
    DELETE_LOAN,
    REPAY_LOAN,
    GET_ALL_HOLIDAYS,
    DELETE_HOLIDAY,
    GET_ALL_SITES,
    DELETE_SITE,
    GET_ALL_ANNOUNCEMENT,
    CREATE_ANNOUNCEMENT,
    UPDATE_ANNOUNCEMENT,
    DELETE_ANNOUNCEMENT,
    GET_LOAN_REQUESTS,
    UPDATE_LOAN_REQUEST,
    GET_ALL_LEAVES,
    DELETE_LEAVE,
    CREATE_COMPANY,
    UPDATE_COMPANY,
    DELETE_COMPANY,
    GET_COMPANY_DETAILS,
    UPDATE_COMPANY_DETAILS,
    GET_ALL_ATTENDANCE,
    GET_ABSENT_EMPLOYEES,
    GET_LOAN_TITLES,
    GET_PRESENT_EMPLOYEES,
    GET_LATE_EMPLOYEES,
    GET_LEAVE_EMPLOYEES,
    DELETE_POSITION,
    GET_ALL_POSITION,
    GET_ALL_INDUSTRY,
    LOGINDETAILS,
    CLEAR_ALL_DATA,
    CLEAR_ALL_ATTENDANCE,
    CLEAR_TODAYS_ATTENDANCE,
    GET_BREAK_USERS,
    GET_COMPANY_DASHBOARD,
    GET_LEAVES_DASHBOARD,
    EMPLOYEE_LEAVES_DASHBOARD,
    GET_ALL_ROLES,
    TOGGLE_EMPLOYEE_STATUS,
    DELETE_ROLES,
    GET_ALL_TASKS,
    DELETE_TASK,
    TASK_DETAILS,
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
    DELETE_GET_MY_SHIFTS,
    DELETE_GET_OPEN_SHIFT,
    TAKE_SHIFT_LIST,
    GET_ALL_OPEN_SHIFT_REQUESTS,
    DELETE_ALL_SHIFTS,
    GET_LEAVE_TITLES,
    GET_SINGLE_EMPLOYEES,
    DELETE_EMPLOYEE_COMPLINCE,
    DELETE_EMPLOYEE_EDUCATION,
    DELETE_EMPLOYEE_BANK,
    DELETE_EMPLOYEE_PASSPORT,
    DELETE_EMPLOYEE_VISA,
    GET_EMPLOYEE_COUNT,
    GET_SITES,
    COMPLIANCE_DASHBOARD,
} from "../actions/actionTypes";

const initialState = {
    login: {},
    company: {},
    dashboard: {
        presentEmployees: [],
        absentEmployees: [],
        lateEmployees: [],
        leaveEmployees: [],
        breakEmployees: [],
        siteList: []
    },
    leavesDashboard: {},
    employeeLeaveDashboard: {},
    leaves: {
        request: [],
        list: [],
        titles: [],
    },
    loans: {
        request: [],
        list: [],
        repay: [],
        titles: []
    },
    attendance: [],
    onBreakList: [],
    employees: [],
    employeeDetails: {},
    complianceDashborad: {
        dashboard: {}
    },
    employeeStatus: true,
    users: [],
    holidays: [],
    sites: [],
    announcements: [],
    positions: [],
    tasks: {},
    taskDetails: {},
    taskChart: [],
    roles: [],
    industry: [],
    request: {
        requestTypes: [],
        offTimeList: [],
        shiftRequestList: [],
        openShiftList: []
    },
    schedules: [],
    shifts: {
        allShifts: [],
        openShifts: [],
        myshifts: []
    },


};

const admin = (state = initialState, action) => {
    // console.log(action.payload, ',reducre')


    switch (action.type) {

        case LOGINDETAILS:
            return {
                ...state,
                login: action.payload
            }

        // Company 
        case GET_COMPANY_DETAILS:
            return {
                ...state,
                company: action.payload
            }

        // Dashboard

        case GET_COMPANY_DASHBOARD:
            return {
                ...state,
                dashboard: action.payload
            }

        case GET_EMPLOYEE_COUNT:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    absent: action.payload.absent,
                    late: action.payload.late,
                    leave: action.payload.leave,
                    present: action.payload.present,
                }
            }

        case GET_PRESENT_EMPLOYEES:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    presentEmployees: action.payload
                }
            }

        case GET_ABSENT_EMPLOYEES:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    absentEmployees: action.payload
                }
            }

        case GET_LATE_EMPLOYEES:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    lateEmployees: action.payload
                }
            }

        case GET_LEAVE_EMPLOYEES:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    leaveEmployees: action.payload
                }
            }

        case GET_SITES:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    siteList: action.payload
                }
            }

        /*
          Attendance
        */

        case GET_ALL_ATTENDANCE:
            return {
                ...state,
                attendance: action.payload
            }
        case GET_BREAK_USERS:
            return {
                ...state,
                onBreakList: action.payload
            }
        case CLEAR_ALL_ATTENDANCE:
            return {
                ...state,
                attendance: []
            }

        /*
            Employee
       */

        case GET_ALL_EMPLOYEES:
            return {
                ...state,
                employees: action.payload
            }

        case GET_SINGLE_EMPLOYEES:
            return {
                ...state,
                employeeDetails: action.payload,
            }

        case DELETE_EMPLOYEE:
            return {
                ...state,
                employees: [...state.employees.filter((item) => item.id !== action.payload)]
            }
        case TOGGLE_EMPLOYEE_STATUS:
            return {
                ...state,
                employeeStatus: !state.employeeStatus
            };

        case DELETE_EMPLOYEE_EDUCATION:
            return {
                ...state,
                employeeDetails: {
                    ...state.employeeDetails,
                    educationDetail: state.employeeDetails?.educationDetail?.filter((item) => item.educationId !== action.payload)
                }
            }

        case DELETE_EMPLOYEE_COMPLINCE:
            return {
                ...state,
                employeeDetails: {
                    ...state.employeeDetails,
                    complinceDocuments: state.employeeDetails?.complinceDocuments?.filter((item) => item.documentId !== action.payload)
                }
            }
        case DELETE_EMPLOYEE_BANK:

            return {
                ...state,
                employeeDetails: {
                    ...state.employeeDetails,
                    bankDetail: null
                }
            }

        case DELETE_EMPLOYEE_PASSPORT:
            return {
                ...state,
                employeeDetails: {
                    ...state.employeeDetails,
                    passportDetail: null
                }
            }

        case DELETE_EMPLOYEE_VISA:
            return {
                ...state,
                employeeDetails: {
                    ...state.employeeDetails,
                    visaDetail: null
                }
            }

        case COMPLIANCE_DASHBOARD:
            return {
                ...state,
                complianceDashborad: {
                    ...state.complianceDashborad,
                    dashboard: action.payload
                }
            }

        /*
            Users
         */

        case GET_ALL_USERS:
            return {
                ...state,
                users: action.payload
            }

        case DELETE_USER:
            return {
                ...state,
                users: [...state.users.filter((item) => item.id !== action.payload)]
            }

        /*
          Leaves
        */

        case GET_LEAVES_DASHBOARD:
            return {
                ...state,
                leavesDashboard: action.payload
            }
        case EMPLOYEE_LEAVES_DASHBOARD:
            return {
                ...state,
                employeeLeaveDashboard: action.payload
            }

        case GET_LEAVE_TITLES:
            return {
                ...state,
                leaves: {
                    ...state.leaves,
                    titles: action.payload
                }
            }

        case GET_ALL_LEAVES:
            return {
                ...state,
                leaves: {
                    ...state.leaves,
                    list: action.payload
                }
            }

        case DELETE_LEAVE:
            return {
                ...state,
                leaves: {
                    ...state.leaves,
                    list: state.leaves.list.filter(item => item.id !== action.payload)
                }
            }

        case GET_LEAVE_REQUESTS:
            return {
                ...state,
                leaves: {
                    ...state.leaves,
                    request: action.payload
                }
            }

        case UPDATE_LEAVE_REQUEST:
            return {
                ...state,
                leaves: {
                    ...state.leaves,
                    request: state.leaves.request.filter(request => request.id !== action.payload)
                }
            }

        /*
          Loan
        */

        case GET_ALL_LOANS:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    list: action.payload
                }
            }
        case GET_LOAN_TITLES:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    titles: action.payload
                }
            }

        case DELETE_LOAN:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    list: state.loans.list.filter(item => item.loanId !== action.payload)
                }
            }

        case REPAY_LOAN:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    repay: action.payload
                }
            }

        case GET_LOAN_REQUESTS:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    request: action.payload
                }
            }
        case UPDATE_LOAN_REQUEST:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    request: state.loans.request.filter(request => request.id !== action.payload)
                }

            }

        /* 
          Holiday
        */
        case GET_ALL_HOLIDAYS:
            return {
                ...state,
                holidays: action.payload
            }

        case DELETE_HOLIDAY:
            return {
                ...state,
                holidays: state.holidays.filter((item) => item.id !== action.payload)
            }

        /*
        Sites
        */

        case GET_ALL_SITES:
            return {
                ...state,
                sites: action.payload
            }

        case DELETE_SITE:
            return {
                ...state,
                sites: state.sites.filter((item) => item.siteId !== action.payload)
            }

        /* 
        Announcement
        */

        case GET_ALL_ANNOUNCEMENT:
            return {
                ...state,
                announcements: action.payload
            }

        case CREATE_ANNOUNCEMENT:
            return {
                ...state,
                announcements: [...state.announcements, action.payload]
            }

        case UPDATE_ANNOUNCEMENT:
            return {
                ...state,
                announcements: state.announcements.map((item) => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            id: action.payload.id,
                            title: action.payload.title,
                            description: action.payload.description,
                            isSend: action.payload.isSend,
                            status: action.payload.status
                        }
                    }
                })
            }
        case DELETE_ANNOUNCEMENT:
            return {
                ...state,
                announcements: state.announcements.filter((item) => item.id !== action.payload)
            }

        // Postion

        case GET_ALL_POSITION:
            return {
                ...state,
                positions: action.payload
            }
        case DELETE_POSITION:
            return {
                ...state,
                positions: state.positions.filter((item) => item.positionId !== action.payload)
            }

        // industry

        case GET_ALL_INDUSTRY:
            return {
                ...state,
                industry: action.payload
            }

        /**
         Role
         */

        case GET_ALL_ROLES:
            return {
                ...state,
                roles: action.payload
            }

        case DELETE_ROLES:
            return {
                ...state,
                roles: state.roles.filter((item) => item.roleId !== action.payload)
            }


        /**
           task
        */
        case GET_ALL_TASKS:
            return {
                ...state,
                tasks: action.payload
            }

        case DELETE_TASK:
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    list: state.tasks.list.filter((item) => item.taskId !== action.payload),
                },
            }

        case GET_TASK_CHART:
            return {
                ...state,
                taskChart: action.payload
            }

        case TASK_DETAILS:
            return {
                ...state,
                taskDetails: action.payload
            }



        /**
         * Shift Verse
         * 
         */

        // Request

        case GET_ALL_OFF_REQUEST_TYPES:
            return {
                ...state,
                request: {
                    ...state.request,
                    requestTypes: action.payload,
                }
            }

        case GET_ALL_OFF_Time_REQUESTS:
            return {
                ...state,
                request: {
                    ...state.request,
                    offTimeList: action.payload,
                }
            }

        case DELETE_OFF_Time_REQUESTS:
            return {
                ...state,
                request: {
                    ...state.request,
                    offTimeList: state.request.offTimeList.filter((item) => item.leaveId !== action.payload),
                }
            }

        case GET_ALL_SHIFT_REQUESTS:
            return {
                ...state,
                request: {
                    ...state.request,
                    shiftRequestList: action.payload,
                }
            }
        case DELETE_ALL_SHIFTS:
            return {
                ...state,
                request: {
                    ...state.request,
                    shiftRequestList: state.request.shiftRequestList.filter((item) => item.shiftId !== action.payload),
                }
            }

        case GET_ALL_OPEN_SHIFT_REQUESTS:
            return {
                ...state,
                request: {
                    ...state.request,
                    openShiftList: action.payload,
                }
            }

        case GET_ALL_OPEN_SHIFT_REQUESTS:
            return {
                ...state,
                request: {
                    ...state.request,
                    openShiftList: state.request.openShiftList.filter((item) => item.shiftId !== action.payload),
                }
            }





        // Schedules

        case GET_ALL_SCHEDULE:
            return {
                ...state,
                schedules: action.payload
            }

        case DELETE_SCHEDULE:
            return {
                schedule: state.schedules.filter((item) => item.scheduleId !== action.payload),
            }



        // Shift

        case GET_ALL_SHIFTS:
            return {
                ...state,
                shifts: {
                    ...state.shifts,
                    allShifts: action.payload
                }
            }

        case DELETE_GET_MY_SHIFTS:
            return {
                ...state.shifts,
                shifts: {
                    ...state.shifts,
                    allShifts: state.shifts.allShifts.filter((item) => item.shiftId !== action.payload)
                }
            }

        case GET_OPEN_SHIFT:
            return {
                ...state,
                shifts: {
                    ...state.shifts,
                    openShifts: action.payload
                }
            }

        case DELETE_GET_OPEN_SHIFT:
            return {
                ...state.shifts,
                shifts: {
                    ...state.shifts,
                    openShifts: state.shifts.openShifts.filter((item) => item.shiftId !== action.payload)
                }
            }

        case GET_MY_SHIFTS:
            return {
                ...state,
                shifts: {
                    ...state.shifts,
                    myshifts: action.payload
                }
            }

        case DELETE_GET_MY_SHIFTS:
            return {
                ...state.shifts,
                shifts: {
                    ...state.shifts,
                    myshifts: state.shifts.myshifts.filter((item) => item.shiftId !== action.payload)
                }
            }

        case CLEAR_ALL_DATA:
            return initialState

        default:
            return state
    }
}

export default admin