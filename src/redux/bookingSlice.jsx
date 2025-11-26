// bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import config from "../config";

const initialState = {
    bookingList: [],
    loading: false,
    error: null
};

export const bookingListDetails = (payload) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { page = 1, limit = 5, eventCategory, date } = payload;
        const response = await axios.post(
            `${config.bookingList}?page=${page}&limit=${limit}`,
            { eventCategory, date }, {
            withCredentials: true,
            headers: {
                'Accept-Language': localStorage.getItem("preferredLanguage"),
              },
        }

        );
        dispatch(bookingList({ bookingList: response.data.data }));
    } catch (error) {
        dispatch(setError(error?.response?.data || 'An error occurred'));
        return error?.response?.data;
    } finally {
        dispatch(setLoading(false));
    }
};

export const bookingSlice = createSlice({
    name: 'bookingSlice',
    initialState,
    reducers: {
        bookingList(state, action) {
            return {
                ...state,
                ...action.payload,
                error: null
            };
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

export const { bookingList, setLoading, setError } = bookingSlice.actions;
export default bookingSlice.reducer;