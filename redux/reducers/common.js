import { CLEAR_ALL_DATA } from "../actions/actionTypes"

const initialState = {}

const common = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_DATA:
            return state
        default:
            return state
    }

}