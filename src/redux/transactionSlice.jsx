import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import config from "../config";

const initialState = {
    transactionList: [],
    pagination: {
        currentPage: 1,
        itemsPerPage: 5,
        totalPages: 1,
        totalItems: 0
    },
    loading: false,
    error: null
};

export const fetchTransactionList = (payload = {}) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        // Ensure default values for pagination
        const page = payload.page || 1;
        const limit = payload.limit || 5;
        
        // Build request body with only necessary fields
        const requestBody = {};
        if (payload.eventCategory) requestBody.eventCategory = payload.eventCategory;
        if (payload.date) requestBody.date = payload.date;

        const response = await axios.post(
            `${config.transactionList}?page=${page}&limit=${limit}`,
            requestBody,{
                withCredentials: true, 
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            }
        );

        if (response.data) {
            dispatch(setTransactionList({
                data: response.data.data || [],
                pagination: {
                    ...initialState.pagination,
                    ...response.data.pagination
                }
            }));
        }
    } catch (error) {
        dispatch(setError(error?.response?.data || 'An error occurred'));
        return error?.response?.data;
    } finally {
        dispatch(setLoading(false));
    }
};

export const transactionSlice = createSlice({
    name: 'transactionSlice',
    initialState,
    reducers: {
        setTransactionList: (state, action) => {
            state.transactionList = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { setTransactionList, setLoading, setError } = transactionSlice.actions;
export default transactionSlice.reducer;