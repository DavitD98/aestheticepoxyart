
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeChecked, deleteProduct, destroyImage, selectProductById } from '../../features/products/productsSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { dialogues } from './productDialogues'
import { selectToken } from '../../features/token/tokenSlice'
import { addCart, selectCart, selectIsAdmin, setCart, setUserAlert } from '../../features/user/userSlice'
import { Link, useNavigate } from 'react-router-dom'
import { selectCategoryById } from '../../features/categories/categoriesSlice'
import { selectTypeById } from '../../features/types/typesSlice'
import AlertConfirmWindow from '../alertConfirmWindow/AlertConfirmWindow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBagShopping} from "@fortawesome/free-solid-svg-icons"

const Product = React.memo(({id}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const token = useSelector(selectToken)
    const isAdmin = useSelector(selectIsAdmin)
    const cart = useSelector(selectCart)
    const product = useSelector(state => selectProductById(state,id))
    const currentLanguage = useSelector(selectCurrentLanguage)
    const category = useSelector(state => selectCategoryById(state,product?.category))
    const type = useSelector(state => selectTypeById(state,product?.type))

     // Alert question to confirm or deny
     const [confirmDialogue,setConfirmDialogue] = useState({
       message:"",
       confirmed:false
     })
     const [isHovered,setIsHovered] = useState(false)

     const handleMouseEnter = () => {
      setIsHovered(true)
     }
     const handleMouseLeave = () => {
      setIsHovered(false)
     }
  
     useEffect(() => {
         const deleteProductAfterConfirm = async() => {
         // Delete product image from cloudinary
          const destroyParameters = {
            public_id:product?.images?.public_id,
            token:token
          }
          dispatch(destroyImage({destroyParameters}))

          // Delete product
           const fetchParameters = {
             id:id,
             token:token
           }

           const response = dispatch(deleteProduct({fetchParameters}))
           if(response?.payload?.products){
             navigate(`/`)
           }
         }
        if(confirmDialogue.confirmed){
          deleteProductAfterConfirm()
          setConfirmDialogue({
            ...confirmDialogue,
            confirmed:false
          })
        }
     },[confirmDialogue,dispatch,navigate,token])

     // Add cart
    const handleAddCart = async() => {
        dispatch(setUserAlert(""))
        const alreadyExists = cart.find(item => item._id === product._id)

        if(alreadyExists){
            return dispatch(setUserAlert(dialogues.addCart.alreadyAdded))
        }
        dispatch(setCart({...product,quantity:1}))

        const parameters = {
            cart:[...cart,{...product,quantity:1}],
            token:token
        }
        dispatch(addCart({parameters}))        
    }

    // Delete Product (Admin)
    const handleDelete = () => {
      setConfirmDialogue({
        ...confirmDialogue,
        message:dialogues.deleteAlert
      })
    }

    
  return (
    <div className='product_card'>
      {
        confirmDialogue?.message &&  
            <AlertConfirmWindow confirmDialogue={confirmDialogue} 
                                 setConfirmDialogue={setConfirmDialogue}/>
      }

      {
        isAdmin && <input type='checkbox' className='check' checked={product?.checked}
                     onChange={() => dispatch(changeChecked({id:id,value:!product?.checked}))}/>
                   }
      
        <div className='image' onClick={() => navigate(`/product/view/${product?._id}`)}>
            <img src={product?.images?.url} alt="product_image"/>
        </div>

        <div className='card_first_section'>
            <h3>
            {product?.name?.[currentLanguage].charAt(0).toUpperCase()
                  + product?.name?.[currentLanguage].slice(1)}
            </h3>
            <span className='product_card_price'> 
                 {product?.price}
                 {dialogues.amCurrency[currentLanguage]} 
            </span>
        </div>
        
       

        <div className='card_second_section'>
            <p className='product_description'>{product?.description?.[currentLanguage]}</p>
            <div className='category_info'>
            <p>{dialogues.category[currentLanguage]} - {category?.name[currentLanguage]}</p>
            <p>{dialogues.type[currentLanguage]} - {type?.name[currentLanguage]}</p>
           </div>

                 {
                    isAdmin ? 
                    <div className='btn_options'>
                       <Link className='btn btnWhite' to={`/product/edit/${product?._id}`}>
                           {dialogues?.edit[currentLanguage]}
                       </Link>
                       <Link className='btn btnDelete' to="#"
                             onClick={handleDelete} >
                              {dialogues.delete[currentLanguage]}
                        </Link>
                     </div>
                    :   <button className='btn btnBlack' 
                          onClick={handleAddCart}
                          onMouseEnter={handleMouseEnter} 
                          onMouseLeave={handleMouseLeave}>
                            {dialogues.addCart.addCartBtn[currentLanguage]}
                            <FontAwesomeIcon icon={faBagShopping} size="lg" 
                             color={isHovered ? '#323232' : !isHovered ? "#fff" : "#fff"} />
                        </button>
                 
                 }
            
        </div>
     
    </div>
  )
})
export default  Product