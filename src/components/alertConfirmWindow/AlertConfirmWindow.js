import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { dialogues } from './alertConfirmDialogues'
import ReactDOM from 'react-dom';

const AlertConfirmWindow = ({confirmDialogue,setConfirmDialogue}) => {
    const handleCloseWindow = () => {
        setConfirmDialogue({
          ...confirmDialogue,
          message:""
        })
    }
    const currentLanguage = useSelector(selectCurrentLanguage)
    
    const confirm = () => {
      setConfirmDialogue({
        message:"",
        confirmed:true
      })
      if(confirmDialogue?.loadNext){
        window.location.href = `/`
      }
    }

    // Renders the element outside parent elements (for always being in the center of window)
  return ReactDOM.createPortal(
    <div className='alert_window'>
          <div className='cartBtnDelete' 
             onClick={handleCloseWindow}>
               <div></div>
               <div></div>
          </div>

          <div className='alert_window_content'>
             <p>{confirmDialogue?.message[currentLanguage]}</p>
      
             <button className='btn btnBlack'
                onClick={confirm}>
                  {confirmDialogue?.loadNext ? dialogues.ok[currentLanguage] : dialogues.confirm[currentLanguage]}
               
             </button>
          </div>
    </div>,
    document.body
  )
  
}

export default AlertConfirmWindow