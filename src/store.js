//configure store with reducer
import {createStore} from "@reduxjs/toolkit"
import combineReducer from "./reducers/index"

export const store=createStore(combineReducer)

