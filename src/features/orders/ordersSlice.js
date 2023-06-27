import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import userSlice from "../user/userSlice";
import BASE_URL from "../../api/baseUrl";


//Thunk 
export const fetchOrders = createAsyncThunk(`orders/fetchOrders`,async(token) => {
    try{
        const response = await axios.get(`${BASE_URL}/api/order`,{
            headers:{
                Authorization:token
            }
        })
        if(response.data){
            return response.data
        }

    }catch(error){
        if(error?.response?.data?.message){
            console.log(error?.response?.data?.message?.eng);
        }else{
            console.log(error.message);
        }
    }
})

export const createOrder = createAsyncThunk(`orders/createOrder`,async({fetchParameters}) => {
    try{
        const {order,token} = fetchParameters
        const response = await axios.post(`${BASE_URL}/api/order`,{...order},{
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
            console.log(error.message);
        }
    }
})

export const editOrder = createAsyncThunk(`orders/editOrder`,async({fetchParameters}) => {
    try{
        const {editedOrder,token} = fetchParameters
        const id = editedOrder?._id
        const response = await axios.patch(`${BASE_URL}/api/order/${id}`,editedOrder,{
            headers:{
                Authorization:token
            }
        })
        if(response?.data){
            return response?.data
        }
        
    }catch(error){
        if(error?.response?.data?.message){
            throw new Error(JSON.stringify(error?.response?.data?.message))
       }else{
           console.log(error.message);
       }
    }
})

const ordersAdapter = createEntityAdapter({
    selectId:(order) => order._id,
    sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = ordersAdapter.getInitialState({
    orderAlert:""
})


export const ordersSlice = createSlice({
    name:"orders",
    initialState,
    reducers:{
        setOrderAlert(state,action){
            state.orderAlert = action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchOrders.fulfilled,(state,action) => {
            if(action?.payload){
                ordersAdapter.setAll(state,action?.payload)
            }
        })
        .addCase(createOrder.fulfilled,(state,action) => {
            const {message,order} = action.payload
            state.orderAlert = message
            ordersAdapter.addOne(state,order)
        })
        .addCase(createOrder.rejected,(state,action) => {
           state.orderAlert = JSON.parse(action?.error.message)
        })
        // Edit Order 
        .addCase(editOrder.fulfilled,(state,action)=> {
            console.log(action.payload);
            const {order,message} = action?.payload 
            const id = order?._id
            ordersAdapter.updateOne(state,{id:id,changes:order})
            state.orderAlert = message
        })
        .addCase(editOrder.rejected,(state,action) => {
            state.orderAlert = JSON.parse(action?.error?.message)
        })

        
    }
})
export const {
    selectAll:selectOrders,
    selectById:selectOrderById,
    selectIds:selectOrdersIds

} = ordersAdapter.getSelectors(state => state.orders)



export const selectSortedOrders = createSelector(
    selectOrders,
    (orders) => orders.sort((a, b) => b.date.localeCompare(a.date))
  );

export const {setOrderAlert} = ordersSlice.actions
export const selectOrderAlert = state => state.orders.orderAlert
export default ordersSlice.reducer