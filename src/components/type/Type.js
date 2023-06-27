import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentLanguage } from '../../features/languages/languagesSlice';
import { changeChecked, deleteType, updateType } from '../../features/types/typesSlice';
import { selectToken } from '../../features/token/tokenSlice';
import { dialogues } from './typeDialogue';

const Type = ({type}) => {
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const token = useSelector(selectToken)
    const [editType,setEditType] = useState({})
    const [editOpen,setEditOpen] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")

    const armRegex = /^[\u0531-\u0556\u0561-\u0587\s]+$/i
    const engRegex = /^[A-Za-z\s-]+$/ 

    const inputRefs = useRef({})
    const enableSubmit = [editType?.name?.arm,editType?.name?.eng]
                         .map(item => Boolean(item)).every(value => value)

    useEffect(() => {
        setEditType(type)
    },[])

    const handleDelete = () => {
      const fetchParameters= {
        id:type?._id,
        token:token
      }
      dispatch(deleteType({fetchParameters}))
    }

    const changeValues = (e) => {
      inputRefs.current[e.target.name].style.outline = "initial"
      setErrorMessage("")
        setEditType({
          ...editType,
          name:{
            ...editType.name,
            [e.target.name] : e.target.value
          }
        })
        if(e.target.name === "arm" && e.target.value.length > 0){
          if(!armRegex.test(e.target.value)){
            setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
            return
          }else{
            setEditType({
              ...editType,
              name:{
                ...editType.name,
                [e.target.name] : e.target.value
              }
            })
          }
        }
        if(e.target.name === "eng" && e.target.value.length > 0){
          if(!engRegex.test(e.target.value)){
            setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
            return
          }else{
            setEditType({
              ...editType,
              name:{
                ...editType.name,
                [e.target.name] : e.target.value
              }
            })
          }
        }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      if(enableSubmit){
        const fetchParameters = {
          editedType:editType,
          token:token
         }
            dispatch(updateType({fetchParameters}))
            setEditOpen(false)
      }else{
        for(const key in editType?.name){
          if(!editType?.name[key]){
            inputRefs.current[key].style.outline = "1px solid red"
          }else{
            inputRefs.current[key].style.outline = "initial"
          }
        }
      }
    }

    const handleCheck = () => {
       dispatch(changeChecked({id:type?._id,value:!type?.checked}))
    }

  return (
    <li>
       <input type='checkbox' className='check'
          checked={type?.checked} onChange={handleCheck}/>
        <span className='type_name'>{type?.name[currentLanguage]}</span>

        <div className='edit_type_section'>
             <button className='btn btnBlack'
                     onClick={() => setEditOpen(!editOpen)}>
                   {dialogues.edit[currentLanguage]}
               </button>
             
              <div className={
               editOpen ? "edit_type_form_container edit_type_form_container_open"
                        : "edit_type_form_container edit_type_form_container_close"
                 }>
                  { editOpen && 
                     <form onSubmit={handleSubmit}>
                       <input   type='text' 
                                className='text_input'
                                placeholder={dialogues.placeholders.nameArm[currentLanguage]}
                                value={editType?.name?.arm}
                                name='arm'
                                ref={(ref) => (inputRefs.current.arm = ref)}
                                onChange={changeValues}
                                
                                />
                         <input type='text' 
                                className='text_input'
                                placeholder={dialogues.placeholders.nameEng[currentLanguage]}
                                value={editType?.name?.eng}
                                name='eng'
                                ref={(ref) => (inputRefs.current.eng = ref)}
                                onChange={changeValues}
                                />
             
                           <button className='btn btnWhite'>
                            {dialogues.save[currentLanguage]}
                            </button>     
                   </form>
                    }
               </div>
          </div>

        <button className='btn btnDelete'
          onClick={handleDelete}>
           {dialogues.delete[currentLanguage]}
        </button>

        <span className={errorMessage ? 'type_error_message' : "type_error_message_inactive"}>
           {errorMessage}
        </span>
    </li>
  )
}

export default Type