import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentBooking: {
        seva: null,
        date: null,
        devoteeDetails: null,
    },
    cart: [],
    loading: false,
    error: null,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        selectSeva: (state, action) => {
            state.currentBooking.seva = action.payload;
        },
        updateBookingDate: (state, action) => {
            state.currentBooking.date = action.payload;
        },
        clearBooking: (state) => {
            state.currentBooking = initialState.currentBooking;
        },
    },
});

export const { selectSeva, updateBookingDate, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
