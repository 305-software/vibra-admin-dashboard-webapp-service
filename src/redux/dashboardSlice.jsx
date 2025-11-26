/**
 * Dashboard Slice
 * 
 * A Redux slice that manages the state related to dashboard data. It includes 
 * asynchronous actions to fetch various dashboard metrics such as transactions, 
 * total events, ticket sales, revenue, and upcoming events. The slice provides 
 * reducers to update the respective parts of the dashboard state.
 * 
 * @module dashboardSlice
 */


import {
    createSlice
} from "@reduxjs/toolkit";
import axios from "axios";

import config from "../config";


/**
 * Initial state for the dashboard slice.
 * 
 * @constant {Object} initialState
 * @property {Array} dashboardList - An array to hold the dashboard data.
 * @property {Array} totalEventDashboard - An array for total event dashboard data.
 * @property {Array} totalTicketDashboard - An array for total ticket dashboard data.
 * @property {Array} salesRevenue - An array for sales revenue data.
 * @property {Array} upcomingList - An array for upcoming events.
 * @property {Array} totalEvent - An array for total events.
 */

const initialState = {
    recentEvent: [],
    totalEventDashboard: [],
    totalTicketDashboard: [],
    salesRevenue: [],
    upcomingList: [],
    totalEvent: [],
    statistics: [],
    trendingEvents: [],
    latestSales: [],
    categoryrevenue:[],
    loadingStates: {
        recentEvent: false,
        totalEventDashboard: false,
        totalTicketDashboard: false,
        salesRevenue: false,
        upcomingList: false,
        totalEvent: false,
        statistics: false,
        trendingEvents: false,
        latestSales: false,
        categoryRevenue: false
    }
}

export const setLoadingState = (key, value) => ({
    type: 'dashboard/setLoadingState',
    payload: { key, value }
});

export const latestSalesData = () =>

    async (dispatch) => {

        try {
            dispatch(setLoadingState('latestSales', true));
            const response = await axios.get(config.latestSales, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(latestSales({ latestSales: response.data }));
        } catch (error) {
            return error?.response?.data;
        } finally {
            dispatch(setLoadingState('latestSales', true));
        }
    };

export const  statisticsData = () =>

    async (dispatch) => {

        try {
            dispatch(setLoadingState('statistics', false));
            const response = await axios.get(config.stats, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(statistics({ statistics: response.data.data }));
        } catch (error) {
            return error?.response?.data;
        }finally {
            dispatch(setLoadingState('statistics', false));
        }
        
    };

export const trendingEventsData = () =>

    async (dispatch) => {
        dispatch(setLoadingState('trendingEvents', true));
        try {
            const response = await axios.get(config.trendingEvents, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(trendingEvents({ trendingEvents: response.data.trendingEvents }));
        } catch (error) {
            return error?.response?.data;
        }finally {
            dispatch(setLoadingState('trendingEvents', false));
        }
    };


/**
 * Asynchronous action to fetch the transaction list for the dashboard.
 * 
 * @function fetchTransactionList
 * @returns {Function} A thunk function that dispatches the dashboard list to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(fetchTransactionList());
 */

export const recentEventList = () =>

    async (dispatch) => {

        try {
            dispatch(setLoadingState('recentEvent', true));
            const response = await axios.get(config.recentEvents, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(recentEvent({ recentEvent: response.data }));
        } catch (error) {
            return error?.response?.data;
        }finally {
            dispatch(setLoadingState('recentEvent', false));
        }
    };
/**
 * Asynchronous action to fetch total event dashboard data based on selected category and date.
 * 
 * @function totalEventDashboardList
 * @param {string} selectedCategory - The category of events to filter.
 * @param {string} date - The date for which to fetch total events.
 * @returns {Function} A thunk function that dispatches the total event dashboard data to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(totalEventDashboardList('Concert', '2024-12-28'));
 */

export const totalEventDashboardList = (selectedCategory, date) =>

    async (dispatch) => {
        const category = {
            'category': selectedCategory,
            'date': date,
        }
        try {
            dispatch(setLoadingState('totalEventDashboard', true));
            const response = await axios.post(config.totalEventDashboard, category, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(totalEventDashboard({ totalEventDashboard: response.data }));


        } catch (error) {
            return error?.response?.data;
        }
        finally {
            dispatch(setLoadingState('totalEventDashboard', false));
        }
    };


/**
 * Asynchronous action to fetch event details by event ID.
 * 
 * @function eventList
 * @param {string} id - The ID of the event to fetch details for.
 * @returns {Function} A thunk function that dispatches the total event data to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(eventList('12345'));
 */
export const eventList = (id) =>

    async (dispatch) => {
        const category = {
            'eventId': id
        }
        try {
            dispatch(setLoadingState('totalEvent', true));
            const response = await axios.post(config.eventListById, category, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(totalEvent({ totalEvent: response.data }));


        } catch (error) {
            return error?.response?.data;
        }   finally {
            dispatch(setLoadingState('totalEvent', false));
        }
    };


/**
 * Asynchronous action to fetch total ticket dashboard data based on selected category and date.
 * 
 * @function totalTicketDashboardList
 * @param {string} selectedCategory - The category of events to filter.
 * @param {string} date - The date for which to fetch total tickets.
 * @returns {Function} A thunk function that dispatches the total ticket dashboard data to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(totalTicketDashboardList('VIP', '2024-12-28'));
 */

export const totalTicketDashboardList = (selectedCategory, date) =>

    async (dispatch) => {
        const category = {
            'category': selectedCategory,
            'date': date,
        }
        try {
            dispatch(setLoadingState('totalTicketDashboard', true));

            const response = await axios.post(config.totalEventDashboard, category, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(totalTicketDashboard({ totalTicketDashboard: response.data }));


        } catch (error) {
            return error?.response?.data;
        }
        finally {
            dispatch(setLoadingState('totalTicketDashboard', false));
        }
    };
/**
 * Asynchronous action to fetch sales revenue data for a specific date.
 * 
 * @function salesRevenueList
 * @param {string} date - The date for which to fetch sales revenue.
 * @returns {Function} A thunk function that dispatches the sales revenue data to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(salesRevenueList('2024-12-28'));
 */

export const salesRevenueList = (date) =>

    async (dispatch) => {

        const dates = {
            date: date
        }

        try {
            dispatch(salesRevenue('salesRevenue', true));
            const response = await axios.post(config.salesRevenue, dates, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(salesRevenue({ salesRevenue: response.data.totalRevenue }));


        } catch (error) {
            return error?.response?.data;
        }
        finally {
            dispatch(setLoadingState('salesRevenue', false));
        }
    };

    
export const categoryRevenueList = (date) =>

    async (dispatch) => {

        const dates = {
            date: date
        }

        try {
            dispatch(setLoadingState('categoryrevenue', true));
            const response = await axios.post(config.categoryRevenue, dates, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(categoryrevenue({ categoryrevenue: response.data.data }));


        } catch (error) {
            return error?.response?.data;
        }finally {
            dispatch(setLoadingState('categoryrevenue', false));
        }
    };
/**
 * Asynchronous action to fetch a list of upcoming events for a specific date.
 * 
 * @function upcomingEventList
 * @param {string} date - The date for which to fetch upcoming events.
 * @returns {Function} A thunk function that dispatches the upcoming events data to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(upcomingEventList('2024-12-28'));
 */

export const upcomingEventList = (date) =>


    async (dispatch) => {

        const dates = {
            date: date
        }


        try {
            dispatch(setLoadingState('upcomingList', true));
            const response = await axios.post(config.upcomingList, dates, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(upcomingList({ upcomingList: response.data.data }));


        } catch (error) {
            return error?.response?.data;
        }finally {
            dispatch(setLoadingState('upcomingList', false));
        }
    };



/**
 * Redux slice for managing dashboard state.
 * 
 * @constant {Object} dashboardSlice
 * @property {string} name - The name of the slice.
 * @property {Object} initialState - The initial state of the slice.
 * @property {Object} reducers - The reducers for the slice.
 * 
 * @example
 * const store = configureStore({
 *   reducer: {
 *     dashboard: dashboardSlice.reducer
 *   }
 * });
 */

export const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState,
    reducers: {
        latestSales(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        statistics(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        trendingEvents(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        setLoadingState: (state, action) => {
            const { key, value } = action.payload;
            state.loadingStates[key] = value;
        },


        /**
       * Reducer to update the dashboard list in the state.
       * 
       * @function dashboardList
       * @param {Object} state - The current state of the slice.
       * @param {Object} action - The dispatched action containing the new dashboard list.
       * @returns {Object} The updated state with the new dashboard list.
       */
        recentEvent(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        /**
               * Reducer to update the total event dashboard in the state.
               * 
               * @function totalEventDashboard
               * @param {Object} state - The current state of the slice.
               * @param {Object} action - The dispatched action containing the new total event dashboard data.
               * @returns {Object} The updated state with the new total event dashboard data.
               */
        totalEventDashboard(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },

        /**
       * Reducer to update the total events in the state.
       * 
       * @function totalEvent
       * @param {Object} state - The current state of the slice.
       * @param {Object} action - The dispatched action containing the new total events data.
       * @returns {Object} The updated state with the new total events data.
       */
        totalEvent(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },

        /**
 * Reducer to update the total ticket dashboard in the state.
 * 
 * @function totalTicketDashboard
 * @param {Object} state - The current state of the slice.
 * @param {Object} action - The dispatched action containing the new total ticket dashboard data.
 * @returns {Object} The updated state with the new total ticket dashboard data.
 */

        totalTicketDashboard(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },

        /**
         * Reducer to update the sales revenue in the state.
         * 
         * @function salesRevenue
         * @param {Object} state - The current state of the slice.
         * @param {Object} action - The dispatched action containing the new sales revenue data.
         * @returns {Object} The updated state with the new sales revenue data.
         */
        salesRevenue(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        categoryrevenue(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },


        /**
         * Reducer to update the upcoming events list in the state.
         * 
         * @function upcomingList
         * @param {Object} state - The current state of the slice.
         * @param {Object} action - The dispatched action containing the new upcoming events data.
         * @returns {Object} The updated state with the new upcoming events data.
         */

        upcomingList(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },

    }
})



export const { recentEvent, totalEventDashboard, totalTicketDashboard, salesRevenue, upcomingList, totalEvent, statistics, trendingEvents ,latestSales ,categoryrevenue } = dashboardSlice.actions;

export default dashboardSlice.reducer;
