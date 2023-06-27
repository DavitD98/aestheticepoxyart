import {
    createEntityAdapter,
    createSlice,
    configureStore,
    createAsyncThunk
  } from '@reduxjs/toolkit'
  import axios from "axios"
import BASE_URL from '../../api/baseUrl'

//                        Thunks 

//                      CATEGORIES
//     Fetch categories 
export const fetchCategories = createAsyncThunk(`categories/fetchCategories`,async() => {
    try{
        const response = await axios.get(`${BASE_URL}/api/category`)
        if(response.data){
            return response.data
        }

    }catch(error){
       throw error
    }
})
//      Create Category 
export const createCategory = createAsyncThunk(`categories/createCategory`,async({fetchParameters}) => {
    try{
        const {category,token} = fetchParameters
        const response = await axios.post(`${BASE_URL}/api/category`,category,{
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

//      Update Category 
export const updateCategory = createAsyncThunk(`categories/editCategory`,async({fetchParameters}) => {
    try{
        const {editedCategory,token} = fetchParameters
        const response = await axios.put(`${BASE_URL}/api/category/${editedCategory?._id}`,editedCategory,{
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
//      Delete Category 
export const deleteCategory = createAsyncThunk(`category/deleteCategory`,async({fetchParameters})=> {
    try{
        const {id,token} = fetchParameters
        const response = await axios.delete(`${BASE_URL}/api/category/${id}`,{
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
} )





const categoriesAdapter = createEntityAdapter({
    selectId:(category) => category._id
})

const initialState = categoriesAdapter.getInitialState({
    categoryAlert:""
})


export const categoriesSlice = createSlice({
    name:"categories",
    initialState,
    reducers:{
        setCategoryAlert(state,action){
            state.categoryAlert = action.payload
        },
        changeChecked(state,action){
            const {id,value} = action.payload 
            categoriesAdapter.updateOne(state,{id:id,changes:{checked:value}})
        }
    },
    extraReducers:(builder) => {
        builder
        //   Get categories
        .addCase(fetchCategories.fulfilled,(state,action) => {
            if(action?.payload){
                categoriesAdapter.setAll(state,action.payload)
            }
        })
        //  Create category
        .addCase(createCategory.fulfilled,(state,action) => {
            const {category,message} = action.payload
            categoriesAdapter.addOne(state,category)
            
            state.categoryAlert = message
        })
        .addCase(createCategory.rejected,(state,action) => {
            state.categoryAlert = JSON.parse(action.error.message)
        })
        //   Update Category 
        .addCase(updateCategory.fulfilled,(state,action) => {
            const {category,message} = action.payload 
            const id = category._id
            categoriesAdapter.updateOne(state,{id:id,changes:category})

            state.categoryAlert = message
        })
        .addCase(updateCategory.rejected,(state,action) => {
            state.categoryAlert = JSON.parse(action?.error?.message)
        })
        //   Delete Category 
        .addCase(deleteCategory.fulfilled,(state,action) => {
            const {message,categories} = action.payload 

            categoriesAdapter.setAll(state,categories)
            state.categoryAlert = message
        })
        .addCase(deleteCategory.rejected,(state,action) => {
            state.categoryAlert = JSON.parse(action.error.message)
        })
    }
})
export const {setCategoryAlert,changeChecked} = categoriesSlice.actions

export const {
   selectAll:selectAllCategories,
   selectById:selectCategoryById,
   selectIds:selectCategoyIds
} = categoriesAdapter.getSelectors(state => state.categories)


export const selectCategories = state => state.categories.categories
export const selectCategoryAlert = state => state.categories.categoryAlert

export default categoriesSlice.reducer 