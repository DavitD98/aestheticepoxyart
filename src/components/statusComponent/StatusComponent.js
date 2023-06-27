import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editStatus, selectStatusById } from '../../features/statuses/statusesSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import {dialogues} from "../orderStatus/orderStatusDialogues"
import { selectToken } from '../../features/token/tokenSlice'
import { deleteStatus } from '../../features/statuses/statusesSlice'
import AlertConfirmWindow from '../alertConfirmWindow/AlertConfirmWindow'

const StatusComponent = ({id}) => {
    const dispatch = useDispatch()
    const token = useSelector(selectToken)
    const status = useSelector(state => selectStatusById(state,id))
    const currentLanguage = useSelector(selectCurrentLanguage)
    const [statusEditOpen,setStatusEditOpen] = useState(false)
    
    const [statusEdit,setStatusEdit] = useState(status)
   
    const [confirmDialogue,setConfirmDialogue] = useState({
      message:"",
      confirmed:false
    })

    // Sees if confirmed,deletes status
    useEffect(() => {
         const deleteStatusAfterConfirm = () => {
            const fetchParameters = {
              id:id,
              token:token
            }
            dispatch(deleteStatus({fetchParameters}))
         }

         if(confirmDialogue.confirmed){
          deleteStatusAfterConfirm()
          setConfirmDialogue({
            ...confirmDialogue,
            confirmed:false
          })
         }
    },[confirmDialogue.confirmed,dispatch])

    const armRegex = /^[\u0531-\u0556\u0561-\u0587\s]+$/i
    const engRegex = /^[A-Za-z\s-]+$/ 
    const [errorMessage,setErrorMessage] = useState("")
    const inputRefs = useRef({})
    const enableSubmit = [statusEdit?.name?.arm,statusEdit?.name?.eng].map(item => Boolean(item)).every(value => value)


    const changeValues = (e) => {
      inputRefs.current[e.target.name].style.outline = "initial"
      setErrorMessage()
      setStatusEdit({
        ...statusEdit,
        name:{
          ...statusEdit.name,
         [e.target.name]:e.target.value
        }
      })
      if(e.target.name === "arm" && e.target.value.length > 0){
         if(!armRegex.test(e.target.value)){
          setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
          return
         }else{
          setStatusEdit({
            ...statusEdit,
            name:{
              ...statusEdit.name,
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
          setStatusEdit({
            ...statusEdit,
            name:{
              ...statusEdit.name,
             [e.target.name]:e.target.value
            }
          })
         }
        }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      if(enableSubmit){
        const fetchParameters = {
          editedStatus:statusEdit,
          token:token
        }
        dispatch(editStatus({fetchParameters}))
        setStatusEditOpen(false)
      }else{
        for(const key in statusEdit?.name){
          if(!statusEdit?.name[key]){
            inputRefs.current[key].style.outline = "1px solid red"
          }else{
            inputRefs.current[key].style.outline = "initial"

          }
        }
      }
    }

    const handleDelete = () => {
       setConfirmDialogue({
        ...confirmDialogue,
        message:dialogues.deleteAlert
       })
    }
    
  return (
    <li>
      {
        confirmDialogue?.message && 
           <AlertConfirmWindow confirmDialogue={confirmDialogue} setConfirmDialogue={setConfirmDialogue}/>
      }
       <span>{status?.name[currentLanguage]}</span>
       <button className='btn btnDelete'
         onClick={() => setStatusEditOpen(!statusEditOpen)}>
           {
           statusEditOpen ? dialogues.closeEdit[currentLanguage] 
           : dialogues.edit[currentLanguage]
           }
       </button>

       <button className='btn btnBlack'
         onClick={handleDelete}>
        {dialogues.delete[currentLanguage ]}
       </button>

       <div className={
           statusEditOpen ? "status_edit status_edit_open"
           : "status_edit status_edit_close"
       }>
          <form onSubmit={handleSubmit}>
          <span className={errorMessage ? "error_message" : "error_message_inactive"}>
               {errorMessage}
            </span>
             <input type='text' 
                   placeholder={dialogues.inputPlaceholders.nameArm[currentLanguage]}
                   className='text_input'
                   name='arm'
                   ref={(ref) => inputRefs.current.arm = ref}
                   value={statusEdit?.name?.arm}
                   onChange={changeValues}
                   />
            <input type='text' 
                   placeholder={dialogues.inputPlaceholders.nameEng[currentLanguage]}
                   className='text_input'
                   name='eng'
                   ref={(ref) => inputRefs.current.eng = ref}
                   value={statusEdit?.name?.eng}
                   onChange={changeValues}
                   />

            <button className='btn btnBlack'>
              {dialogues.save[currentLanguage]}
            </button>
          </form>
       </div>
    </li>
  )
}

export default StatusComponent