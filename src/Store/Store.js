import { configureStore } from "@reduxjs/toolkit";
import activateReducer from "./Filter/Activate";

export const Store = configureStore({
    reducer: {
        activate: activateReducer,
    },
});