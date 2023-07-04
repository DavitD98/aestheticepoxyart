import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  selectAllCategories } from '../../features/categories/categoriesSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { dialogues } from './filterDialogues'
import { changeCategory, changePriceFrom, changePriceTo, changeSort, changeType, fetchProducts, selectCategory, selectPriceFrom, selectPriceTo, selectSort, selectType } from '../../features/products/productsSlice'
import {  selectAllTypes } from '../../features/types/typesSlice'
import UseWindowResize from '../../customHooks/UseWindowResize' 

const Filters = () => {
    const {width} = UseWindowResize()
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const categories = useSelector(selectAllCategories)
    const types = useSelector(selectAllTypes)

    const [responsiveFilterShow,setResponsiveFilterShow] = useState(false)

    const category = useSelector(selectCategory)
    const type = useSelector(selectType)
    const sort = useSelector(selectSort)
    const priceFrom = useSelector(selectPriceFrom)
    const priceTo = useSelector(selectPriceTo)
    
    const [applyFetch,setApplyFetch] = useState(false)
    const applyEnable = [Boolean(category),Boolean(sort),Boolean(priceFrom),Boolean(priceTo)].some(value => value)

    const selectRef = useRef([null,null,null])
    const inputRef = useRef([null,null])


     // Function inside useEffect creates parameters and fetches products,after sets apply to false
    useEffect(() => {
      if(applyFetch){
        const apply = () => {
          const fetchParameters = {
            category:category,
            type:type,
            sort:sort,
            priceFrom:priceFrom,
            priceTo:priceTo,
            
          }
          dispatch(fetchProducts({fetchParameters}))
          setApplyFetch(false)
          if(width < 1024){
            setResponsiveFilterShow(false)
          }
        }
        
        apply()
      }
    },[applyFetch])

    // Reset Filters
    const resetFilters = () => {
      dispatch(changeCategory(""))
      dispatch(changeType(""))
      dispatch(changeSort(""))
      dispatch(changePriceFrom(""))
      dispatch(changePriceTo(""))

      // resets all select refs selected items to 0 index
      selectRef.current.forEach((ref) => {
        if(ref){
          ref.value = ""
        }
      })

      //resets input values 
      inputRef.current.forEach((input) => {
        input.value = ""
      })
      setApplyFetch(true)
    }

  return (
    <div className='filters_main'>
      { width <= 1200 && 
         <button className='btn btnBlack'
           onClick={() => setResponsiveFilterShow(!responsiveFilterShow)}>
            {dialogues.filterShow[currentLanguage]}
        </button>}
      
      <div className={width > 1200 ? "filters"
                      : responsiveFilterShow ? "filters filters_active" : "filters" }>


       {/* Category                  */}
       <select className='main_select' name='category'
          onChange={(e) => dispatch(changeCategory(e.target.value))}
          ref={(el) => (selectRef.current[0] = el)}>

             <option value="">
              {dialogues.categories.selectName[currentLanguage]}
             </option>
             {
               categories?.map(category => (
                 <option key={category?._id}
                    value={`category=${category?._id}`}>
                   {category?.name[currentLanguage]}
                 </option>
               ))
             }
       </select>

      {/* Type */}
      {
        category &&   <select className='main_select' name='type'
                          onChange={(e) => dispatch(changeType(e.target.value))}
                          ref={(el) => (selectRef.current[1] = el)}>
                        <option value="">{dialogues.type[currentLanguage]}</option>
                        {
                           types?.map((type) => {
                            if(category?.includes(type.category)){
                              return (
                                <option value={`type=${type._id}`} key={type._id}>
                                     {type?.name[currentLanguage]}
                                </option>
                              )
                            }
                           })
                        }

                      </select>
      }
      

        {/* Sort */}
       <select className='main_select' name='sort'
         onChange={(e) => dispatch(changeSort(e.target.value))}
         ref={(el) => (selectRef.current[2] = el)}
         >
         <option value="">{dialogues.sort.selectName[currentLanguage]}</option>
         <option value="sort=price">{dialogues.sort.priceIncrement[currentLanguage]}</option>
         <option value="sort=-price">{dialogues.sort.priceDecrement[currentLanguage]}</option>
         <option value="sort=sold">{dialogues.sort.topSale[currentLanguage]}</option>
         <option value="sort=-createdAt">{dialogues.sort.newest[currentLanguage]}</option>
       </select>
       
       {/* Price filters */}
       <div className='price_filters'>
         <input type='text'
                placeholder={dialogues.priceFilter.priceFrom[currentLanguage]}
                className='text_input'
                onChange={(e) => dispatch(changePriceFrom(`price[gte]=${e.target.value}`))}
                ref={(el) => (inputRef.current[0] = el)}
                />
        <input type='text'
                placeholder={dialogues.priceFilter.priceTo[currentLanguage]}
                className='text_input'
                onChange={(e) => dispatch(changePriceTo(`price[lte]=${e.target.value}`))}
                ref={(el) => (inputRef.current[1] = el)}
                />      
       </div>
       
       {/* Enable Apply */}
       {
        applyEnable &&  <div className='filter_buttons'>
                              <button className='btn btnBlack'
                                      onClick={() => setApplyFetch(true)}>
                                       {dialogues.apply[currentLanguage]}
                               </button>
                                <button className='btn btnWhite'
                                        onClick={resetFilters}>
                                       {dialogues.reset[currentLanguage]}
                               </button>
                          </div>
       }


     </div>
  </div>
  )
}

export default Filters