import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { dialogues } from './authDialogues'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import axios from 'axios'
import { selectToken, setToken } from '../../features/token/tokenSlice'
import { selectUserAlert, setUserAlert } from '../../features/user/userSlice'
import BASE_URL from '../../api/baseUrl'


const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentLanguage = useSelector(selectCurrentLanguage)
  const accessToken = useSelector(selectToken)
  const userAlert = useSelector(selectUserAlert)

  const [wrongField,setWrongField] = useState("")
  const [errorMessage,setErrorMessage] = useState("")
  const [user,setUser] = useState({
    firstname:"",
    lastname:"",
    email:"",
    phone:"",
    password:""
  })

  const [passConfirm,setPassConfirm] = useState("")
  const passwordConfirm = user.password === passConfirm

  const inputRefs = useRef({})
  const enableSumbit = [user.phone,user.firstname,user.lastname,user.password]
                      .map(item => Boolean(item)).every(value => value)

   
  const changeValues = (e) => {
    if(inputRefs.current[e.target.name]){
      console.log(inputRefs.current[e.target.name]);
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
    setUser({
      ...user,
      [e.target.name]:e.target.value
    })
  }


  const handleSubmit = async(e) => {
          e.preventDefault()
        try{
          if(enableSumbit){
            if(!passwordConfirm){
              return setErrorMessage(dialogues.register.passConfirmFailed[currentLanguage])
            }
            const response = await axios.post(`${BASE_URL}/user/register`,{...user})
            if(response.data.accessToken){
              localStorage.setItem(`logged`,true)
              dispatch(setUserAlert(response.data.message))
              window.location.href = `/`
            }
          }else{
            for(const key in user){
              if(!user[key] && inputRefs.current[key]){
                 inputRefs.current[key].style.outline = "1px solid #D10000"
                 inputRefs.current[key].style.borderBottom = "none"
              }
           }
           return 
          } 

        }catch(error){
          if(error?.response?.data?.message){
            setErrorMessage(error?.response?.data.message[currentLanguage])
          }else{
            console.log(error.message);
          }
        }
  }


  return (
    <form className='auth_form' onSubmit={handleSubmit}>
          <h3>{dialogues.register.heading[currentLanguage]}</h3>
          <span className={wrongField ? `wrong_field` : "wrong_field_inactive"}>{wrongField}</span>
          <span className={errorMessage ? `error_message` : "error_message_inactive"}>{errorMessage}</span>
          <input 
            type='text'
            placeholder={dialogues.placeholders.phone[currentLanguage]}
            autoFocus
            ref={(ref) => inputRefs.current.phone = ref}
            name='phone'
            onChange={changeValues}
            />
            <input 
            type='text'
            placeholder={dialogues.placeholders.firstname[currentLanguage]}
            ref={(ref) => inputRefs.current.firstname = ref}
            name='firstname'
            onChange={changeValues}
            />
            <input 
            type='text'
            placeholder={dialogues.placeholders.lastname[currentLanguage]}
            ref={(ref) => inputRefs.current.lastname = ref}
            name='lastname'
            onChange={changeValues}
            />
            <input 
            type='text'
            placeholder={dialogues.placeholders.email[currentLanguage]}
            name='email'
            onChange={changeValues}
            />
           <input 
            type='password'
            placeholder={dialogues.placeholders.password[currentLanguage]}
            ref={(ref) => inputRefs.current.password = ref}
            name='password'
            onChange={changeValues}
            />
            <input 
            type='password'
            placeholder={dialogues.placeholders.passwordConfirm[currentLanguage]}
            name='passConfirm'
            onChange={(e) => setPassConfirm(e.target.value)}
            />
            <button className='btn btnBlack'>
              {dialogues.register.button[currentLanguage]}
            </button>

            <p> 
            {dialogues.register.navOffer[currentLanguage]}
              <Link to={'/user/login'} className='sign_up'>
              {dialogues.register.navLink[currentLanguage]}
              </Link>
            </p>
    </form>
  )
}

export default Register