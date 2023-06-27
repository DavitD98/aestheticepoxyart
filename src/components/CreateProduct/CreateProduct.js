import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectToken } from '../../features/token/tokenSlice'
import { selectAllCategories, selectCategories, selectTypes } from '../../features/categories/categoriesSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import LoadingGif from "../../images/loading gif.gif"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from "@fortawesome/free-solid-svg-icons"
import {faCheck} from "@fortawesome/free-solid-svg-icons"
import {useNavigate} from "react-router-dom"

import axios from 'axios'
import { createProduct, selectProductAlert, setProductAlert } from '../../features/products/productsSlice'
import { dialogues } from './createProductDialogues'
import { selectAllTypes } from '../../features/types/typesSlice'
import BASE_URL from '../../api/baseUrl'


const CreateProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentLanguage = useSelector(selectCurrentLanguage)
  const token = useSelector(selectToken)
  const categories = useSelector(selectAllCategories)
  const types = useSelector(selectAllTypes)

  const [product,setProduct] = useState({
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
  

  const enableSumbit = [Boolean(product?.productId),
                        Boolean(product?.name.arm),Boolean(product?.name.eng),
                        Boolean(product?.description.arm),Boolean(product?.description.eng),
                        Boolean(product?.images.url),Boolean(product?.category),Boolean(product?.type)]
                        .every(value => value)

   // Regexes
   const armRegex = /^[\u0531-\u0556\u0561-\u0587\s]+$/i
   const engRegex = /^[A-Za-z\s-]+$/ 
 
  //      Change values
  const changeNameValue = (e) => {
    setErrorMessage("")
    setErrorMessage("")
    setProduct({
      ...product,
      name:{
        ...product.name,
        [e.target.name]:e.target.value
      }
    })
    if(e.target.name === "arm" && e.target.value.length > 0){
      if(!armRegex.test(e.target.value)){
        setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
        return
      }else{
        setProduct({
          ...product,
          name:{
            ...product.name,
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
        setProduct({
          ...product,
          name:{
            ...product.name,
            [e.target.name]:e.target.value
          }
          
        })
      }
    }
  }
  const changeDescriptionValue =(e) => {
    setErrorMessage("")
    setProduct({
      ...product,
      description:{
        ...product.description,
        [e.target.name]:e.target.value
      }
    })
    if(e.target.name === "arm" && e.target.value.length > 0){
      if(!armRegex.test(e.target.value)){
        setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
        return
      }else{
        setProduct({
          ...product,
          description:{
            ...product.description,
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
        setProduct({
          ...product,
          description:{
            ...product.description,
            [e.target.name]:e.target.value
          }
          
        })
      }
    }
  }

  const changeValues = (e) => {
    setErrorMessage("")
    
    if(e.target.name === "price" && e.target.value.length > 0){
      const numericTester = /^\d+$/
      const isNumeric = numericTester.test(e.target.value)
      if(isNumeric){
        setProduct({
          ...product,
          [e.target.name]:Number(e.target.value)
        })
      }else{
        setErrorMessage(dialogues.languageControl.onlyNumber[currentLanguage])
        return
      }
      
    }else{
      setProduct({
        ...product,
        [e.target.name]:e.target.value
      })
    }
    
  }

  //      Upload & destroy image
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
          setProduct({
            ...product,
            images:response.data
          })
        }

      }catch(error){
           setImageLoading(false)
          if(error?.response?.data?.message){
              setErrorMessage(error?.response?.data?.message?.[currentLanguage])
          }else{
            console.log(error.message);
          }
      }finally{
        setImageLoading(false)
      }
  }

  const destroyImage = async () => {
    setErrorMessage("")
        try{
           const response =  await axios.post(`${BASE_URL}/api/destroy`,{public_id:product?.images?.public_id},{
            headers:{
              Authorization:token
            }
           })

           if(response.data){
             setProduct({
              ...product,
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


  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(enableSumbit){
       const fetchParameters = {
         product:product,
         token:token
       }
       // Check if asynThunks response.payload has product property,navigate to main page
       const response = await dispatch(createProduct({fetchParameters}))
       if(response.payload?.product){
        navigate(`/`)
       }
    }
  }

  return (
    <div className='create_product_main'>
      <p className={errorMessage ? "error_message" : "error_message_inactive"}>{errorMessage}</p>
      <h2>{dialogues.mainHeading[currentLanguage]}</h2>
      
        <div className='create_product'>
             <div className="create_product_image">
              {
                !product?.images?.url && 
                <span className='add_image'>{dialogues.headings.productImage[currentLanguage]}</span>
              }
             
              {product?.images?.url && <FontAwesomeIcon icon={faXmark} size="xl"
                                                          style={{color: "#202020",}} 
                                                          onClick={destroyImage}/>} 
            
              {imageLoading && <img className='logo' src={LoadingGif} alt="loading"/>}
              {
                product?.images?.url && !imageLoading ? <img src={product?.images?.url}
                                                         className='product_image' alt='image uploaded'/>
                                     :  <input type='file' onChange={uploadImage}/>
              }
                
             </div>
    
             <form className='create_product_form' onSubmit={handleSubmit}>
              <div>
                <label>{dialogues.headings.productId[currentLanguage]}</label>
                <div className='input_separator'>
                     <input type='text' 
                            placeholder={dialogues.placeholders.productId[currentLanguage]}
                            name='productId'
                            className='text_input'
                            onChange={changeValues}
                            />
                      {product?.productId && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}
                            
                  </div>
              </div>

              <div>
                <label>{dialogues.headings.name[currentLanguage]}</label>
                     <div className='input_separator'>
                         <input type='text'
                                placeholder={dialogues.placeholders.nameArm[currentLanguage]}
                                name='arm'
                                className='text_input input_with_advice'
                                onChange={changeNameValue}
                                />
                        {product?.name?.arm && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}

                      </div>

                      <div className='input_separator'>
                         <input type='text'
                                placeholder={dialogues.placeholders.nameEng[currentLanguage]}
                                name='eng'
                                onChange={changeNameValue}
                                className='text_input input_with_advice'
                                />
                        {product?.name?.eng && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}

                     </div>
              </div>
    
              <div>
                <label>{dialogues.headings.desc[currentLanguage]}</label>
                <div className='input_separator'>
                    <input type='text'
                           placeholder={dialogues.placeholders.descArm[currentLanguage]}
                           name='arm'
                           className='text_input input_with_advice'
                           onChange={changeDescriptionValue}
                           />
                        {product?.description?.arm && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}

                  </div>

                  <div className='input_separator'>     
                    <input type='text'
                           placeholder={dialogues.placeholders.descEng[currentLanguage]}
                           name='eng'
                           className='text_input input_with_advice'
                           onChange={changeDescriptionValue}
                           />
                        {product?.description?.eng && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}
                  </div>
              </div>

              <div>
                <label>{dialogues.headings.price[currentLanguage]}</label>
                   <div className='input_separator'>
                       <input type='text'
                           placeholder={dialogues.placeholders.price[currentLanguage]}
                           name='price'
                           className='text_input'
                           onChange={changeValues}
                           />
                        {product?.price && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}

                   </div>
              </div>
              
              <div>
                 <div className='input_separator'>
                        <select name='category' className='main_select'  onChange={changeValues}>
                         <option value="">{dialogues.placeholders.category[currentLanguage]}</option>
                         {
                           categories?.map(item => (
                             <option key={item?._id} value={item?._id}>
                               {item?.name[currentLanguage]}
                             </option>
                           ))
                         }
                       </select>
                       {product?.category && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}
  
                 </div>
              </div>

              {
                product?.category && 
                <div>
                      <div className='input_separator'>
                            <select name='type' className='main_select' onChange={changeValues}>
                            <option value="">{dialogues.placeholders.type[currentLanguage]}</option>
                            {
                              types?.map((item) => {
                                 if(item.category === product?.category){
                                  return (
                                    <option key={item?._id} value={item?._id}>
                                    {item?.name[currentLanguage]}
                                  </option>
                                  )
                                 }
                              }
                              
                              )
                            }
                            </select>
                           {product?.type && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} />}
      
                      </div>
                </div>
              }
 
                {enableSumbit && <button className='btn btnWhite'>             
                                    {dialogues.save[currentLanguage]}
                                  </button>}
             </form>
         </div>
    </div>
  )
}

export default CreateProduct