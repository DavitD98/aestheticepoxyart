
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, selectAvailablePages, selectCategory, selectPriceFrom, selectPriceTo, selectSort, selectTotalProductsNumber, selectType } from '../../features/products/productsSlice'
import { dialogues } from './paginationDialogues'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'

const Pagination = () => {
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const availablePages = useSelector(selectAvailablePages)
    const [currentPage,setCurrentPage] = useState(1)
    
    const category = useSelector(selectCategory)
    const type = useSelector(selectType)
    const sort = useSelector(selectSort)
    const priceFrom = useSelector(selectPriceFrom)
    const priceTo = useSelector(selectPriceTo)

    // Fetches products applying all filters and pagination
    useEffect(() => {
       const fetchParameters = {
         page:`page=${currentPage}`,
         category:category,
         type:type,
         sort:sort,
         priceFrom:priceFrom,
         priceTo:priceTo
       }
         dispatch(fetchProducts({fetchParameters}))
         window.scrollTo({
          top:0,
          behavior:"smooth"
         })
    },[currentPage])

    // Go to page of button
    const goToPage = (page) => {
        setCurrentPage(page)
    }

    //Go to firts page
    const getFirst = () => {
        setCurrentPage(1)
    }

    const renderButtons = () => {
        const buttons = []
        // Available range of visible buttons 
        const visibleButtons = 4

        // Start and endButtons calculate the range of pages to display, which includes the current page and two pages before and after it.

        // Start Button, wich is calculated maximum between 1 and currentpage - 2
        const startButton = Math.max(1,currentPage - Math.floor(visibleButtons / 2))

        //End button,wich is calculated maximum between available pages,or startButton + visibleButtons(4) - 1
        const endButton = Math.min(availablePages,startButton + visibleButtons - 1)

        
        // started from startButton,till the endButton,it displays buttons with pages between start and end
        for(let page = startButton;page <= endButton;page ++){
            buttons.push(
                <button key={page}
                className={currentPage === page ? "btn btnBlack" : "btn btnWhite"}
                onClick={() => goToPage(page)}
                >
                    {page}
            </button>
            )
        }
        return buttons
    }

  return (
    <div className='pagination'>
        {
           currentPage >= 4 &&
              <button className='btn btnBlack' onClick={getFirst}>
                {dialogues.firsPage[currentLanguage]}
              </button>
        }
        {renderButtons()}
             
    </div>
  )
}

export default Pagination