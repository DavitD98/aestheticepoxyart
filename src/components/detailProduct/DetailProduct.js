
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons"
import {faChevronRight} from "@fortawesome/free-solid-svg-icons"

import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { selectProductById, selectProducts } from '../../features/products/productsSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { dialogues } from './detailDialogues'
import { addCart, selectCart, selectIsAdmin, setCart, setUserAlert } from '../../features/user/userSlice'
import { selectToken } from '../../features/token/tokenSlice'
import Product from '../product/Product'
import { selectCategoryById } from '../../features/categories/categoriesSlice'
import { selectTypeById } from '../../features/types/typesSlice'
import RelatedProducts from '../relatedProducts/RelatedProducts'

const DetailProduct = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const products = useSelector(selectProducts)

    const cart = useSelector(selectCart)
    const currentLanguage = useSelector(selectCurrentLanguage)
    const token = useSelector(selectToken)
    const isAdmin = useSelector(selectIsAdmin)
    const product = useSelector(state => selectProductById(state,params?.id))
    const category = useSelector(state => selectCategoryById(state,product?.category))
    const type = useSelector(state => selectTypeById(state,product?.type))

    const [relatedProducts,setRelatedProducts] = useState([])

    //      Get related products
    useEffect(() => {
         let related = products?.filter(item => item.category === product?.category)
         const filteredRelatedProducts = related.filter(item => item?._id !== product?._id)
         setRelatedProducts(filteredRelatedProducts)

    },[product])
    
    //       Add cart
    const handleAddCart = async() => {
        dispatch(setUserAlert(""))
        const alreadyExists = cart.find(item => item._id === product._id)

        if(alreadyExists){
            return dispatch(setUserAlert(dialogues.alreadyAdded))
        }
        dispatch(setCart({...product,quantity:1}))

        const parameters = {
            cart:[...cart,{...product,quantity:1}],
            token:token
        }
        dispatch(addCart({parameters}))        
    }


  return (
    <div className='detail_main'>
      <div className='detail_product'>
        <div className='detail_image_section'>
            <img src={product?.images?.url} alt="product image"/>
        </div>

        <div className='detail_main_info_section'>
            <h3>
              {dialogues.productId[currentLanguage]}
               {product?.productId}
              </h3>
            <h2>
                  {product?.name?.[currentLanguage].toUpperCase()}
            </h2>
            <p>{product?.description?.[currentLanguage]}</p>

            <span className='detail_price'>{product?.price} {dialogues?.armCurrency?.[currentLanguage]}</span>

            <div className='category_info'>
              <p><span>{dialogues.category[currentLanguage]}</span> - {category?.name[currentLanguage]}</p>
              <p><span>{dialogues.type[currentLanguage]}</span> - {type?.name[currentLanguage]}</p>
            </div>

            {!isAdmin && <button className='btn btnBlack'
                            onClick={handleAddCart}>
                             {dialogues?.addCartBtn?.[currentLanguage]}
                         </button>
             }
        </div>
      </div>


   {
    relatedProducts?.length && 
     <div className='releated_products'>
          <h3>{dialogues?.relatedProducts[currentLanguage]}</h3>
          {
            relatedProducts?.length &&  <RelatedProducts relatedProducts={relatedProducts} />
          }
          
      </div>
     }
    </div>
  )
}

export default DetailProduct