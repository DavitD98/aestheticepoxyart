import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editUser, selectUser, selectUserError, setUserAlert, setUserError } from '../../features/user/userSlice'
import { authEditDialoges } from './authEditDialogues'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { dialogues } from '../auth/authDialogues'
import { selectToken } from '../../features/token/tokenSlice'
import { Link, useNavigate } from 'react-router-dom'
import PassEdit from './PassEdit'

const AuthEdit = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const user = useSelector(selectUser)
    const token = useSelector(selectToken)
    const userError = useSelector(selectUserError)
    const [wrongField,setWrongField] = useState()
    const [errorMessage,setErrorMessage] = useState()
 
    const [userEdited,setUserEdited] = useState(user)
    const enableEdit = [userEdited?.firstname,userEdited?.lastname,userEdited?.phone]
                        .map(item => Boolean(item)).every(value => value)

    // set user data to userEdited state                    
    useEffect(() => {
       setUserEdited(user)
    },[user])

    // If userError in redux user state show error
    useEffect(() => {
       if(userError){
        setErrorMessage(userError[currentLanguage])
       }
    },[userError])

    
    const inputRefs = useRef({})
    
    const changeValues = (e) => {
      if(inputRefs.current[e.target.name]){
         inputRefs.current[e.target.name].style.outline = "none"
         inputRefs.current[e.target.name].style.borderBottom = "2px solid #ccc"
      }
      setErrorMessage("")
      if(e.target.name === "phone" && e.target.value.length > 0){
        const letterRegex = /[a-zA-Z]/
        const characterRegex = /\W/
  
        const containsLetter = letterRegex.test(e.target.value)
        const containsCharacter = characterRegex.test(e.target.value)
  
        if(containsLetter || containsCharacter) {
          setWrongField(dialogues.register.wrongPhone[currentLanguage])
          return
        }else{
          setWrongField("")
        }
      } 
      setUserEdited({
        ...userEdited,
        [e.target.name]:e.target.value
      })
    }


    const handleSubmit = async(e) => {
      e.preventDefault()
      if(enableEdit){
        const fetchParameters = {
          user:userEdited,
          token:token,
          id:user?._id
        }
        const response = await dispatch(editUser({fetchParameters}))
        if(response?.payload?.user){
           navigate(`/`)
        }
      }else{
        for(const key in userEdited){
          if(!userEdited[key]){
            if(key !== "email"){
              inputRefs.current[key].style.outline = "1px solid red"
              inputRefs.current[key].style.borderBottom = "none"
            }
          }
        }
      }
    }

    const handleLinkClick = () => {
      dispatch(setUserError(""))
    }
    
  return (
    <div className='edit_auth_container'>
        <form className='auth_form' onSubmit={handleSubmit}>
          <h3>{authEditDialoges.heading[currentLanguage]}</h3>
          <span className={wrongField ? `wrong_field` : "wrong_field_inactive"}>{wrongField}</span>
          <span className={errorMessage ? `error_message` : "error_message_inactive"}>{errorMessage}</span>
          <input 
            type='text'
            placeholder={dialogues.placeholders.phone[currentLanguage]}
            autoFocus
            ref={(ref) => inputRefs.current.phone = ref}
            name='phone'
            value={userEdited?.phone ? userEdited?.phone : ""}
            onChange={changeValues}
            />
            <input 
            type='text'
            placeholder={dialogues.placeholders.firstname[currentLanguage]}
            ref={(ref) => inputRefs.current.firstname = ref}
            name='firstname'
            value={userEdited?.firstname ? userEdited?.firstname : ""}
            onChange={changeValues}
            />
            <input 
            type='text'
            placeholder={dialogues.placeholders.lastname[currentLanguage]}
            ref={(ref) => inputRefs.current.lastname = ref}
            name='lastname'
            value={userEdited?.lastname ? userEdited?.lastname : ""}
            onChange={changeValues}
            />
            <input 
            type='text'
            placeholder={dialogues.placeholders.email[currentLanguage]}
            name='email'
            value={userEdited?.email ? userEdited?.email : ""}
            onChange={changeValues}
            />
            <button className='btn btnBlack'>
               {authEditDialoges.save[currentLanguage]}
            </button>
            
            <Link to={`/user/edit/password`} onClick={handleLinkClick}>{authEditDialoges.editPassword[currentLanguage]}</Link>
    </form>

    </div>
  )
}

export default AuthEdit