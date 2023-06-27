import React, { useEffect, useRef, useState } from 'react'
import {faCheck} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { dialogues } from '../CreateProduct/createProductDialogues'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { changeChecked, createCategory, deleteCategory, fetchCategories, selectAllCategories, selectCategories, selectCategoyIds, selectTypes } from '../../features/categories/categoriesSlice'
import { selectToken } from '../../features/token/tokenSlice'
import Category from '../category/Category'
import { selectAllTypes } from '../../features/types/typesSlice'
import AlertConfirmWindow from '../alertConfirmWindow/AlertConfirmWindow'
import { categoryDialogues } from './categoryDialogues'



const CreateCategory = () => {
  const dispatch = useDispatch()
  const currentLanguage = useSelector(selectCurrentLanguage)
  const token = useSelector(selectToken)
  const categories = useSelector(selectAllCategories)
  const categoryIds = useSelector(selectCategoyIds)
  const types = useSelector(selectAllTypes)

  const [category,setCategory] = useState({
    name:{
      arm:"",
      eng:""
    }
  })

  const [errorMessage,setErrorMessage] = useState("")
  const enableSave = [Boolean(category?.name.arm),Boolean(category?.name.eng)].every(value => value)

  const deleteButtonAppear = categories.some(item => item.checked)
  const allChecked = categories.every(category => category?.checked)

  // gets Checked Categories
  const [deletingCategories,setDeletingCategories] = useState()
  const [deletingTypes,setDeletingTypes] = useState()

  const [confirmDialogue,setConfirmDialogue] = useState({
    message:"",
    confirmed:false
  })

  // Fill all checked categories in delteing categories
  useEffect(() => {
     setDeletingCategories(categories?.filter(category => category.checked))
   },[categories])

   useEffect(() => {
      deletingCategories?.forEach(category => {
         setDeletingTypes()
      })
   },[deletingCategories])

 //If confirmed deletes checked categories,then resets confirmed to false
   useEffect(() => {
    const deteleteCheckedCategories = () => {
      deletingCategories?.forEach(category => {
        const fetchParameters = {
         id:category._id,
         token:token
        }
        dispatch(deleteCategory({fetchParameters}))
     })
    }
    if(confirmDialogue?.confirmed){
      deteleteCheckedCategories()
      setConfirmDialogue({
        ...confirmDialogue,
        confirmed:false
      })
    }
      
   },[deletingCategories,confirmDialogue.confirmed])


  const armRegex = /^[\u0531-\u0556\u0561-\u0587\s]+$/i
  const engRegex = /^[A-Za-z\s-]+$/ 
  const inputRefs = useRef([])


  const changeValue = (e) => {
     setCategory({
      ...category,
      name:{
        ...category.name,
        [e.target.name]:e.target.value
      }
     })
      setErrorMessage("")
       if(e.target.name === "arm" && e.target.value.length > 0){
          if(!armRegex.test(e.target.value)){
             setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
             return
          }else{
            setCategory({
              ...category,
              name:{
                ...category.name,
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
          setCategory({
            ...category,
            name:{
              ...category.name,
              [e.target.name]:e.target.value
            }
          })
         }
       }
      
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(enableSave){
      const fetchParameters = {
        category:category,
        token:token
      }
       dispatch(createCategory({fetchParameters}))
       setCategory({
        name:{
          arm:"",
          eng:""
        }
       })
       inputRefs.current.forEach(ref => {
        ref.value = ""
       })
    }
  }

  const handleCheckAll = () => {
    if(allChecked){
      categories?.forEach(category => {
        dispatch(changeChecked({id:category?._id,value:false}))
      })
    }else{
      categories?.forEach(category => {
        dispatch(changeChecked({id:category?._id,value:true}))
      })
    } 
  }

  const handleDeleteAll = () => {
    if(deletingCategories.length > 1){
      setConfirmDialogue({
        ...confirmDialogue,
        message:categoryDialogues.deleteCheckedAlert
      })
    }else{
      setConfirmDialogue({
        ...confirmDialogue,
        message:categoryDialogues.deleteCheckedSingleAlert
      })
    }

  }

  return (
    <div className='create_category_main'>
       {
         confirmDialogue?.message &&  
           <AlertConfirmWindow confirmDialogue={confirmDialogue} 
                               setConfirmDialogue={setConfirmDialogue}/>
       }
      <h2>{categoryDialogues.createCategory.heading[currentLanguage]}</h2>
      <span className={errorMessage ? "error_message" : "error_message_inactive"}>{errorMessage}</span>

      <div className='category_section'>
      <form onSubmit={handleSubmit} className='create_category_form'>
        <div className='input_separator'>
            <input className="text_input" 
                    type="text"
                    placeholder={categoryDialogues.createCategory.placeholders.nameArm[currentLanguage]}
                    name='arm'
                    autoFocus
                    ref={(ref) => (inputRefs.current[0] = ref)}
                    onChange={changeValue}
                  />
             {category?.name?.arm && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} /> }    
        </div>

        <div className='input_separator'>
            <input className="text_input" 
                    type="text"
                    placeholder={categoryDialogues.createCategory.placeholders.nameEng[currentLanguage]}
                    name='eng'
                    ref={(ref) => (inputRefs.current[1] = ref)}
                    onChange={changeValue}
                  /> 
              {category?.name?.eng && <FontAwesomeIcon icon={faCheck} size="xl" style={{color: "#23c90d",}} /> }    
        
        </div>

        {
          enableSave && <button className='btn btnBlack'>
                           {categoryDialogues.createCategory.save[currentLanguage]}
                      </button>
        }
      </form>


      <div className='categories_container'>
        <div className='check_all_delete'>
          <button className='btn btnWhite'
             onClick={handleCheckAll}>
              {categoryDialogues.categories.checkAll[currentLanguage]}
          </button>
          {
            deleteButtonAppear && 
               <button className='btn btnDelete' onClick={handleDeleteAll}>
                  {categoryDialogues.categories.delete[currentLanguage]}
               </button>
            }
        </div>
      

        <h4>{categoryDialogues.categories.heading[currentLanguage]}</h4>

           <ul className='categories_list'>
               {
                 categoryIds?.map(id => <Category key={id}  id={id}/>)
                                                 
               }
           </ul>
      </div>
      </div>

      
    </div>
  )
}

export default CreateCategory