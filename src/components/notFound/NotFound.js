
import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'

const NotFound = () => {
    const currentLanguage = useSelector(selectCurrentLanguage)
    const dialogues = {
        notFound:{
            arm:"Էջը չի գտնվել",
            eng:"Opps! Page Not found"
        },
        notFoundText:{
            arm:"Էջը ,որը դուք փնտրում էք գոյություն չունի",
            eng:"Sorry,the page you're looking for doesn't exist"
        }
    }
  return (
    <div className='not_found'>
          <h1>404</h1>
          <h3>{dialogues.notFound[currentLanguage]}</h3>
          <p>{dialogues.notFoundText[currentLanguage]}</p>
    </div>
  )
}

export default NotFound