import {
    createEntityAdapter,
    createSlice,
    configureStore,
    createAsyncThunk
  } from '@reduxjs/toolkit'
  import axios from "axios"
import BASE_URL from '../../api/baseUrl'

  //                      Thunks

  // Fetch Types
export const fetchTypes = createAsyncThunk(`types/fetchTypes`,async() => {
    try{
        const response = await axios.get(`${BASE_URL}/api/type`)
        if(response.data){
            return response.data
        }

    }catch(error){
        throw error
    }
})

//   Create type
export const createType = createAsyncThunk(`types/createType`,async ({fetchParameters}) => {
    try{
        const {type,token} = fetchParameters
        const response = await axios.post(`${BASE_URL}/api/type`,type,{
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

//  Edit type
export const updateType = createAsyncThunk(`types/updateType`,async({fetchParameters}) => {
    try{
        const {editedType,token} = fetchParameters
        const response = await axios.put(`${BASE_URL}/api/type/${editedType._id}`,editedType,{
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

//   Delete type
export const deleteType = createAsyncThunk(`types/deleteType`,async({fetchParameters}) => {
    try{
        const {id,token} = fetchParameters
        const response = await axios.delete(`${BASE_URL}/api/type/${id}`,{
            headers:{
                Authorization:token
            }
        })
        if(response?.data){
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


//             Adapter
const typesAdapter = createEntityAdapter({
    selectId:(type) => type._id
})

const initialState = typesAdapter.getInitialState({
    typeAlert:""
})

export const typesSlice = createSlice({
    name:"types",
    initialState,
    reducers:{
        setTypeAlert(state,action){
            state.typeAlert = action.payload
        },
        changeChecked(state,action){
            const {id,value} = action.payload 
            typesAdapter.updateOne(state,{id:id,changes:{checked:value}})
        }
    },
    extraReducers:(builder)=> {
      builder 
      .addCase(fetchTypes.fulfilled,(state,action) => {
        if(action?.payload){
            typesAdapter.setAll(state,action?.payload)
        }  
      })
      //  Create type
      .addCase(createType.fulfilled,(state,action) => {
        const {type,message} = action?.payload
          state.typeAlert = message
          typesAdapter.addOne(state,type)
      })
      .addCase(createType.rejected,(state,action) => {
        state.typeAlert = JSON.parse(action?.error?.message)
      })
      // Update type 
      .addCase(updateType.fulfilled,(state,action) => {
        const {type,message} = action?.payload
        const id = type._id
        typesAdapter.updateOne(state,{id:id,changes:type})
        state.typeAlert = message
      })
      .addCase(updateType.rejected,(state,action) => {
        state.typeAlert = JSON.parse(action?.error?.message)
      })
      // Delete Type
      .addCase(deleteType.fulfilled,(state,action) => {
         const {types,message} = action?.payload 
         state.typeAlert = message
         typesAdapter.setAll(state,types)
      })
      .addCase(deleteType.rejected,(state,action) => {
        state.typeAlert = JSON.parse(action?.error?.message)
      })

    }
})

export const {
   selectAll:selectAllTypes,
   selectById:selectTypeById
} = typesAdapter.getSelectors(state => state.types)

export const {setTypeAlert,changeChecked} = typesSlice.actions

export const selectTypeAlert = state => state.types.typeAlert
export default typesSlice.reducer