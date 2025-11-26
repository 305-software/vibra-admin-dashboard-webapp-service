/**
 * Role Permission Slice
 * 
 * A Redux slice that manages the state related to role permissions. It includes 
 * asynchronous actions for creating, editing, listing, and deleting roles and permissions, 
 * as well as fetching feature lists. The slice provides reducers to update the respective 
 * parts of the role permission state.
 * 
 * @module rolePermissionSlice
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { toast } from 'react-toastify';

import config from "../config";


/**
 * Initial state for the role permission slice.
 * 
 * @constant {Object} initialState
 * @property {Array} rolePermissonCreate - An array to hold created role permissions.
 * @property {Array} roleList - An array to hold the list of roles.
 * @property {Array} featuresList - An array to hold features available.
 * @property {Array} permissionList - An array to hold permissions.
 * @property {Array} createRole - An array to hold created roles.
 * @property {Array} rolePermissionList - An array to hold role permissions.
 * @property {Array} editRolePermission - An array to hold edited role permissions.
 * @property {Array} permissionListById - An array to hold permission details by ID.
 * @property {Array} deleteRolePermissionList - An array to hold deleted role permissions.
 */

const initialState = {
    rolePermissonCreate: [],
    roleList: [],
    featuresList: [],
    permissionList: [],
    createRole: [],
    rolePermissionList: [],
    editRolePermission: [],
    permissionListById: [],
    deleteRolePermissionList: [],
    updateRole: [],
    getRoleById: [],
    deleteRole: []


}


/**
 * Asynchronous action to create role permission details.
 * 
 * @function rolePermissionDetails
 * @param {Object} data - The data for creating role permissions.
 * @returns {Promise<Object>} The created role permission data.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(rolePermissionDetails(data));
 */
export const rolePermissionDetails = createAsyncThunk(
    'rolePermission/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(config.rolePermission, data, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            return response.data; // Return the response data
        } catch (error) {
            return rejectWithValue(error.response.data); // Reject with error data
        }
    }
);

/**
 * Asynchronous action to edit role permissions.
 * 
 * @function editRoleList
 * @param {Object} data - An object containing the role ID and data to edit.
 * @returns {Promise<Object>} The edited role permission data.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(editRoleList({ id: '123', ...payload }));
 */
export const editRoleList = createAsyncThunk(
    'rolePermission/edit',
    async (data, { rejectWithValue }) => {
        const { ...payload } = data;
        try {
            const response = await axios.post(`${config.rolePermission}`, payload, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            return response.data; // Return the response data
        } catch (error) {
            return rejectWithValue(error.response.data); // Reject with error data
        }
    }
);

/**
 * Asynchronous action to create a new role.
 * 
 * @function createRoleList
 * @param {string} data - The name of the role to create.
 * @returns {Function} A thunk function that dispatches the created role to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(createRoleList('Admin'));
 */

export const createRoleList = (data) =>

    async (dispatch) => {

        const details = {
            "roleName": data
        }

        try {
            const response = await axios.post(config.roleCreate, details, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(createRole({ createRole: response.data.data }));
            await dispatch(roleListDetails());

        } catch (error) {

            return error?.response?.data;
        }
    };





export const updateRoles = createAsyncThunk(
    'rolePermission/updateRole',
    async ({ id, formValues }, { rejectWithValue }) => {  // Accept a single object parameter
        try {

            const response = await axios.put(
                `${config.roleCreate}/${id}`,  // Use PUT request for updating data
                formValues,  // Send formValues as the request body
                {
                    withCredentials: true,
                    headers: {
                        'Accept-Language': localStorage.getItem("preferredLanguage"),
                    },
                }
            );

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);



export const getRoleByIdDetails = (id) =>

    async (dispatch) => {


        try {
            const response = await axios.get(`${config.roleCreate}/${id}`, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(getRoleById({ getRoleById: response.data.data }));
        } catch (error) {
            return error?.response?.data
        }
    }



export const deleteRoleDetails = createAsyncThunk(
    'user/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${config.roleCreate}/${userId}`, {
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
 * Asynchronous action to fetch the list of role permissions.
 * 
 * @function rolePermissionListDetails
 * @returns {Function} A thunk function that dispatches the role permissions list to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(rolePermissionListDetails());
 */

export const rolePermissionListDetails = () =>

    async (dispatch) => {

        try {
            const response = await axios.get(config.rolePermission, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(rolePermissionList({ rolePermissionList: response.data.data }));
        } catch (error) {
            return error?.response?.data;
        }
    };

/**
 * Asynchronous action to fetch the list of roles.
 * 
 * @function roleListDetails
 * @returns {Function} A thunk function that dispatches the role list to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(roleListDetails());
 */
export const roleListDetails = () =>

    async (dispatch) => {

        try {
            const response = await axios.get(config.roleList, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(roleList({ roleList: response.data.data }));
        } catch (error) {
            return error?.response?.data;
        }
    };


/**
 * Asynchronous action to fetch the list of features.
 * 
 * @function featuresListDetails
 * @returns {Function} A thunk function that dispatches the features list to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(featuresListDetails());
 */

export const featuresListDetails = () =>

    async (dispatch) => {

        try {
            const response = await axios.get(config.features, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(featuresList({ featuresList: response.data.data }));
        } catch (error) {
            return error?.response?.data;
        }
    };

/**
 * Asynchronous action to fetch the list of permissions.
 * 
 * @function permissionListDetails
 * @returns {Function} A thunk function that dispatches the permissions list to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(permissionListDetails());
 */
export const permissionListDetails = () =>

    async (dispatch) => {

        try {
            const response = await axios.get(config.permission, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });
            dispatch(permissionList({ permissionList: response.data.data }));
        } catch (error) {
            return error?.response?.data;
        }
    };
/**
 * Asynchronous action to fetch role permissions by ID.
 * 
 * @function permissionListDetailsById
 * @param {string} id - The ID of the role permission to fetch.
 * @returns {Function} A thunk function that dispatches the permission details to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(permissionListDetailsById('12345'));
 */


export const permissionListDetailsById = (id) => async (dispatch) => {
    const url = `${config.rolePermission}/${id}`;

    try {
        const response = await axios.get(url, {
            withCredentials: true,
            headers: {
                'Accept-Language': localStorage.getItem("preferredLanguage"),
            },
        });
        // Dispatch the action with the fetched data
        dispatch(permissionListById({ permissionListById: response.data }));
    } catch (error) {
        console.error("Error fetching permission details:", error); // Log the error for debugging
        return error?.response?.data; // Return the error response data if available
    }
};


/**
 * Asynchronous action to delete a role permission.
 * 
 * @function deleteRolePermissionDetails
 * @param {string} roleId - The ID of the role permission to delete.
 * @returns {Function} A thunk function that dispatches the deleted role permission to the store.
 * 
 * @async
 * @throws {Object} An error object if the request fails, containing error details.
 * 
 * @example
 * dispatch(deleteRolePermissionDetails('12345'));
 */
export const deleteRolePermissionDetails = (roleId) =>


    async (dispatch) => {

        try {
            const response = await axios.delete(`${config.rolePermission}/${roleId}`, {
                withCredentials: true,
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                },
            });

            dispatch(deleteRolePermissionList({ deleteRolePermissionList: response.data.data }));
          
        } catch (error) {
          
            return error?.response?.data;
        }
    };

/**
 * Redux slice for managing role permissions state.
 * 
 * @constant {Object} rolePermissionSlice
 * @property {string} name - The name of the slice.
 * @property {Object} initialState - The initial state of the slice.
 * @property {Object} reducers - The reducers for the slice.
 * 
 * @example
 * const store = configureStore({
 *   reducer: {
 *     rolePermission: rolePermissionSlice.reducer
 *   }
 * });
 */

export const rolePermissionSlice = createSlice({
    name: 'rolePermission',
    initialState,
    reducers: {
        rolePermissonCreate(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        getRoleById(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        roleList: (state, action) => {
            state.roleList = action.payload.roleList;  // Directly update the array
        },
        updateRole(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        featuresList(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        permissionList(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        createRole(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        editRolePermission(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        rolePermissionList(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        permissionListById(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        resetPermissionList: (state) => {
            state.permissionListById = {};
        },
        deleteRolePermissionList(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        deleteRole(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder
         
            .addCase(rolePermissionDetails.fulfilled, (state, action) => {
                state.rolePermissonCreate = action.payload;
                // Handle success (e.g., show success toast)
            })
            .addCase(rolePermissionDetails.rejected, (state, action) => {
                // Handle error (e.g., show error toast)
                toast.error(action.payload.message);
            })
            .addCase(editRoleList.fulfilled, (state, action) => {
                state.editRolePermission = action.payload;
                // Handle success...
            })
            .addCase(editRoleList.rejected, (state, action) => {
                // Handle error...
                toast.error(action.payload.message);
            })
            .addCase(updateRoles.fulfilled, (state, action) => {
                state.updateRole = action.payload;
                // Handle success...
            })
            .addCase(updateRoles.rejected, (state, action) => {
                // Handle error...
                toast.error(action.payload.message);
            })
            .addCase(deleteRoleDetails.fulfilled, (state, action) => {
                state.deleteRole = action.payload;
                // Handle success...
            })
            .addCase(deleteRoleDetails.rejected, (state, action) => {
                // Handle error...
                toast.error(action.payload.message);
            });
        // Add other cases as needed...
    },
})



export const { rolePermissonCreate, roleList, featuresList, updateRole, permissionList,resetPermissionList, deleteRole, createRole, getRoleById, rolePermissionList, editRolePermission, permissionListById, deleteRolePermissionList } = rolePermissionSlice.actions;

export default rolePermissionSlice.reducer;
