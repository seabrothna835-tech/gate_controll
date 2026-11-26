import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gateIn: false,
    gateOut: false,
    gateOutCallId: null,
};

export const Activate = createSlice({
    name: "activate",
    initialState,
    reducers: {
        setGateIn: (state, action) => {
            state.gateIn = action.payload;
        },
        setGateOut: (state, action) => {
            state.gateOut = action.payload;
        },
        setGateOutCallId: (state, action) => {
            state.gateOutCallId = action.payload;
        },
    },
});

export const { setGateIn, setGateOut, setGateOutCallId } = Activate.actions;

export default Activate.reducer;