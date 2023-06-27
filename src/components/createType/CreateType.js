import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dialogues } from '../CreateProduct/createProductDialogues'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { createType } from '../../features/types/typesSlice'
import { selectToken } from '../../features/token/tokenSlice'
import { categoryDialogues } from '../createCategory/categoryDialogues'

const CreateType = ({createTypeOpen,setCreateTypeOpen,parentCategoryId}) => {
    const currentLanguage = useSelector(selectCurrentLanguage)
    const dispatch = useDispatch()
    const token = useSelector(selectToken)
    const [type,setType] = useState({
        name:{
            arm:"",
            eng:""
        },
        category:parentCategoryId
    })
    const [errorMessage,setErrorMessage] = useState("")
    

    const inputRefs = useRef({})

    const armRegex = /^[\u0531-\u0556\u0561-\u0587\s]+$/i
    const engRegex = /^[A-Za-z\s-]+$/ 
    const enabelSubmit = [type?.name?.arm,type?.name?.eng,type?.category]
                         .map(item => Boolean(item)).every(value => value)

    const changeValues = (e) => {
        inputRefs.current[e.target.name].style.outline = "initial"
        setErrorMessage("")
        setType({
            ...type,
            name:{
                ...type?.name,
                [e.target.name]:e.target.value
            }
        })
        if(e.target.name === "arm" && e.target.value.length > 0){
            if(!armRegex.test(e.target.value)){
                setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
                return
            }else{
                setType({
                    ...type,
                    name:{
                        ...type?.name,
                        [e.target.name]:e.target.value
                    }
                })
            }
        }
        if(e.target.name === "eng" && e.target.value.length > 0){
            if(!engRegex.test(e.target.value)){
                setErrorMessage(dialogues.languageControl.onlyEnglish[currentLanguage])
                return
            }else{
                setType({
                    ...type,
                    name:{
                        ...type?.name,
                        [e.target.name]:e.target.value
                    }
                })
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(enabelSubmit){
            const fetchParameters = {
                type:type,
                token:token
            }
            dispatch(createType({fetchParameters}))
            setCreateTypeOpen(false)
            setType({
                ...type,
                name:{
                    arm:'',
                    eng:''
                }
            })
        }else{
            for(const key in type?.name){
               if(!type?.name[key]){
                inputRefs.current[key].style.outline = "1px solid red"
               }else{
                inputRefs.current[key].style.outline = "initial"
               }
            }
        }
        
    }

   

  return (
    <div className={createTypeOpen ? 
                    "create_type create_type_open"
                    : "create_type create_type_close" }>
        <form onSubmit={handleSubmit}>
            <label>
                {categoryDialogues.categories.options.createType[currentLanguage]}
            </label>
            <span className={errorMessage ? "error_message" 
                                          : "error_message_inactive"}
                                 >
                   {errorMessage}
             </span>                       
            <input type='text' 
                   className='text_input'
                   placeholder='name armenian'
                   name="arm"
                   ref={(ref) => inputRefs.current.arm = ref}
                   value={type?.name?.arm}
                   onChange={changeValues}
                   />
             <input type='text' 
                   className='text_input'
                   placeholder='name armenian'
                   name="eng"
                   ref={(ref) => inputRefs.current.eng = ref}
                   value={type?.name?.eng}
                    onChange={changeValues}
                   />
                   <button className='btn btnBlack' type='submit'>
                    {dialogues.save[currentLanguage]}
                   </button>
        </form>
    </div>
  )
}

export default CreateType