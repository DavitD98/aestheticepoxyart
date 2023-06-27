import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from "@fortawesome/free-solid-svg-icons"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { resetUser } from '../../features/user/userSlice'
import { dialogues } from './headerDialogues'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import BASE_URL from '../../api/baseUrl'

const AuthMenu = ({user,authMenuShow,setAuthMenuShow}) => {
  const dispatch = useDispatch()
  const currentLanguage = useSelector(selectCurrentLanguage)

  const handleLogout = async() => {
     try{
        const response = await axios.get(`${BASE_URL}/user/logout`)
        if(response.data){
           localStorage.removeItem(`logged`)
           dispatch(resetUser())
           window.location.href = `/`
        }

     }catch(error){
      if(error?.response?.data?.message){
        console.log(error?.response?.data?.message);
      }else{
        console.log(error?.message);
      }
     }
  }

  return (
    <div className={authMenuShow ? "auth_menu" : "auth_menu auth_menu_inactive"}>
                 <button className='close_auth_button'
                     onClick={() => setAuthMenuShow(false)}>
                   <FontAwesomeIcon icon={faXmark} size="2xl" style={{color: "#202020",}} />
                 </button>
                <h4>{user?.firstname} {user?.lastname}</h4>
                 <p>{user?.phone}</p>

                 <div>
                 <Link to="#" onClick={handleLogout}>
                  {dialogues.auth.logout[currentLanguage]}
                 </Link>

                 <Link to={`/user/edit`} className='edit_account'>
                  {dialogues.auth.changeAccount[currentLanguage]}
                 </Link>
                 </div>
    </div>
  )
}

export default AuthMenu