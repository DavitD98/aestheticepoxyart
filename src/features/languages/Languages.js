import React, { useEffect, useRef } from 'react'
import ArmenianFlag from "../../images/flags/armenian_flag.png"
import UkFlag from "../../images/flags/uk_flag.png"
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentLanguage, selectLanguages, setLanguage } from './languagesSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from "@fortawesome/free-solid-svg-icons"


const Languages = ({languageMenuShow,setLanguageMenuShow}) => {
    const languages = useSelector(selectLanguages)
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)

    const ref = useRef()

    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setLanguageMenuShow(false)
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);


  return (
    <ul className={languageMenuShow ? 'language_menu' : "language_menu language_menu_inactive"} ref={ref}>
       <button className='close_menu'
           onClick={() => setLanguageMenuShow(false)}>
         <FontAwesomeIcon icon={faXmark} size="2xl" style={{color: "#202020",}} />
       </button>
         {
            languages?.map((language,index) => (
                <li key={index}
                    onClick={() => dispatch(setLanguage(language))}
                    style={{background:currentLanguage === language && "#eee"}}
                  >
                    <img src={language === "eng" ? UkFlag : ArmenianFlag} alt='flag'/>
                    {language === "eng" ? "English" : "Armenian"}  
                </li>
            ))
         }
    </ul>
  )
}

export default Languages