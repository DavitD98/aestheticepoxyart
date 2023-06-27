import React, { useState } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Products from '../../features/products/Products'
import Login from '../auth/Login'
import Register from '../auth/Register'
import { useSelector } from 'react-redux'
import { selectIsAdmin, selectIsLogged, } from '../../features/user/userSlice'
import Order from '../order/Order'
import History from '../history/History'
import DetailProduct from '../detailProduct/DetailProduct'
import NotFound from '../notFound/NotFound'
import CreateProduct from '../CreateProduct/CreateProduct'
import EditProduct from '../editProduct/EditProduct'
import CreateCategory from '../createCategory/CreateCategory'
import OrdersAdmin from '../ordersAdmin/OrdersAdmin'
import AuthEdit from '../authEdit/AuthEdit'
import PassEdit from '../authEdit/PassEdit'

const Pages = () => {
  const isAdmin = useSelector(selectIsAdmin)
  const isLogged = useSelector(selectIsLogged)

  return (
    <Routes>
       <Route path='/' element={<Products/>}/>

       <Route path='/product'>
         <Route path='view/:id' element={<DetailProduct/>}/>
         <Route path='edit/:id' element={isAdmin ? <EditProduct/> : <NotFound/>}/>
         <Route path='create' element={isAdmin ? <CreateProduct/> : <NotFound/>}/>
       </Route>

       <Route path='/category' element={isAdmin ? <CreateCategory/> : <NotFound/>}/>

       <Route path='/user'>
           <Route path='login' element={isLogged ? <NotFound/> : <Login/>}/>
           <Route path='register' element={<Register/>}/>
           <Route path='edit' element={isLogged ? <AuthEdit/> : <NotFound/>}/>
           <Route path='edit/password' element={isLogged ? <PassEdit/> : <NotFound/>}/>
       </Route>
       

       <Route path='/order' element={<Order/>}/> 
       <Route path='/history' element={<History/>}/>

       <Route path='/orders' element={isAdmin ? <OrdersAdmin/> : <NotFound/>}/>
       
       

      
      <Route path='*' element={<NotFound/>}/>
    </Routes>
  )
}

export default Pages