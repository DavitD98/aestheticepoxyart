import {
    createEntityAdapter,
    createSlice,
    configureStore,
    createAsyncThunk
  } from '@reduxjs/toolkit'
  import axios from "axios"
import BASE_URL from '../../api/baseUrl'

  //              Thunks 

//   Get products
export const fetchProducts = createAsyncThunk(`products/fetchProducts`,async ({fetchParameters}) => {
    try{ 
        // If there is no one of these queryNames in fetchParameters,it creates the queryName in fetchparameters,as it can't be undefined
        const queryNames = ["category","type","sort","priceFrom","priceTo","page","search"]
        queryNames?.map(name => {
            if(!fetchParameters.hasOwnProperty(name)){
                fetchParameters[`${name}`] = ""
            }
        })
        const {category,type,sort,priceFrom,priceTo,page,search} = fetchParameters

        const response = await axios.get(
            `${BASE_URL}/api/products?${category}&${type}&${sort}&${priceFrom}&${priceTo}&${page}&${search}`
            )

        if(response?.data){
            return response.data
        }
        
    }catch(error){
       throw error
    }
})

//   Create product
export const createProduct = createAsyncThunk(`products/createProduct`,async({fetchParameters}) => {
    try{
        const {product,token} = fetchParameters
        const response = await axios.post(`${BASE_URL}/api/products`,product,{
            headers:{
                Authorization:token
            }
        })

        if(response.data){
            return response.data
        }
    }catch(error){
          if(error.response?.data?.message){
            throw new Error(JSON.stringify(error.response.data.message))
            // if Error is string throw new Error(error.response.data.message)
          }else{
            console.log(error.message);
          }
    }
})

//    Edit Product 
export const editProduct = createAsyncThunk(`products/editProduct`,async({fetchParameters}) => {
    try{
        const {editedProduct,token} = fetchParameters
        
        const id = editedProduct._id
        const response = await axios.put(`${BASE_URL}/api/products/${id}`,editedProduct,{
            headers:{
                Authorization:token
            }
        })
        if(response.data){
            return response.data
        }
        
    }catch(error){
        if(error.response?.data?.message){
            throw new Error(JSON.parse(error.response?.data?.message))
        }else{
            console.log(error.message);
        }
    }
})

//    Delete Product
export const deleteProduct = createAsyncThunk(`products/deleteProduct`,async({fetchParameters}) => {
    const {id,token} = fetchParameters
    try{
        const response = await axios.delete(`${BASE_URL}/api/products/${id}`,{
            headers:{
                Authorization:token
            }
        })

        if(response?.data){
            return response.data
        }

    }catch(error){
        if(error.response?.data?.message){
            throw new Error(JSON.parse(error.response?.data?.message))
        }else{
            console.log(error.message);
        }
    }
}) 

//    Destroy image
export const destroyImage = createAsyncThunk(`products/destroyImage`,async({destroyParameters}) => {
    try{
        const {public_id,token} = destroyParameters 
        await axios.post(`${BASE_URL}/api/destroy`,{public_id:public_id},{
            headers:{
             Authorization:token
            }
        })

    }catch(error){
        throw error
    }
})


const productsAdapter = createEntityAdapter({
    selectId:(product) => product._id
})

const initialState = productsAdapter.getInitialState({
    result:null,
    errorMessage:"",
    productAlert:"",
    status:"idle", //loading,succeed,failed,
    availablePages:null,
    totalProducts:null,
   
    filters:{
        category:"",
        type:"",
        sort:"",
        priceFrom:"",
        priceTo:"",
        search:"",
        page:""
    }
   
})

export const productsSlice = createSlice({
    name:"products",
    initialState,
    reducers:{
        setProductAlert(state,action){
           state.productAlert = action.payload
        },
        changeChecked(state,action){
            const {id,value} = action.payload
            productsAdapter.updateOne(state,{id:id,changes:{checked:value}})
        },
        // Change, Filters 
        changeCategory(state,action){
            state.filters.category = action.payload
        },
        changeType(state,action){
            state.filters.type = action.payload
        },
        changeSort(state,action){
            state.filters.sort = action.payload
        },
        changePriceFrom(state,action){
            state.filters.priceFrom = action.payload
        },
        changePriceTo(state,action){
            state.filters.priceTo = action.payload
        },
        changeSearch(state,action){
            state.filters.search = action.payload
        },
        changePage(state,action){
            state.filters.page = action.payload
        },
    },
    extraReducers(builder){
        builder
        //   Get products
        .addCase(fetchProducts.pending,(state,action) => {
            state.status = "Loading"
        })
        .addCase(fetchProducts.rejected,(state,action) => {
            state.status = "failed"
        })
        .addCase(fetchProducts.fulfilled,(state,action) => {
            if(action?.payload?.status === "succeed"){
                const {products,result,status,totalProducts,pageLimit} = action?.payload
                
                productsAdapter.setAll(state,products)
                state.result = result
                state.status = status
                // Geting all filtered or not filtered products quantity 
                state.totalProducts = totalProducts
                // Calculating total pages that can be displayed,depended on total products number divided by page limit
                state.availablePages = Math.ceil(totalProducts / pageLimit)

            }
        })
        //           Create product 
        .addCase(createProduct.fulfilled,(state,action) => {
            const {message,product} = action.payload
                state.productAlert = message
                productsAdapter.addOne(state,product)
            
        })
        .addCase(createProduct.rejected,(state,action) => {
           state.productAlert = JSON.parse(action.error.message)
        })
        //           Edit product
        .addCase(editProduct.fulfilled,(state,action) => {
            const {product,message} = action.payload
            const id = product._id
            productsAdapter.updateOne(state, { id:id, changes:product })
            state.productAlert = message
        })
        .addCase(editProduct.rejected,(state,action) => {
            state.productAlert = JSON.parse(action.error.message)
        })
        //          Delete product 
        .addCase(deleteProduct.fulfilled,(state,action) => {
            const {products,message} = action.payload 
            productsAdapter.setAll(state,products)
            state.productAlert = message
        })
        .addCase(deleteProduct.rejected,(state,action) => {
            state.errorMessage = JSON.parse(action.error.message)
        })
    }
})

export const {
    selectAll:selectProducts,
    selectById:selectProductById,
    selectIds:selectProductsIds
} = productsAdapter.getSelectors(state => state.products)


export const selectResult = state => state.products.result
export const selectProductErrorMessage = state => state.products.errorMessage
export const selectProductAlert = state => state.products.productAlert
export const selectProductStatus = state => state.products.status
export const selectAvailablePages = state => state.products.availablePages
export const selectTotalProductsNumber = state => state.products.totalProducts

export const selectCategory = state => state.products.filters.category
export const selectType = state => state.products.filters.type
export const selectSort = state => state.products.filters.sort
export const selectPriceFrom = state => state.products.filters.priceFrom
export const selectPriceTo = state => state.products.filters.priceTo
export const selectSearch = state => state.products.filters.search
export const selectPage = state => state.products.filters.page


export const {setProductAlert,setCategory,setSearch
              ,setPage,setSort,setPriceFrom,setPriceTo,
              changeChecked,
              // Filters
              changeCategory,changeType,changeSort,changePriceFrom,
              changePriceTo,changeSearch,changePage
              } = productsSlice.actions

export default productsSlice.reducer