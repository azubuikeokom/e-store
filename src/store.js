//configure store with reducer
import {createStore} from "@reduxjs/toolkit"
import {cartReducer} from "./reducers/cartReducer"

export const store=createStore(cartReducer)

