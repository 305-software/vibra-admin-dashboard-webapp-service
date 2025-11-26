import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import config from "../config";

const initialState = {
    customerList: [],
    pagination: {},
    loading: false,
    error: null
};

export const customerListDetails = (payload) => async (dispatch) => {
    const { page = 1, limit = 5, eventCategory, date } = payload;
    
    try {
        // Set loading to true before making the request
        dispatch(setLoading(true));
        
        const response = await axios.post(
            `${config.customerList}?page=${page}&limit=${limit}`,
            { eventCategory, date },{
                withCredentials: true, 
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            }
        );
        
        dispatch(setCustomerList({
            data: response.data.data,
            pagination: response.data.pagination
        }));
        
        return response.data;
    } catch (error) {
        // Dispatch error action instead of just returning
        dispatch(setError(error?.response?.data || 'An error occurred'));
        return error?.response?.data;
    } finally {
        // Remove finally block as loading is handled in reducers
        // dispatch(setLoading(false)); -- Remove this
    }
};

export const customerSlice = createSlice({
    name: 'customerSlice',
    initialState,
    reducers: {
        setCustomerList: (state, action) => {
            state.customerList = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false; // Set loading to false after successful data fetch
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false; // Set loading to false when error occurs
        }
    }
});

export const { setCustomerList, setLoading, setError } = customerSlice.actions;
export default customerSlice.reducer;