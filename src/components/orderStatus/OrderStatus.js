import React, { useEffect, useRef, useState } from 'react'
import { dialogues } from './orderStatusDialogues'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { createStatus, selectStatusesIds } from '../../features/statuses/statusesSlice'
import StatusComponent from '../statusComponent/StatusComponent'
import { selectToken } from '../../features/token/tokenSlice'

const OrderStatus = () => {
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const token = useSelector(selectToken)
    const statusesIds = useSelector(selectStatusesIds)
    const [statusesShow,setStatusesShow] = useState(false)

    const statusListRef = useRef(null)

    const [status,setStatus] = useState({
      name:{
        arm:"",
        eng:""
      }
    })
    const armRegex = /^[\u0531-\u0556\u0561-\u0587\s]+$/i
    const engRegex = /^[A-Za-z\s-]+$/ 
    const [errorMessage,setErrorMessage] = useState("")
    const inputRefs = useRef({})
    const enableSubmit = [status?.name?.arm,status?.name?.eng].map(item => Boolean(item)).every(value => value)

    // If statusesShow is changed,it scrolls the window to the status list
    useEffect(() => {
      if(statusListRef.current){
        statusListRef.current.scrollIntoView({behavior:"smooth"})
      }
    },[statusesShow])

    const changeValues = (e) => {
      inputRefs.current[e.target.name].style.outline = "initial"
      setErrorMessage()
      setStatus({
        ...status,
        name:{
          ...status.name,
         [e.target.name]:e.target.value
        }
      })
      if(e.target.name === "arm" && e.target.value.length > 0){
         if(!armRegex.test(e.target.value)){
          setErrorMessage(dialogues.languageControl.onlyArmenian[currentLanguage])
          return
         }else{
          setStatus({
            ...status,
            name:{
              ...status.name,
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
          setStatus({
            ...status,
            name:{
              ...status.name,
             [e.target.name]:e.target.value
            }
          })
         }
        }
    }
    
     const handleSubmit = (e) => {
        e.preventDefault()
        if(enableSubmit){
          const fetchParameters = {
            status:status,
            token:token
          }
          dispatch(createStatus({fetchParameters}))
          for(const key in inputRefs.current){
            if(inputRefs.current.hasOwnProperty(key)){
                inputRefs.current[key].value = ""
            }
          }
        }else{
          for(const key in status.name){
            if(!status.name[key]){
              
              inputRefs.current[key].style.outline = "1px solid red"
            }else{
              inputRefs.current[key].style.outline = "initial"
            }
          }
        }
    }
  return (
    <div className='orders_statuses'>

       <h3>{dialogues.createStatus[currentLanguage]}</h3>
        <form onSubmit={handleSubmit}>
            <span className={errorMessage ? "error_message" : "error_message_inactive"}>
               {errorMessage}
            </span>
            <input type='text' 
                   placeholder={dialogues.inputPlaceholders.nameArm[currentLanguage]}
                   className='text_input'
                   name='arm'
                   ref={(ref) => inputRefs.current.arm = (ref)}
                   onChange={changeValues}
                   />
            <input type='text' 
                   placeholder={dialogues.inputPlaceholders.nameEng[currentLanguage]}
                   className='text_input'
                   name='eng'
                   ref={(ref) => inputRefs.current.eng = (ref)}
                   onChange={changeValues}
                   />

                   <button className='btn btnBlack'>
                    {dialogues.save[currentLanguage]}
                   </button>
        </form>


       <div className='statuses_container'>
            <h3>{dialogues.statusList[currentLanguage]}</h3>

             <button className='btn btnDelete'
                     onClick={() => setStatusesShow(!statusesShow)}>
                       {dialogues.showStatuses[currentLanguage]}
             </button>
             <div className={
                           statusesShow ?
                            "status_list_container status_list_container_open"
                             :"status_list_container"
                             }
                             ref={statusListRef}>
               {
                  statusesShow &&  <ul className='status_list'>
                                    {
                                       statusesIds?.map(id => <StatusComponent id={id} key={id}/>)  
                                    }
                                  </ul>
                               
               }
                 
             </div>
        </div>
    </div>
  )
}

export default OrderStatus