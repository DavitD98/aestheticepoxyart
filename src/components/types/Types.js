
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeChecked, deleteType, selectAllTypes } from '../../features/types/typesSlice'
import Type from '../type/Type'
import { selectToken } from '../../features/token/tokenSlice'
import { dialogues } from '../type/typeDialogue'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'

const Types = ({categoryId,typesOpen}) => {
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)

    const types = useSelector(selectAllTypes)
    const token = useSelector(selectToken)
    const [typesOfCategory,setTypesOfCategory] = useState([])

    const deleteButtonAppear = types?.some(type => type.checked)
    
    useEffect(() => {
      const typesAvailable = types?.filter(item => item?.category === categoryId)
      setTypesOfCategory(typesAvailable)
    },[types,categoryId])

    const handleCheckAll = () => {
      const allChecked = types?.every(type => type.checked)
      if(allChecked){
        types?.forEach(type => {
          dispatch(changeChecked({id:type?._id,value:false}))
       })
      }else{
        types?.forEach(type => {
          dispatch(changeChecked({id:type?._id,value:true}))
       })
      }
    }

    const handleDeleteChecked = () => {
      types?.forEach(type => {
        if(type.checked){
          const fetchParameters = {
            id:type?._id,
            token:token
          }
          dispatch(deleteType({fetchParameters}))
        }
      })
    }

  return (
    <div className={typesOpen ? 
        "types_container types_container_open" 
        : "types_container types_container_close"}>
          
          {
            typesOfCategory.length ?
                  <div className='check_all_delete'>
                      <button className='btn btnBlack' 
                          onClick={handleCheckAll}>
                           {dialogues.checkAll[currentLanguage]}
                       </button>
                      {
                       deleteButtonAppear && 
                          <button className='btn btnDelete'
                                  onClick={handleDeleteChecked}>
                                   {dialogues.delete[currentLanguage]}
                         </button>
                      }
                </div>
                :""
          }
       <ul>

        {  
           typesOfCategory?.length ? 
                typesOfCategory?.map(item => <Type key={item?._id} type={item}/>)
                : <span>{dialogues.noTypesFound[currentLanguage]}</span>
        }
       </ul>
         
    </div>
  )
}

export default Types