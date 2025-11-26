/**
 * User Slice
 * 
 * This module defines a Redux slice for managing user-related state, including 
 * creating, editing, fetching, and deleting users. It utilizes asynchronous 
 * actions to handle API requests and updates the state accordingly.
 * 
 * @module userSlice
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';

import config from "../config";


/**
 * Initial state for the user slice.
 * 
 * @constant {Object} initialState
 * @property {Array} createUserList - List of created users.
 * @property {Array} listUser - List of all users.
 * @property {Array} editUser - Details of the user being edited.
 * @property {Array} deleteUser - Details of the deleted user.
 * @property {Object} userById - User details fetched by ID.
 * @property {boolean} loading - Indicates loading state for async actions.
 * @property {Object|null} error - Holds error details if an async action fails.
 */

const initialState = {
    createUserList: [],
    listUser: [],
    editUser: [],
    deleteUser: [],
    userById: {},
    loading: false,
    error: null
};


/**
 * Asynchronous action to create a new user.
 * 
 * This function sends a POST request to create a new user and dispatches 
 * success or failure actions based on the response.
 * 
 * @function createUserListDetails
 * @param {Object} formValues - The values for the new user to be created.
 * @returns {Promise<Object>} The created user data.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 */

export const createUserListDetails = createAsyncThunk(
    'user/createUser',
    async (formValues, { rejectWithValue }) => {
        try {
            const response = await axios.post(config.createUser, formValues,{
                withCredentials: true, 
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);



/**
 * Asynchronous action to edit an existing user.
 * 
 * This function sends a PUT request to update user details and dispatches 
 * success or failure actions based on the response.
 * 
 * @function editUserList
 * @param {Object} param - Contains user ID and the updated values.
 * @param {string} param.id - The ID of the user to be updated.
 * @param {Object} param.formValues - The updated values for the user.
 * @returns {Promise<Object>} The updated user data.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 */

export const editUserList = createAsyncThunk(
    'user/editUser',
    async ({ id, formValues }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${config.createUser}/${id}`, formValues,{
                withCredentials: true, 
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);


/**
 * Asynchronous action to fetch all users based on role ID.
 * 
 * This function sends a POST request to get a list of users and dispatches 
 * the result.
 * 
 * @function getUserDetails
 * @param {string} roleId - The ID of the role to filter users.
 * @returns {Promise<Array>} The list of users.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 */
export const getUserDetails = createAsyncThunk(
    'user/getUsers',
    async (roleId, { rejectWithValue }) => {
        const role={
            roleId:roleId
        }
        try {
            const response = await axios.post(config.userList , role,{
                withCredentials: true, 
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);


/**
 * Asynchronous action to fetch user details by ID.
 * 
 * This function sends a GET request to retrieve user details for a specific 
 * user ID.
 * 
 * @function getUserById
 * @param {string} id - The ID of the user to be fetched.
 * @returns {Promise<Object>} The details of the user.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 */


export const getUserById = createAsyncThunk(
    'user/getUserById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${config.createUser}/${id}`,{
                withCredentials: true, 
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);


/**
 * Asynchronous action to delete a user.
 * 
 * This function sends a DELETE request to remove a user and dispatches 
 * success or failure actions based on the response.
 * 
 * @function deleteUser
 * @param {string} userId - The ID of the user to be deleted.
 * @returns {Promise<Object>} The deleted user data.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 */


export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${config.createUser}/${userId}`,{
                withCredentials: true, 
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            toast.success("User Deleted Successfully!", {
                display: 'flex',
                toastId: 'user-action',
                autoClose: 2000,
                closeOnClick: true,
                pauseOnHover: true,
                toastClassName: 'custom-toast',
                bodyClassName: 'custom-toast',
            });
                    
            return response.data.data;
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
            return rejectWithValue(error?.response?.data); 
        }
    }
);


/**
 * Redux slice for managing user state.
 * 
 * @constant {Object} userSlice
 * @property {string} name - The name of the slice.
 * @property {Object} initialState - The initial state of the slice.
 * @property {Object} reducers - The reducers for the slice.
 * @property {Object} extraReducers - Handles actions generated by createAsyncThunk.
 */
const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        deleteUser(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Create User
            .addCase(createUserListDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(createUserListDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.createUserList = action.payload;
                state.error = null;
            })
            .addCase(createUserListDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Edit User
            .addCase(editUserList.pending, (state) => {
                state.loading = true;
            })
            .addCase(editUserList.fulfilled, (state, action) => {
                state.loading = false;
                state.editUser = action.payload;
                state.error = null;
            })
            .addCase(editUserList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get User By Id
            .addCase(getUserById.fulfilled, (state, action) => {
                state.userById = action.payload;
            })
            // Get All Users
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.listUser = action.payload;
            });
    }
});

export default userSlice.reducer;