
import React from 'react'
import { dialogues } from '../header/headerDialogues'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'

const Footer = () => {
    const currentLanguage = useSelector(selectCurrentLanguage)
  return (
    <footer>
        <span><i>{dialogues.contactUs[currentLanguage]} 077092128</i></span>
    </footer>
  )
}

export default Footer