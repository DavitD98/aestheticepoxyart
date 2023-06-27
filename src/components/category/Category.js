import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { selectToken } from '../../features/token/tokenSlice'
import { changeChecked, deleteCategory, selectCategoryById, updateCategory } from '../../features/categories/categoriesSlice'
import { dialogues } from '../CreateProduct/createProductDialogues'
import Types from '../types/Types'
import CreateType from '../createType/CreateType'
import { deleteType, selectAllTypes } from '../../features/types/typesSlice'
import { categoryDialogues } from '../createCategory/categoryDialogues'
import AlertConfirmWindow from '../alertConfirmWindow/AlertConfirmWindow'

const Category = ({id}) => {
    const category = useSelector(state => selectCategoryById(state,id))
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const token = useSelector(selectToken)
    const types = useSelector(selectAllTypes)

    // Editing category data
    const [editCategory,setEditCategory] = useState({})
    const [errorMessage,setErrorMessage] = useState()

    // Edit & create window open,close 
    const [editOpen,setEditOpen] = useState(false)
    const [typesOpen,setTypesOpen] = useState(false)
    const [createTypeOpen,setCreateTypeOpen] = useState(false)


  // For category delete confirmation
    const [confirmDialogue,setConfirmDialogue] = useState({
      message:"",
      confirmed:false
    })


    const enableSubmit = [Boolean(editCategory?.name?.arm),
                          Boolean(editCategory?.name?.eng)].every(value => value)

    const armRegex = /^[\u0531-\u0556\u0561-\u0587\s]+$/i
    const engRegex = /^[A-Za-z\s-]+$/ 

    const inputRefs = useRef({});

    // fill editCategory state with category data to edit 
    useEffect(() => {
         setEditCategory(category)
    },[])

    useEffect(() => {
      // Deletes Category, and its types in backed
      const deleteCategoryAfterConfirm = () => {
           const fetchParameters = {
             id:id,
             token:token
           }
         dispatch(deleteCategory({fetchParameters}))
      }

      // if Confirmed to delete category,deleteCategoryafterConfirm works
      if(confirmDialogue.confirmed){
        deleteCategoryAfterConfirm()
        setConfirmDialogue({
          ...confirmDialogue,
          confirmed:false
        })
      }

    },[confirmDialogue.confirmed])


    // Alerts to confirm to delete Category & its types
     const handleDelete = () => {
      setConfirmDialogue({
        ...confirmDialogue,
        message:categoryDialogues.deleteAlert
      })
      // setDeletingCategoryId(id)
     }
     
     
     const handleChangeName = (e) => {
      setErrorMessage()
      setEditCategory({
        ...editCategory,
        name:{
          ...editCategory.name,
          [e.target.name] : e.target.value
        }
      })  
      
      if(e.target.name === "arm" && e.target.value.length > 0){
             if(!armRegex.test(e.target.value)){
                setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
                return
             }else{
               setEditCategory({
                 ...editCategory,
                 name:{
                   ...editCategory.name,
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
            setEditCategory({
              ...editCategory,
              name:{
                ...editCategory.name,
                [e.target.name]:e.target.value
              }
           })
          }
        }
    }
     
    const handleSubmit = async (e) => {
      
      e.preventDefault()
      if(enableSubmit){
        const fetchParameters = {
          editedCategory:editCategory,
          token:token
        }
        dispatch(updateCategory({fetchParameters}))
        setEditOpen(false)
      }else{
        const nameObject = editCategory?.name
        for(const key in nameObject){
          if(!nameObject[key]){
           inputRefs.current[key].style.outline = "1px solid red"
          }else{
           inputRefs.current[key].style.border = "initial"

          }
        }
      }
      
    }

    
  return (
    <li>
        {
         confirmDialogue.message && 
               <AlertConfirmWindow confirmDialogue={confirmDialogue} 
               setConfirmDialogue={setConfirmDialogue}/>
        }
      

             <input type='checkbox' className='check'
                    checked={category?.checked}
                    onChange={() => dispatch(changeChecked({id:category?._id,value:!category?.checked}))}/>
              <span>  {category?.name[currentLanguage]}</span>
              
               <div className='category_btns'>
                    <button className='btn btnDelete'
                             onClick={handleDelete}
                    >
                               {categoryDialogues.categories.delete[currentLanguage]}
                   </button>
      
                   <button className={editOpen ? "btn btnWhite" : "btn btnBlack"}
                           onClick={() => setEditOpen(!editOpen)}>
                    {
                       editOpen ? categoryDialogues.categories.options.close[currentLanguage] 
                       : categoryDialogues.categories.options.edit[currentLanguage]}
                   </button>

                   
                   <button className={typesOpen ? "btn btnWhite" : "btn btnBlack"}
                           onClick={() => setTypesOpen(!typesOpen)}>
                     {
                      typesOpen ? categoryDialogues.categories.options.close[currentLanguage] 
                        : categoryDialogues.categories.options.types[currentLanguage]}
                   </button>
      
                   <button className={createTypeOpen ? "btn btnWhite" : "btn btnBlack"}
                      onClick={() => setCreateTypeOpen(!createTypeOpen)}>
                        {
                          createTypeOpen ? categoryDialogues.categories.options.close[currentLanguage] 
                            : categoryDialogues.categories.options.createType[currentLanguage]
                        }
                      </button>
              </div>
      
      
              <div className={editOpen  
                            ? "edit_category_form_container edit_category_form_container_open" 
                            : "edit_category_form_container edit_category_form_container_close"}>
                      {editOpen &&  <form onSubmit={handleSubmit}>
                                      <span className={errorMessage ? "error_message" 
                                                               : "error_message_inactive"}
                                 >
                                     {errorMessage}
                                 </span>
                                 <input type='text' 
                                   className='text_input'
                                    placeholder={categoryDialogues.editCategory.nameArm[currentLanguage]}
                                    name='arm'
                                    ref={(ref) => (inputRefs.current.arm = ref)}
                                    value={editCategory?.name?.arm}
                                    onChange={handleChangeName}
                                    />
                                  <input type='text' 
                                     className='text_input'
                                     placeholder={categoryDialogues.editCategory.nameEng[currentLanguage]}
                                     name='eng'
                                     ref={(ref) => (inputRefs.current.eng = ref)}
                                     value={editCategory?.name?.eng}
                                    onChange={handleChangeName}
                                   />
                                   <button className='btn btnBlack'>
                                     {categoryDialogues.categories.save[currentLanguage]}
                                   </button>
                          
                            </form>
                  }
             </div>

             <Types categoryId={category?._id} typesOpen={typesOpen}/>
     
             <CreateType createTypeOpen={createTypeOpen} setCreateTypeOpen={setCreateTypeOpen}
                         parentCategoryId={category?._id}/>

     
    </li>
  )
}

export default Category