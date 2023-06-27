import { createAsyncThunk, createSelector, createSlice, current } from "@reduxjs/toolkit"
import axios from "axios";
import BASE_URL from "../../api/baseUrl";


// Thunks 


// Fetch user
export const fetchUser = createAsyncThunk(`user/fetchUser`,async(token) => {
    try{
        const response = await axios.get(`${BASE_URL}/user/infor`,{
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
            throw error
        }
        
    }
} )

// Fetch history
export const fetchHistory = createAsyncThunk(`user/fetchHistory`,async(token) => {
    try{
         const response = await axios.get(`${BASE_URL}/user/history`,{
            headers:{
                Authorization:token
            }
         })
         if(response.data){
            return response.data
         }
    }catch(error){
        if(error.response.data.message){
            console.log(error.response.data.message.eng)
        }else{
            console.log(error.message);
        }
    }
})

// Add cart
export const addCart = createAsyncThunk(`user/addCart`,async({parameters}) => {
    try{
        const {cart,token} = parameters
        const response = await axios.put(`${BASE_URL}/user/add_cart`,{cart:cart},{
            headers:{
                Authorization:token
            }
        })

    }catch(error){
        if(error.response?.data?.message?.eng){
            return error.response.data.message
        }else{
            console.log(error);
        }
    }
})


// Edit 
export const editUser = createAsyncThunk(`user/editUser`,async({fetchParameters}) => {
    try{
        const {user,token,id} = fetchParameters
        const response = await axios.put(`${BASE_URL}/user/edit/${id}`,user,{
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
            throw error
        }
    }
})

// Edit password 
export const editPassword = createAsyncThunk(`user/editPassword`,async({fetchParameters}) => {
    try{
        const {oldPassword,password,token,id} = fetchParameters
        const fetchObject = {
            oldPassword:oldPassword,
            password:password
        }
        const response = await axios.put(`${BASE_URL}/user/passwordEdit/${id}`,fetchObject,{
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
            throw error
        }
    }
})



const initialState = {
    user:null,
    isLogged:localStorage.getItem(`logged`),
    isAdmin:false,
    cart:[],
    history:null,
    userAlert:"",
    userError:"",
    userTokenExpiredMessage:"",
    userStatus:"idle"
}


export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        resetUser(state,action){
            state.user = null
            localStorage.removeItem(`logged`)
            state.isAdmin = false 
            state.cart = []
            state.history = null 
            state.userAlert = ""
            localStorage.removeItem(`token`)
            state.userTokenExpiredMessage = ""
        },
        setUserAlert(state,action){
           state.userAlert = action.payload
        },
        setCart(state,action){
            state.cart = [...state.cart,action.payload]
        },
        resetCart(state,action){
            state.cart = []
        },
        incrementCartProduct(state,action){
            state.cart.forEach(item => {
                if(item._id === action.payload.id){
                    item.quantity++
                    
                }
            })
        },
        decrementCartProduct(state,action){
             state.cart.forEach(item => {
                if(item._id === action.payload.id){
                    if(item.quantity === 1){
                        return
                    }
                    item.quantity --
                }
             })
        },
        removeProductCart(state,action){
            state.cart = state.cart.filter(item => item._id !== action.payload.id)
        },
        setUserError(state,action){
            state.userError = action?.payload
        },
        resetTokenExpireMessage(state,action){
            state.userTokenExpiredMessage = ""
        }
    },
    extraReducers:(builder)=>{
        builder
        // Fetch user
        .addCase(fetchUser.fulfilled,(state,action) => {
            if(action?.payload?._id){
                state.userStatus = "succeed"
                const {_id,firstname,lastname,phone,email,cart,role} = action.payload
                if(role === 1){
                    state.isAdmin = true
                }
                state.cart = cart
                state.user = {
                    firstname,
                    lastname,
                    phone,
                    email,
                    _id
                } 
                
            }
        })
        .addCase(fetchUser.rejected,(state,action)=> {
            if(action?.error?.message){
                state.userTokenExpiredMessage = JSON.parse(action?.error?.message)
            }
        })
        // Fetch history
        .addCase(fetchHistory.fulfilled,(state,action) => {
            if(action.payload){
                state.userStatus = "succeed"
                state.history = action?.payload.sort((a,b) =>new Date(b.date) - new Date(a.date) )
            }
        })
        // Edit user 
        .addCase(editUser.fulfilled,(state,action)=> {
            const {user,message} = action?.payload 
            state.user = user 
            state.userAlert = message
        })
        .addCase(editUser.rejected,(state,action)=> {
            state.userError = JSON.parse(action?.error?.message)
        })
        // Edit password 
        .addCase(editPassword.fulfilled,(state,action) => {
            const {user,message} = action?.payload
            state.userAlert = message 
        })
        .addCase(editPassword.rejected,(state,action) => {
            state.userError = JSON.parse(action?.error?.message)
        })
    }
})

export const selectUser = state => state.user.user
export const selectIsLogged = state => state.user.isLogged
export const selectIsAdmin = state => state.user.isAdmin
export const selectCart = state => state.user.cart
export const selectHistory = state => state.user.history
export const selectUserAlert = state => state.user.userAlert
export const selectUserStatus = state => state.user.userStatus
export const selectUserError = state => state.user.userError
export const selectUserTokenExpiredMessage = state => state.user.userTokenExpiredMessage

export const {resetUser,setUserAlert,setCart,resetCart,setUserError,
              incrementCartProduct,decrementCartProduct,removeProductCart,
              resetTokenExpireMessage} = userSlice.actions
             
export default userSlice.reducer