import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


const initialState = {
    token:localStorage.getItem(`token`) || null,
}


export const tokenSlice = createSlice({
    name:"token",
    initialState,
    reducers:{},
})

export const selectToken = state => state.token.token

export default tokenSlice.reducer