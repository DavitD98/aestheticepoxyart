import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectProductById } from '../../features/products/productsSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { addCart, decrementCartProduct, incrementCartProduct, removeProductCart, selectCart, setCart } from '../../features/user/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from "@fortawesome/free-solid-svg-icons"
import { selectToken } from '../../features/token/tokenSlice'
import { dialogues } from '../cart/cartDialogues'

const   CartProduct = ({id}) => {
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const cart = useSelector(selectCart)
    const token = useSelector(selectToken)

    const product = cart?.find(item => item._id === id)

    // Follows,if cart in redux updated,calls the addCart function to update cart in backend
    useEffect(() => {
        const parameters = {
          cart:cart,
          token:token
        }
        dispatch(addCart({parameters}))
    
    },[cart])
  

  return (
    <div className='cart_product'>


      <div className='cart_product_image'>
        <img src={product?.images?.url} alt='product image'/>
      </div>

      <div className='cart_product_info'>
        <h4>{product?.name?.[currentLanguage]}</h4>
        <p style={{color:"#ef7215"}}>
            {product?.price * product?.quantity} 
            {dialogues.amCurrency[currentLanguage]}
        </p>
      </div>

        <div className='quantity_section'>
          <button className='cartBtn'
            onClick={() => dispatch(incrementCartProduct({id:product?._id})) }>
              +
          </button>
          <span>{product?.quantity}</span>

          <button className={product?.quantity === 1 ? "cartBtnDisabled" : "cartBtn"} 
          onClick={() => dispatch(decrementCartProduct({id:product?._id}))}
          >
            –
          </button>
        </div>

        <div className='cartBtnDelete' 
             onClick={() =>  dispatch(removeProductCart({id:id}))}>
            <div></div>
            <div></div>
       </div>
        
    </div>
  )
}

export default CartProduct