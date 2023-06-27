import React, { useState } from 'react'
import { dialogues } from '../header/headerDialogues'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import { fetchProducts } from '../../features/products/productsSlice'


const SearchComponent = () => {
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const [search,setSearch] = useState("")

    const handleChangeSearch = (e) => {
        setSearch(e.target.value)
        const fetchParameters = {
          search:`name.${currentLanguage}[regex]=${e.target.value}`
        }
        dispatch(fetchProducts({fetchParameters}))
      }
    
  return (
    <form className='search_form'>
        <input type="text" 
               autoFocus 
               placeholder={dialogues.search[currentLanguage].searchPlaceholder}
               className="text_input "
               value={search}
               onChange={handleChangeSearch}
               />
               <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" style={{color: "#ccc",}} />
    </form>
  )
}

export default SearchComponent