import {
    BREAK_TIME,
    CREATE_LEAVE_REQUEST,
    CREATE_LOAN_REQUEST,
    GET_USER_ATTENDANCE,
    GET_ALL_LEAVE_REQUESTS,
    GET_ALL_LOAN_REQUESTS,
    GET_USER_ANNOUNCEMENTS,
    UPDATE_USER_ANNOUNCEMENT,
    GET_EMPLOYEE_TASKS,
    SUBMIT_TASK,
    DELETE_LOAN_REQUEST,
    DELETE_LEAVE_REQUEST,
    GET_DASHBOARD_DATA,
    CLEAR_DASHBOARD_DATA,
    CLEAR_ALL_DATA,
    GET_USER_BY_ID,
    EMPLOYEE_TASK_DETAILS,
    GET_ALL_SHIFTS,
    GET_USER_SHIFTS,
    GET_USER_OFF_Time_REQUESTS,
    DELETE_USER_OFF_Time_REQUESTS,
    GET_USER_ALL_SHIFTS,
    GET_USER_OPEN_SHIFTS
} from "../actions/actionTypes";

const initialState = {
    dashboard: {
        monthlyData: []
    },
    leaves: [],
    loans: [],
    announcements: [],
    break: {},
    user: {},
    attendance: [],
    tasks: {},
    schedule: {
        shifts: {
            myshift: [],
            allshift: [],
            openShift: []
        },
        requests: {
            timeOff: [],
            shift: [],
            openShift: [],
        },
    }
};


const employee = (state = initialState, action) => {
    switch (action.type) {
        case GET_DASHBOARD_DATA:
            return {
                ...state,
                dashboard: action.payload
            }

        case CLEAR_DASHBOARD_DATA:
            return {
                ...state,
                dashboard: {
                    monthlyData: []
                }
            }

        case GET_USER_BY_ID:
            return {
                ...state,
                user: action.payload
            }

        case GET_USER_ANNOUNCEMENTS:
            return {
                ...state,
                announcements: action.payload
            }

        case UPDATE_USER_ANNOUNCEMENT:
            return {
                ...state,
                announcements: state.announcements.map((item) => {
                    if (item.id === action.payload.id) {
                        return {
                            ...state.announcements,
                            status: action.payload.status
                        }
                    }
                })


            }


        case GET_ALL_LEAVE_REQUESTS:
            return {
                ...state,
                leaves: action.payload
            }

        case DELETE_LEAVE_REQUEST:
            return {
                ...state,
                leaves: state.leaves.filter((item) => item.id !== action.payload)
            }


        case GET_ALL_LOAN_REQUESTS:
            return {
                ...state,
                loans: action.payload
            }

        case DELETE_LOAN_REQUEST:
            return {
                ...state,
                loans: state.loans.filter((item) => item.loanId !== action.payload)
            }


        case BREAK_TIME:
            return {
                ...state,
                break: action.payload
            }


        case GET_USER_ATTENDANCE:
            return {
                ...state,
                attendance: action.payload
            }



        case GET_EMPLOYEE_TASKS:
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    list: action.payload
                }
            }
        case EMPLOYEE_TASK_DETAILS:
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    details: action.payload
                }
            }


        case GET_USER_SHIFTS:
            return {
                ...state,
                schedule: {
                    ...state.schedule,
                    shifts: {
                        ...state.schedule.shifts,
                        myshift: action.payload
                    }
                }
            }

        case GET_USER_ALL_SHIFTS:
            return {
                ...state,
                schedule: {
                    ...state.schedule,
                    shifts: {
                        ...state.schedule.shifts,
                        allshift: action.payload
                    }
                }
            }

        case GET_USER_OPEN_SHIFTS:
            return {
                ...state,
                schedule: {
                    ...state.schedule,
                    shifts: {
                        ...state.schedule.shifts,
                        openShift: action.payload
                    }
                }
            }

        case GET_USER_OFF_Time_REQUESTS:
            return {
                ...state,
                schedule: {
                    ...state.schedule,
                    requests: {
                        ...state.schedule.requests,
                        myshift: action.payload
                    }
                }
            }

        case DELETE_USER_OFF_Time_REQUESTS:
            return {
                ...state,
                schedule: {
                    ...state.schedule,
                    requests: state.schedule.requests.filter((item) => item.leaveId !== action.payload)
                }
            }


        case CLEAR_ALL_DATA:
            return initialState
        default:
            return state
    }
}

export default employee