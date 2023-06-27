import React, { useEffect, useRef, useState } from 'react'
import { dialogues } from '../auth/authDialogues'
import { useDispatch, useSelector } from 'react-redux'
import { editPassword, selectUser, selectUserError, setUserAlert, setUserError } from '../../features/user/userSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { selectToken } from '../../features/token/tokenSlice'
import { authEditDialoges } from './authEditDialogues'
import { Link, useNavigate } from 'react-router-dom'


const PassEdit = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const currentLanguage = useSelector(selectCurrentLanguage)
    const token = useSelector(selectToken)
    const userError = useSelector(selectUserError)
    const [errorMessage,setErrorMessage] = useState("")
    
    const [passwordObj,setPasswordObj] = useState({
        oldPassword:"",
        password:"",
        passConfirm:""
    })

    const enableSubmit = [passwordObj?.oldPassword,passwordObj?.password,passwordObj?.passConfirm]
                          .map(item => Boolean(item)).every(value => value)
    const passConfirValidate = passwordObj?.password === passwordObj?.passConfirm                     

    const inputRefs = useRef({})

  
// If userError in redux user state show error
    useEffect(() => {
       if(userError){
        setErrorMessage(userError[currentLanguage])
       }
    },[userError])
    
    // navigate page
    const navigatePage = () => {
      setUserAlert("")
    }
    // Change values
    const changeValues = (e) => {
      setPasswordObj({
          ...passwordObj,
          [e.target.name]:e.target.value
      })
  }

    // Handle Sumbit
    const handleSubmit = async(e) => {
        e.preventDefault()
        if(enableSubmit){
           if(!passConfirValidate){
             return setErrorMessage(authEditDialoges.passUpdate.passConfirmFailed[currentLanguage])
           }else{
             const fetchParameters = {
               oldPassword:passwordObj?.oldPassword,
               password:passwordObj?.password,
               token:token,
               id:user?._id
             }
             const response = await dispatch(editPassword({fetchParameters}))
             if(response?.payload?.user){
                 navigate(`/`)
             }
           }
        }else{
            for(const key in passwordObj){
                if(!passwordObj[key]){
                    console.log(key);
                }
            }
        }
    }

    const handleLinkClick = () => {
      dispatch(setUserError(""))
    }
  return (
    <form className='auth_form' onSubmit={handleSubmit}>
          <h3>{authEditDialoges.editPassword[currentLanguage]}</h3>
          <span className={errorMessage ? `error_message` : "error_message_inactive"}>{errorMessage}</span>
        <input 
            type='password'
            placeholder={authEditDialoges.placeholders.oldPass[currentLanguage]}
            ref={(ref) => inputRefs.current.oldPassword = ref}
            name='oldPassword'
            value={passwordObj?.oldPassword}
            onChange={changeValues}
            />
       <input 
            type='password'
            placeholder={authEditDialoges.placeholders.pass[currentLanguage]}
            ref={(ref) => inputRefs.current.password = ref}
            name='password'
            value={passwordObj?.password}
            onChange={changeValues}
            />
            <input 
            type='password'
            placeholder={authEditDialoges.placeholders.passConfirm[currentLanguage]}
            name='passConfirm'
            value={passwordObj?.passConfirm}
            onChange={changeValues}
            />
            <button className='btn btnWhite'>
              {authEditDialoges.save[currentLanguage]}
            </button>

            <Link to={`/user/edit`} onClick={handleLinkClick}>{authEditDialoges.goBack[currentLanguage]}</Link>
    </form>
  )
}

export default PassEdit