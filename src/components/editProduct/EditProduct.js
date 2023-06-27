import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectToken } from '../../features/token/tokenSlice'
import { selectAllCategories, selectCategories, selectTypes } from '../../features/categories/categoriesSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { editProduct, selectProductById } from '../../features/products/productsSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { dialogues } from '../CreateProduct/createProductDialogues'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from "@fortawesome/free-solid-svg-icons"
import {faCheck} from "@fortawesome/free-solid-svg-icons"

import LoadingGif from "../../images/loading gif.gif"

import axios from 'axios'
import { selectAllTypes } from '../../features/types/typesSlice'
import BASE_URL from '../../api/baseUrl'


const EditProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const product = useSelector(state => selectProductById(state,params.id))
  const currentLanguage = useSelector(selectCurrentLanguage)
  const token = useSelector(selectToken)
  const categories = useSelector(selectAllCategories)
  const types = useSelector(selectAllTypes)

  const [editedProduct,setEditedProduct] = useState({
    productId:"",
    name:{
      arm:"",
      eng:""
    },
    description:{
      arm:"",
      eng:""
    },
    price:"",
    category:"",
    type:"",
    images:{}
  })

  const [errorMessage,setErrorMessage] = useState("")
  const [imageLoading,setImageLoading] = useState(false)


  const enableSumbit = [Boolean(editedProduct?.productId),
    Boolean(editedProduct?.name.arm),Boolean(editedProduct?.name.eng),
    Boolean(editedProduct?.description.arm),Boolean(editedProduct?.description.eng),
    Boolean(editedProduct?.images.url),Boolean(editedProduct?.category),Boolean(editedProduct?.type)]
    .every(value => value)

  const armRegex = /^[\u0531-\u0556\u0561-\u0587\s]+$/i
  const engRegex = /^[A-Za-z\s-]+$/ 

    //     Set editing product values
  useEffect(() => {
    setEditedProduct(product)
  },[params.id])

  //       find product category & type from data
  const category = categories?.find(item => item?._id === editedProduct?.category)
  const type = types?.find(item => item?._id === editedProduct?.type)

  //     Change Values
  const changeNameValue = (e) => {
     setEditedProduct({
          ...editedProduct,
          name:{
            ...editedProduct.name,
            [e.target.name]:e.target.value
          }
         })
    setErrorMessage("")
     if(e.target.name === "arm" && e.target.value.length > 0){
      if(!armRegex.test(e.target.value)){
        setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
        return
      }else{
        setEditedProduct({
          ...editedProduct,
          name:{
            ...editedProduct.name,
            [e.target.name]:e.target.value
          }
         })
      }
     }else if(e.target.name === "eng" && e.target.value.length > 0){
      if(!engRegex.test(e.target.value)){
        setErrorMessage(dialogues.languageControl.onlyEnglish[currentLanguage])
        return
      }else{
        setEditedProduct({
          ...editedProduct,
          name:{
            ...editedProduct.name,
            [e.target.name]:e.target.value
          }
         })
      }
     }

    
  }

  const changeDescriptionValue = (e) => {
    setEditedProduct({
      ...editedProduct,
      description:{
        ...editedProduct.description,
        [e.target.name]:e.target.value
      }
     })
    setErrorMessage("")
    if(e.target.name === "arm" && e.target.value.length > 0){ 
      if(!armRegex.test(e.target.value)){
        setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
        return
      }else{
        setEditedProduct({
          ...editedProduct,
          description:{
            ...editedProduct.description,
            [e.target.name]:e.target.value
          }
         })
      }
     }
     if(e.target.name === "eng" && e.target.value.length > 0){
      if(!engRegex.test(e.target.value)){
        setErrorMessage(dialogues.languageControl.onlyEnglish[currentLanguage])
        return
      }else{
        setEditedProduct({
          ...editedProduct,
          description:{
            ...editedProduct.description,
            [e.target.name]:e.target.value
          }
         })
      }
     }

     setErrorMessage("")
     
    setErrorMessage("")
    setEditedProduct({
      ...editedProduct,
      description:{
        ...editedProduct.description,
        [e.target.name] : e.target.value
      }
    })
  }

  const changeValues = (e) => {
    setEditedProduct({
      ...editedProduct,
      [e.target.name] : Number(e.target.value)
    })
    setErrorMessage("")
    if(e.target.name === "price" && e.target.value.length > 0){
      const numericTester = /^\d+$/
      const isNumeric = numericTester.test(e.target.value)
      if(isNumeric){
        setEditedProduct({
          ...editedProduct,
          [e.target.name] : Number(e.target.value)
        })
      }else{
        return
      }
      
    }else{
      setEditedProduct({
        ...editedProduct,
        [e.target.name] : e.target.value
      })
    }
     
    
  }

  //     Upload & destroy image
  const uploadImage = async(e) => {
    setErrorMessage("")
    try{
      setImageLoading(true)
      const file = e.target.files[0]

      const formData = new FormData()
      formData.append(`file`,file)

      const response = await axios.post(`${BASE_URL}/api/upload`,formData,{
        headers:{
          Authorization:token
        }
      })
      if(response.data){
        setEditedProduct({
          ...editedProduct,
          images:response?.data
        })
      }

    }catch(error){
      if(error.response?.data?.message){
        setErrorMessage(error.response?.data?.message[currentLanguage])
      }else{
        console.log(error.message);
      }
    }finally{
      setImageLoading(false)
    }
  }

  const destroyImage = async (e) => {
    try{
      const response = await axios.post(`${BASE_URL}/api/destroy`,{public_id:editedProduct?.images?.public_id},{
        headers:{
          Authorization:token
        }
      })
      if(response?.data){
         setEditedProduct({
          ...editedProduct,
          images:{}
         })
      }

    }catch(error){
       if(error?.response?.data?.message){
        setErrorMessage(error?.response?.data?.message[currentLanguage])
       }else{
        console.log(error.message);
       }
    }
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if(enableSumbit){
       const fetchParameters = {
         editedProduct:editedProduct,
         token:token
       }
       const response = await dispatch(editProduct({fetchParameters}))
       if(response.payload.product){
          navigate(`/`)
       }
    }else{
      
    }
  }

  return (
     <>
    { editedProduct && <div className='edit_product_main'>
    <p className={errorMessage ? "error_message" : "error_message_inactive"}>{errorMessage}</p>
    <h2>{dialogues.mainHeading[currentLanguage]}</h2>
      <div className='edit_product'>
          
           <div className="edit_product_image">
            {editedProduct?.images?.url &&  <FontAwesomeIcon icon={faXmark} size="xl"
                                                        style={{color: "#202020",}} 
                                                        onClick={destroyImage}
                                                        />} 
          
            {imageLoading && <img className='logo' src={LoadingGif} alt="loading"/>}
            {
              editedProduct?.images?.url && !imageLoading ? <img src={editedProduct?.images?.url}
                                                       className='product_image' alt='image uploaded'/>
                                   :  <input type='file' onChange={uploadImage}/>
            }
           </div>
  
           <form className='edit_product_form' onSubmit={handleSubmit}>
            <div>
              <label>{dialogues.headings.productId[currentLanguage]}</label>
              <div className='input_separator'>
                   <input type='text' 
                          placeholder={dialogues.placeholders.productId[currentLanguage]}
                          name='productId'
                          className='text_input'
                          value={editedProduct?.productId}
                          onChange={changeValues}
                          />
                    {editedProduct?.productId && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}
                          
                </div>
            </div>

            <div>
              <label>{dialogues.headings.name[currentLanguage]}</label>
                   <div className='input_separator'>
                       <input type='text'
                              placeholder={dialogues.placeholders.nameArm[currentLanguage]}
                              name='arm'
                              className='text_input input_with_advice'
                              value={editedProduct?.name?.arm}
                              onChange={changeNameValue}
                              />
                      {editedProduct?.name?.arm && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}

                    </div>

                    <div className='input_separator'>
                       <input type='text'
                              placeholder={dialogues.placeholders.nameEng[currentLanguage]}
                              name='eng'
                              value={editedProduct?.name?.eng}
                              onChange={changeNameValue}
                              className='text_input input_with_advice'
                              />
                      {editedProduct?.name?.eng && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}

                   </div>
            </div>
  
            <div>
              <label>{dialogues.headings.desc[currentLanguage]}</label>
              <div className='input_separator'>
                  <input type='text'
                         placeholder={dialogues.placeholders.descArm[currentLanguage]}
                         name='arm'
                         className='text_input input_with_advice'
                         value={editedProduct?.description?.arm}
                         onChange={changeDescriptionValue}
                         />
                      {editedProduct?.description?.arm && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}

                </div>

                <div className='input_separator'>     
                  <input type='text'
                         placeholder={dialogues.placeholders.descEng[currentLanguage]}
                         name='eng'
                         className='text_input input_with_advice'
                         value={editedProduct?.description?.eng}
                         onChange={changeDescriptionValue}
                         />
                      {editedProduct?.description?.eng && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}
                </div>
            </div>

            <div>
              <label>{dialogues.headings.price[currentLanguage]}</label>
                 <div className='input_separator'>
                     <input type='text'
                         placeholder={dialogues.placeholders.price[currentLanguage]}
                         name='price'
                         className='text_input'
                         value={editedProduct?.price}
                         onChange={changeValues}
                         />
                      {editedProduct?.price && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}

                 </div>
            </div>
            
            <div>
               <div className='input_separator'>
                      <select name='category' className='main_select'  onChange={changeValues}>
                      <option value={category?._id}>
                        {category?.name[currentLanguage]}
                      </option>

                      {
                        categories?.map(item => {
                          if(item?._id !== category?._id){
                            return(
                              <option value={item?._id} key={item?._id}>
                                {item?.name[currentLanguage]}
                              </option>
                            )
                          }
                        })
                      }
                     </select>
                     {editedProduct?.category && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}

               </div>
            </div>

            {
              product?.category && 
              <div>
                    <div className='input_separator'>
                          <select name='type' className='main_select' onChange={changeValues}>
                          <option value={type?._id}>
                            {type?.name[currentLanguage]}
                          </option>
                          {
                            types?.map((item => {
                              if(item?._id !== type?._id && editedProduct?.category === item?.category){
                                return(
                                  <option value={item?._id} key={item?._id}>
                                    {item?.name[currentLanguage]}
                                  </option>
                                )
                              }
                            }))
                          }
                          </select>
                         {editedProduct?.type && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}
    
                    </div>
              </div>
            }

                  {enableSumbit && <button className='btn btnWhite' type='submit'>
                                       {dialogues.save[currentLanguage]}
                                   </button>}
           </form>
       </div>
  </div>}
  </>
  )
}

export default EditProduct