

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { resetCart, selectCart, selectIsAdmin, selectUser, setCart } from '../../features/user/userSlice'
import { regions } from './regions'
import { createOrder, selectOrderAlert, selectOrderUserAlert } from '../../features/orders/ordersSlice'
import { selectToken } from '../../features/token/tokenSlice'
import { useNavigate } from 'react-router-dom'
import { dialogues } from './orderDialogues'

const Order = React.memo(() => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const cart = useSelector(selectCart)
    const user = useSelector(selectUser)
    const token = useSelector(selectToken)

    const [order,setOrder] = useState({
      userFirstname:"",
      userLastname:"",
      userPhone:"",
      cart:cart,
      address:{
        home:"",
        street:"",
        city:"",
        region:""
      }
    })
    const inputRefs = {
      userFirstnameInput : useRef(),
      userLastnameInput : useRef(),
      userPhoneInput : useRef(),
      homeInput : useRef(),
      streetInput : useRef(),
      cityInput : useRef(),
      regionInput : useRef(),
    } 
    //  Sets user info depending on  user state
    useEffect(() => {
        setOrder({
          ...order,
          userFirstname:user?.firstname,
          userLastname:user?.lastname,
          userPhone:user?.phone,
          cart:cart,

        })
    },[user,cart])  


    const changeUserInfo = (e) => {
      setOrder({
        ...order,
        [e.target.name] : e.target.value
      })
    }
      
    const changeAddressValues = (e) => {
       setOrder({
        ...order,
        address:{
          ...order.address,
          [e.target.name]:e.target.value
        }
       })
    }

    const handleSubmitOrder = async(e) => {
      e.preventDefault()
        for(const key in order){
          if(!order[key]){
              inputRefs[`${key}Input`].current.style.border = "px solid red"
              inputRefs[`${key}Input`].current.style.outline = "1px solid red"
              return 
            
          }else{
             for(const key in order.address){
              if(!order.address[key]){
                   inputRefs[`${key}Input`].current.style.border = "1px solid red"
                   inputRefs[`${key}Input`].current.style.outline = "1px solid red"
                   return 
              }
             }
          }
        }
        try{
          const fetchParameters = {
            order:order,
            token:token
          }
          const response = await dispatch(createOrder({fetchParameters}))
          if(response.payload?.order){
            navigate(`/`)
            dispatch(resetCart())
          }
        }catch(error){
          console.log(error);
        }
      
    }

  return (
    <div className='order'>
       
      <form className='order_form' onSubmit={handleSubmitOrder}>
        <h4>{dialogues.headings.orderInfo[currentLanguage]}</h4>
            <input type='text'
             name='userFirstname'
             placeholder={dialogues.placeholders.fname[currentLanguage]}
             className='text_input'
             defaultValue={order.userFirstname}
             ref={inputRefs.userFirstnameInput}
             onChange={changeUserInfo}
             />

             <input type='text'
             name='userLastname'
             placeholder={dialogues.placeholders.lname[currentLanguage]}
             className='text_input'
             defaultValue={order.userLastname}
             ref={inputRefs.userLastnameInput}
             onChange={changeUserInfo}/>

             <input type='text'
             name='userPhone'
             placeholder={dialogues.placeholders.phone[currentLanguage]}
             className='text_input'
             defaultValue={order.userPhone}
             ref={inputRefs.userPhoneInput}
             onChange={changeUserInfo}
             />
      
       <div className='address'>
        <h4>{dialogues.headings.address[currentLanguage]}</h4>
        <input type='text'
            name='home'
           placeholder={dialogues.placeholders.home[currentLanguage]}
           className='text_input'
           ref={inputRefs.homeInput}
           onChange={changeAddressValues}
           />
           <input type='text'
             name='street'  
             placeholder={dialogues.placeholders.street[currentLanguage]}
             className='text_input'
             ref={inputRefs.streetInput}
             onChange={changeAddressValues}
             />
              <input type='text'
             name='city'
             placeholder={dialogues.placeholders.city[currentLanguage]}
             className='text_input'
             ref={inputRefs.cityInput}
             onChange={changeAddressValues}
             />


            <select className='main_select' 
               ref={inputRefs.regionInput}
               onChange={changeAddressValues}
               name='region'
               >
              <option value="">{dialogues.placeholders.region[currentLanguage]}</option>
              {
                regions[currentLanguage]?.map((region,index) => (
                  <option value={region} key={index}>{region}</option>
                ))
              }
            </select>
       </div>
        <button type='submit' className='btn btnBlack'>
          {dialogues.approve[currentLanguage]}
        </button>
       </form>
    </div>
  )
})

export default Order