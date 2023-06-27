import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../api/baseUrl";

// Thunks 

// Fetch Statuses
export const fetchStatuses = createAsyncThunk(`statuses/fetchStatuses`,async() => {
    try{
        const response = await axios.get(`${BASE_URL}/api/status`)
        if(response?.data){
            return response.data
        }

    }catch(error){
        throw error
    }
   
})

// Create Status 
export const createStatus = createAsyncThunk(`statuses/createStatus`,async({fetchParameters}) => {
    try{
        const {status,token} = fetchParameters
        const response = await axios.post(`${BASE_URL}/api/status`,status,{
            headers:{
                Authorization:token
            }
        })

        if(response.data){
            return response.data
        }

    }catch(error){
        if(error?.response?.data?.message){
            throw new Error(JSON.stringify(error?.response?.data?.message))
        }else{
            console.log(error?.message);
        }
    }
})

// Edit Status
export const editStatus = createAsyncThunk(`statuses/editStatus`,async({fetchParameters}) => {
    try{
        const {editedStatus,token} = fetchParameters
        const response = await axios.put(`${BASE_URL}/api/status/${editedStatus._id}`,editedStatus,{
            headers:{
                Authorization:token
            }
        })

        if(response.data){
            return response.data
        }

    }catch(error){
        if(error?.response?.data?.message){
            throw new Error(JSON.stringify(error?.response?.data?.message))
        }else{
            console.log(error?.message);
        }
    }
})

// Delete Status 
export const deleteStatus = createAsyncThunk(`statuses/deleteStatus`,async({fetchParameters}) => {
    try{
        const {id,token} = fetchParameters
        const response = await axios.delete(`${BASE_URL}/api/status/${id}`,{
            headers:{
                Authorization:token
            }
        })
        if(response.data){
            return response.data
        }

    }catch(error){
        throw error
    }
})

const statusesAdapter = createEntityAdapter({
    selectId:(status) => status?._id
})

export const initialState = statusesAdapter.getInitialState({
    statusAlert:""
})

export const statusesSlice = createSlice({
    name:"Status",
    initialState,
    reducers:{
        setStatusAlert(state,action){
            state.statusAlert = action?.payload
        }
    },
    extraReducers:(builder)=> {
        builder 
        // Fetch Statuses
        .addCase(fetchStatuses.fulfilled,(state,action) => {
            if(action?.payload){
                statusesAdapter.setAll(state,action?.payload)
            }
        })
        // Create status
        .addCase(createStatus.fulfilled,(state,action) => {
            const {status,message} = action?.payload
            state.statusAlert = message
            statusesAdapter.addOne(state,status)
        })
        .addCase(createStatus.rejected,(state,action) => {
            state.statusAlert = JSON.parse(action?.error?.message)
        })
        // Edit Status
        .addCase(editStatus.fulfilled,(state,action) => {
           const {status,message} = action?.payload 
           const id = status?._id
           state.statusAlert = message
           statusesAdapter.updateOne(state,{id:id,changes:status})
        })
        .addCase(editStatus.rejected,(state,action)=> {
            state.statusAlert = JSON.parse(action?.error?.message)
        })
        // Delete Status
        .addCase(deleteStatus.fulfilled,(state,action) => {
            const {statuses,message} = action?.payload 
            state.statusAlert = message 
            statusesAdapter.setAll(state,statuses)
        })
    }
})

export const {setStatusAlert} = statusesSlice.actions

export const {
   selectAll:selectStatuses,
   selectById:selectStatusById,
   selectIds:selectStatusesIds
} = statusesAdapter.getSelectors(state => state.statuses)

export const selectStatusAlert = state => state.statuses.statusAlert

export default statusesSlice.reducer