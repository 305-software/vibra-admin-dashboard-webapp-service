import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";

import config from "../config";

// Initial state for the notification slice
const initialState = {
    notification: [],
    notificationRead:[],
};

export const createNotification = createAsyncThunk(
    'notification/create',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(config.notifications,{
                withCredentials: true, 
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const readNotification = createAsyncThunk(
    'notification/read',
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${config.notifications}/${notificationId}`,{
                withCredentials: true, 
                headers: {
                    'Accept-Language': localStorage.getItem("preferredLanguage"),
                  },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice for role permissions and notifications
export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        notificationCreate(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
        notificationRead(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(createNotification.fulfilled, (state, action) => {
            state.notification = [action.payload]; // Replace instead of push
        })
            .addCase(readNotification.fulfilled, (state, action) => {
                state.notificationRead.push(action.payload);
            })
          
    },
});

// Export actions and reducer
export const { notificationCreate ,notificationRead } = notificationSlice.actions;
export default notificationSlice.reducer;
