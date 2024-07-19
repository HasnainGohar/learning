import { combineReducers } from 'redux';
import admin from './admin';
import employee from './employee';

const rootReducer = combineReducers({
    admin,
    employee
});

export default rootReducer;