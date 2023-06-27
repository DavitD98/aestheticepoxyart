import { configureStore } from "@reduxjs/toolkit";
import { languageSlice } from "../features/languages/languagesSlice";
import {productsSlice} from "../features/products/productsSlice";
import {userSlice} from "../features/user/userSlice";
import {categoriesSlice} from "../features/categories/categoriesSlice";
import {ordersSlice} from "../features/orders/ordersSlice";
import {typesSlice} from "../features/types/typesSlice";
import {statusesSlice} from "../features/statuses/statusesSlice";
import {tokenSlice} from "../features/token/tokenSlice";




export const store = configureStore({
    reducer:{
        languages:languageSlice.reducer,
        products:productsSlice.reducer,
        user:userSlice.reducer,
        token:tokenSlice.reducer,   
        categories:categoriesSlice.reducer,
        types:typesSlice.reducer,
        orders:ordersSlice.reducer,
        statuses:statusesSlice.reducer
    },
    devTools:false
})