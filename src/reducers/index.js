import { combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./cartReducer";
import {categoryReducer} from "./categoryReducer"
import { currencyReducer } from "./currencyReducer";

export default combineReducers({
    cart:cartReducer,
    dataState:categoryReducer,
    currencyState:currencyReducer
});