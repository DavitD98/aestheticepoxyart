import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { changeChecked, deleteProduct, destroyImage, selectAvailablePages, selectProductStatus, selectProducts, selectProductsIds, selectTotalProductsNumber} from "../../features/products/productsSlice";
import { useEffect } from "react";
import Product from '../../components/product/Product';

import { selectToken, selectTokenErrorMessage } from '../token/tokenSlice';
import AlertConfirmWindow from '../../components/alertConfirmWindow/AlertConfirmWindow';
import { dialogues } from '../../components/product/productDialogues';
import { selectIsAdmin } from '../user/userSlice';
import Pagination from '../../components/pagination/Pagination';
import Loading from '../../components/loading/Loading';
import { selectCurrentLanguage } from '../languages/languagesSlice';



const Products = () => {
  const dispatch = useDispatch()
  const currentLanguage = useSelector(selectCurrentLanguage)

  const token = useSelector(selectToken)
  const productIds = useSelector(selectProductsIds)
  const products = useSelector(selectProducts)
  const productsStatus = useSelector(selectProductStatus)
  const isAdmin = useSelector(selectIsAdmin)

  const availablePages = useSelector(selectAvailablePages)


  const [isLoading,setIsLoading] = useState(false)


  const [confirmDialogue,setConfirmDialogue] = useState({
    message:"",
    confirmed:false
  })
  const [deletingProducts,setDeletingProducts] = useState()
  const deleteButtonEnable = products?.some(product => product?.checked)

    // Loading
    useEffect(() => {
      if(productsStatus !== "succeed"){
        setIsLoading(true)
      }else{
       setIsLoading(false)
      }
   },[productsStatus])
   

  // Gets checked products as deleting
  useEffect(() => {
    setDeletingProducts(products?.filter(product => product.checked)) 
  },[products])

    //If confirmed deletes checked products,then resets confirmed to false
  useEffect(() => {
      const deleteProductsAfterConfirm = async() => {
        deletingProducts?.forEach(product => {
        
           // Delete product image from cloudinary
           const destroyParameters = {
            public_id:product?.images?.public_id,
            token:token
          }
          dispatch(destroyImage({destroyParameters}))
           // Delete product
           const fetchParameters = {
            id:product._id,
            token:token
          }
           dispatch(deleteProduct({fetchParameters}))
        })
      }

      if(confirmDialogue.confirmed){
        deleteProductsAfterConfirm()
        setConfirmDialogue({
          ...confirmDialogue,
          confirmed:false
        })
      }
  },[confirmDialogue.confirmed,dispatch])
  
  const handleCheckAll = () => {
    const allChecked = products?.every(product => product.checked)
    if(allChecked){
      products?.forEach(product => {
          dispatch(changeChecked({id:product?._id,value:false}))
      })
    }else{
      products?.forEach(product => {
        dispatch(changeChecked({id:product?._id,value:true}))
    })
    }
      
  }

  const handleDeleteChecked = () => {
    // If more than 1 product checked,question is for 1 single product
    if(deletingProducts.length > 1){
      setConfirmDialogue({
        ...confirmDialogue,
        message:dialogues.deleteCheckedAlert
      })
      //else question is for more than 1 products
    }else{
      setConfirmDialogue({
        ...confirmDialogue,
        message:dialogues.deleteCheckedSingle
      })
    } 
  }

  return (
    <main>
      {
        confirmDialogue.message && 
                                 <AlertConfirmWindow confirmDialogue={confirmDialogue}
                                      setConfirmDialogue={setConfirmDialogue}/>
      }
       {
       isAdmin && <div className='products_check_and_delete_btns'>
                    <button className='btn btnBlack' onClick={handleCheckAll}>
                      {dialogues.checkAll[currentLanguage]}
                    </button>
                      {
                         deleteButtonEnable && 
                          <button className='btn btnDelete' onClick={handleDeleteChecked}>
                             {dialogues.delete[currentLanguage]}
                          </button>
                      }
                   </div>
        } 
        {
          isLoading ? <Loading/> 
          : !isLoading && products.length === 0 
          ? <h2 className='no_products_found'>{dialogues.noProductsFound[currentLanguage]}</h2>
           :  <div className='product_container'>
                {
                   productIds?.map(id => <Product key={id} id={id}/>)
                }
              </div>
        }
     
      
      
      {
        availablePages > 1 && <Pagination/>
      }
      
    </main>
  )
}

export default Products