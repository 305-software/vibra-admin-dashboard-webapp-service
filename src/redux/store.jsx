/**
 * Redux Store Configuration
 * 
 * This module configures the Redux store using the Redux Toolkit. It combines 
 * multiple slices of state, each responsible for managing different aspects of 
 * the application's data, into a single store.
 * 
 * @module store
 */


import { configureStore } from '@reduxjs/toolkit';

import bookingSlice from "./bookingSlice" 
import customerSlice  from './customerSlice';
import  dashboardSlice  from './dashboardSlice';
import eventSlice from './eventSlice';
import notification from './notificationSlice'
import rolePermission from "./rolePermission"
import transactionSlice  from './transactionSlice';
import userSlice from "./userSlice";


/**
 * Configured Redux store.
 * 
 * This store combines various slices including event, booking, customer, 
 * transaction, dashboard, role permissions, and user management into a single 
 * state tree.
 * 
 * @constant {Object} store
 * @property {Object} reducer - The root reducer combining all slice reducers.
 * 
 * @example
 * import store from './store';
 * 
 * // Dispatch an action
 * store.dispatch(someAction());
 * 
 * // Access the state
 * const state = store.getState();
 */ 

export default configureStore({
    reducer: {
        eventSlice: eventSlice,
        bookingSlice:bookingSlice,
        customerSlice: customerSlice,
        transactionSlice: transactionSlice,
        dashboardSlice:dashboardSlice,
        rolePermission:rolePermission,
        userSlice:userSlice,
        notification:notification
    }
});
