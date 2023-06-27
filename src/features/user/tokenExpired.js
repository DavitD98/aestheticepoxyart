import { useDispatch, useSelector } from "react-redux"
import {  resetTokenExpireMessage, resetUser, selectUserTokenExpiredMessage } from "./userSlice"
import { selectCurrentLanguage } from "../languages/languagesSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from "@fortawesome/free-solid-svg-icons"
import {Link} from "react-router-dom"

const TokenExpired = () => {
    const dispatch = useDispatch()
    const userTokenExpiredMessage = useSelector(selectUserTokenExpiredMessage)
    const currentLanguage = useSelector(selectCurrentLanguage)
    
    // Reset user data (isAdmin,logged,token from localStorage),and resets the error Message
    const resetTokenExpired = () => {
      dispatch(resetUser())
      dispatch(resetTokenExpireMessage(""))
      window.location.href = `/user/login`

    }
    return (
      <div className='token_expired'>
          <span className='link' onClick={resetTokenExpired}>
                  {userTokenExpiredMessage && userTokenExpiredMessage[currentLanguage]}
              </span>
          <button className='close_menu' onClick={resetTokenExpired}>
              <FontAwesomeIcon icon={faXmark} size="2xl" style={{color: "#202020",}} />
          </button>
      </div>
      
    )
  }

  export default TokenExpired