/**
 * Event Slice
 * 
 * A Redux slice that manages the state related to events. It includes 
 * asynchronous actions for creating, editing, fetching, and deleting events, 
 * as well as fetching event categories and statuses. The slice provides 
 * reducers to update the respective parts of the event state.
 * 
 * @module eventSlice
 */


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';

import config from "../config";

/**
 * Initial state for the event slice.
 * 
 * @constant {Object} initialState
 * @property {Array} createEvent - An array to hold created event data.
 * @property {Array} editEvent - An array to hold edited event data.
 * @property {Array} createEventById - An array to hold event data fetched by ID.
 * @property {Array} eventCategory - An array to hold event categories.
 * @property {Array} eventList - An array to hold the list of events.
 * @property {Object} eventById - An object to hold event details by ID.
 * @property {Array} eventStatus - An array to hold event statuses.
 * @property {Array} deleteEvent - An array to hold deleted event data.
 */

const initialState = {
    createEvent: [],
    editEvent: [],
    createEventById: [],
    eventCategory: [],
    eventList: [],
    eventById: {},
    eventStatus: [],
    deleteEvent: [],
    loadingStates: {
        createEvent: false,
        editEvent: false,
        fetchEventById: false,
        eventCategory: false,
        eventList: false,
        eventById:false,
        eventStatus: false,
    }
}


/**
 * Asynchronous action to create event details.
 * 
 * @function createEventDetails
 * @param {Object} formData - The form data for creating an event.
 * @returns {Promise<Object>} The created event data.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(createEventDetails(formData));
 */

export const createEventDetails = createAsyncThunk(
    'event/createEventDetails',
    async (formData, {dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoadingState({ key: 'createEvent', value: true }));
            const response = await axios.post(config.createEvent, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    withCredentials: true,
                    'Accept-Language': localStorage.getItem("preferredLanguage"),


                },
            });

            return response.data;
        } catch (error) {

            return rejectWithValue(error?.response?.data);
        }
        finally {
            dispatch(setLoadingState({ key: 'createEvent', value: false }));
        }
    }
);

/**
 * Asynchronous action to edit event details.
 * 
 * @function editcreateEventDetails
 * @param {Object} params - An object containing the event ID and form data.
 * @param {string} params.id - The ID of the event to edit.
 * @param {Object} params.formData - The form data for editing the event.
 * @returns {Promise<Object>} The edited event data.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(editcreateEventDetails({ id: '12345', formData }));
 */

export const editcreateEventDetails = createAsyncThunk(
    'event/editcreateEventDetails',
    async ({ id, formData }, {dispatch, rejectWithValue }) => {
        const url = `${config.createEvent}/${id}`;
        try {
            dispatch(setLoadingState({ key: 'editEvent', value: true }));
            const response = await axios.put(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    withCredentials: true,
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });

            return response.data;
        } catch (error) {

            return rejectWithValue(error?.response?.data);
        }
        finally {
            dispatch(setLoadingState({ key: 'editEvent', value: false }));
        }
    }
);

/**
 * Asynchronous action to fetch event details by ID.
 * 
 * @function CreateEventById
 * @param {string} id - The ID of the event to fetch.
 * @returns {Function} A thunk function that dispatches the event data to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(CreateEventById('12345'));
 */
export const CreateEventById = (id) =>

    async (dispatch) => {
        const url = `${config.createEvent}/${id}`;
        dispatch(setLoadingState({ key: 'fetchEventById', value: true }));
        try {
            const response = await axios.get(url,
                { withCredentials: true,
                    headers: {
                        'Accept-Language': localStorage.getItem("preferredLanguage"),
                      },
                 });
            dispatch(createEventById({ createEventById: response.data.data }));
        } catch (error) {
            return error?.response?.data;
        }finally {
            dispatch(setLoadingState({ key: 'fetchEventById', value: false }));
        }
    };

/**
 * Asynchronous action to fetch event categories.
 * 
 * @function eventCategoryDetails
 * @returns {Function} A thunk function that dispatches the event categories to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(eventCategoryDetails());
 */

export const eventCategoryDetails = () =>

    async (dispatch) => {
        try {
            dispatch(setLoadingState({ key: 'eventCategory', value: true }));
            const response = await axios.get(config.eventCategory, { withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
             });
            dispatch(eventCategory({ eventCategory: response.data.data }));
        } catch (error) {
            return error?.response?.data;
        }finally {
            dispatch(setLoadingState({ key: 'eventCategory', value: false }));
        }
    };


/**
* Asynchronous action to fetch a list of events based on selected category and calendar date.
* 
* @function eventListDetails
* @param {string} selectedCategory - The category of events to filter.
* @param {string} calender - The date for which to fetch events.
* @param {string} userId - The ID of the user.
* @returns {Function} A thunk function that dispatches the event list to the store.
* 
* @async
* @throws {Object} An error object if the request fails, containing error details.
* 
* @example
* dispatch(eventListDetails('Concert', '2024-12-28', 'user123'));
*/

export const eventListDetails = (selectedCategory, calender, userId) =>
    async (dispatch) => {
        const category = {
            'eventCategory': selectedCategory,
            'eventDate': calender,
            'userId': userId,
        }
        try {
            dispatch(setLoadingState({ key: 'eventList', value: true }));

            const response = await axios.post(config.eventList, category, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            dispatch(eventList({ eventList: response.data.data }));
        } catch (error) {
            return error?.response?.data;
        } finally {
            dispatch(setLoadingState({ key: 'eventList', value: false }));
        }
    };

/**
 * Asynchronous action to fetch the list of event statuses.
 * 
 * @function eventStatusList
 * @returns {Function} A thunk function that dispatches the event statuses to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(eventStatusList());
 */

export const eventStatusList = (selectedCategory,date) =>
    async (dispatch) => {
        const category = {
            'eventCategory': selectedCategory,
            'date': date,
        }
        try {
            dispatch(setLoadingState({ key: 'eventStatus', value: true }));
            const response = await axios.post(config.eventStatus, category,{
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            dispatch(eventStatus({ eventStatus: response.data.data.statistics }));
        } catch (error) {
            return error?.response?.data;
        }finally {
            dispatch(setLoadingState({ key: 'eventStatus', value: false }));
        }
    };

/**
 * Asynchronous action to fetch event details by ID.
 * 
 * @function eventByIdList
 * @param {string} formData - The ID of the event to fetch.
 * @returns {Function} A thunk function that dispatches the event details to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(eventByIdList('12345'));
 */
export const eventByIdList = (formData) =>
    async (dispatch) => {

        try {
            dispatch(setLoadingState({ key: 'eventById', value: true }));
            const response = await axios.get(`${config.eventById}?id=${formData}`, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            dispatch(eventById({ eventById: response.data.data }));
        } catch (error) {
            return error?.response?.data;
        }finally {
            dispatch(setLoadingState({ key: 'eventById', value: false }));
        }
    };

/**
 * Asynchronous action to delete an event.
 * 
 * @function deleteEventSliceDetails
 * @param {string} roleId - The ID of the event to delete.
 * @returns {Promise<Object>} The deleted event data.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(deleteEventSliceDetails('12345'));
 */

export const deleteEventSliceDetails = createAsyncThunk(
    'event/deleteEventSliceDetails',
    async (roleId, { rejectWithValue }) => {
       
        try {
         
            const response = await axios.delete(`${config.createEvent}/${roleId}`, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
          
            return response.data; // Return the deleted event data if needed
        } catch (error) {
            toast.error((error?.response?.data?.message), {
                display: 'flex',
                toastId: 'user-action',
                autoClose: 2000,
                closeOnClick: true,
                pauseOnHover: true,
                toastClassName: 'custom-toast',
                bodyClassName: 'custom-toast',
            });
            return rejectWithValue(error?.response?.data); // Use rejectWithValue for error handling
        }
    }
);


/**
 * Redux slice for managing event state.
 * 
 * @constant {Object} eventSlice
 * @property {string} name - The name of the slice.
 * @property {Object} initialState - The initial state of the slice.
 * @property {Object} reducers - The reducers for the slice.
 * 
 * @example
 * const store = configureStore({
 *   reducer: {
 *     event: eventSlice.reducer
 *   }
 * });
 */

export const eventSlice = createSlice({
    name: 'eventSlice',
    initialState,
    reducers: {
        createEvent(state, action) {
            state.createEvent = action.payload.createEvent; // Update state with the new event
        },
        eventCategory(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        setLoadingState(state, action) {
            const { key, value } = action.payload;
            state.loadingStates[key] = value;
        },
        eventList(state, action) {
            state.eventList = action.payload.eventList;
        },
        eventById(state, action) {
            state.eventById = action.payload.eventById;
        },
        eventStatus(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        editEvent(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        createEventById(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
      
        deleteEvent(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },

        extraReducers: (builder) => {
            builder
                .addCase(createEventDetails.fulfilled, (state, action) => {
                    state.createEvent = action.payload; // Set the createEvent state to the response
                })
                .addCase(createEventDetails.rejected, (state, action) => {
                    console.error('Error creating event:', action.payload);
                    toast.error(action.payload.message);
                })
                .addCase(editcreateEventDetails.fulfilled, (state, action) => {
                    state.editEvent = action.payload; // Update the editEvent state
                })
                .addCase(editcreateEventDetails.rejected, (state, action) => {
                    console.error('Error editing event:', action.payload);
                    toast.error(action.payload.message);
                });
        }
    }
})



export const { createEvent, eventCategory, eventList,setLoadingState , eventById, eventStatus, deleteEvent, editEvent, createEventById } = eventSlice.actions;

export default eventSlice.reducer;
