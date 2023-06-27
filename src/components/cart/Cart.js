
import React, { useEffect, useState } from 'react'
import {  useSelector } from 'react-redux'
import { selectCart } from '../../features/user/userSlice'
import CartProduct from '../cartProduct/CartProduct'
import { dialogues } from './cartDialogues'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBagShopping} from "@fortawesome/free-solid-svg-icons"

const Cart = ({cartShow,setCartShow}) => {
  const cart = useSelector(selectCart)
  const currentLanguage = useSelector(selectCurrentLanguage)
  const [cartArray,setCartArray] = useState([])
  const [totalCart,setTotalCart] = useState(0)


  // Total cart
  useEffect(() => {
     const totalValue = cart?.reduce((total,product) => {
            return total + product?.quantity * product?.price
     },0)
     setTotalCart(totalValue)
  },[cart])



  useEffect(() => {
    if(cart){
      const reversedCart = [...cart].reverse()
      setCartArray(reversedCart)
    }
  },[cart])
  

  return (
    <div
      className={cartShow ?  "cart cart_active" 
                : "cart"}>

                           {
                             cartArray?.map((item) => <CartProduct id={item?._id}  key={item?._id}/>)
                           }
        
        {
          cart.length ?    <div className='order_section'>
                               <div className='total'>
                                <span className='cart_total_items'>
                                   {dialogues.totalItems[currentLanguage]}
                                    {cart?.length}
                                 </span>
                                 <span className='cart_total_value'>
                                   {dialogues.totalCart[currentLanguage]}
                                   {totalCart}
                                   {dialogues.amCurrency[currentLanguage]}
                                 </span>
                               </div>
                                 <Link to={`/order`} 
                                  onClick={() => setCartShow(false)}
                                  className='btn btnOrder'>
                                   {dialogues.orderBtn[currentLanguage]}
                                 </Link>
                            </div>
                       
                       : 
                         <div className='empty_cart'>
                            <FontAwesomeIcon icon={faBagShopping} size="2xl" style={{color: "#202020",}} />
                            <span>{dialogues.emptyCart[currentLanguage]}</span>
                          </div>
        }

    </div>
  )
}

export default Cart