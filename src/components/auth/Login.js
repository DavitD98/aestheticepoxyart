import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { dialogues } from './authDialogues'
import axios from 'axios'
import BASE_URL from '../../api/baseUrl'

const Login = () => {
  const currentLanguage = useSelector(selectCurrentLanguage)
  const [errorMessage,setErrorMessage] = useState("")
  const [wrongField,setWrongField] = useState("")
  const [user,setUser] = useState({
    phone:"",
    password:""
  })

  const changeValues = (e) => {
    setWrongField("")
    if(e.target.name === "phone"){
      const letterRegex = /[a-zA-Z]/
      const characterRegex = /\W/

      const containsLetter = letterRegex.test(e.target.value)
      const containsCharacter = characterRegex.test(e.target.value)

      if(e.target.value.length > 0 && containsLetter || containsCharacter){
        setWrongField(dialogues.register.wrongPhone[currentLanguage])
        return
      }else{
        setWrongField("")
      }
    }
    setUser({
      ...user,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
      const response = await axios.post(`${BASE_URL}/user/login`,{...user})

      if(response.data){
         const accessToken = response.data.accessToken
         localStorage.setItem(`token`,accessToken)
         localStorage.setItem(`logged`,true)
         window.location.href = `/`
      }
    }catch(error){
      if(error?.response?.data.message){
        setErrorMessage(error.response.data.message[currentLanguage])
      }else{
        console.log(error.message);
      }
    }
  }

  
  return (
    <form className='auth_form' onSubmit={handleSubmit}>
          <span className={errorMessage ? "error_message" : "error_message_inactive"}>{errorMessage}</span>
          <span className={wrongField ? "wrong_field" : "wrong_field_inactive"}>{wrongField}</span>
          <h3>{dialogues.login.heading[currentLanguage]}</h3>
          <input 
            type='text'
            placeholder={dialogues.placeholders.phone[currentLanguage]}
            autoFocus
            name='phone'
            onChange={changeValues}
            />
           <input 
            type='password'
            placeholder={dialogues.placeholders.password[currentLanguage]}
            name='password'
            onChange={changeValues}
            />
            <button className='btn btnBlack'>
            {dialogues.login.button[currentLanguage]}
            </button>
            <p>
               {dialogues.login.navOffer[currentLanguage]}
               <Link to={'/user/register'} className='sign_up'>
               {dialogues.login.navLink[currentLanguage]}
               </Link>
            </p>
    </form>
  )
}

export default Login