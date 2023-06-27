import { useSelector } from "react-redux"
import Logo from "../../images/Logo.jpeg"

import React from 'react'
import { selectCurrentLanguage } from "../../features/languages/languagesSlice"
import { dialogues } from "./loadingDialogues"

const Loading = () => {
    const currentLanguage = useSelector(selectCurrentLanguage)
  return (
    <div className='loading'>
         <img src={Logo} alt="logo_loading"/>
         <span>{dialogues.loading[currentLanguage]}</span>
    </div>
  )
}

export default Loading