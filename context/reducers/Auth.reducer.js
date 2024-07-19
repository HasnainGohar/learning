import { SET_CURRENT_USER } from "../actions/Auth.actions";

import isEmpty from "../../assets/common/is-empty";

export default function (state, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                token: action.token,
                user: action.payload,
                userID: action.userID,
                companyID: action.companyID,
                siteID: action.siteID,
            }
        default:
            return state;
    }
}