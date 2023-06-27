import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from 'react'
import { selectCurrentLanguage } from "../../features/languages/languagesSlice";
import { selectProductAlert } from "../../features/products/productsSlice";
import { selectUserAlert, setUserAlert } from "../../features/user/userSlice";
import { setProductAlert } from "../../features/products/productsSlice";
import { selectOrderAlert, setOrderAlert } from "../../features/orders/ordersSlice";
import { selectCategoryAlert, setCategoryAlert } from "../../features/categories/categoriesSlice";
import { selectTypeAlert, setTypeAlert } from "../../features/types/typesSlice";
import ReactDOM from 'react-dom';
import { selectStatusAlert, setStatusAlert } from "../../features/statuses/statusesSlice";


const AlertWindow = () => {
    const dispatch = useDispatch()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const productAlert = useSelector(selectProductAlert)
    const userAlert = useSelector(selectUserAlert)
    const orderAlert = useSelector(selectOrderAlert)
    const categoryAlert = useSelector(selectCategoryAlert)
    const typeAlert = useSelector(selectTypeAlert)
    const statusAlert = useSelector(selectStatusAlert)

   
    useEffect(() => {
        if(userAlert || productAlert){
            const resetAll = () => {
               dispatch(setUserAlert(""))
               dispatch(setProductAlert(""))
               dispatch(setOrderAlert(""))
               dispatch(setCategoryAlert(""))
               dispatch(setTypeAlert(""))
               dispatch(setStatusAlert(""))
            }

            setTimeout(() => {
                resetAll()
            }, 10000);
        }
       
    },[userAlert,productAlert,orderAlert,categoryAlert,typeAlert,statusAlert,dispatch])
    
    const handleCloseWindow = () => {
       dispatch(setUserAlert(""))
       dispatch(setProductAlert(""))
       dispatch(setOrderAlert(""))
       dispatch(setCategoryAlert(""))
       dispatch(setTypeAlert(""))
       dispatch(setStatusAlert(""))
    }

    if(userAlert || productAlert || orderAlert || categoryAlert || typeAlert || statusAlert) 
    // Renders the element outside parent elements (for always being in the center of window)
    return ReactDOM.createPortal(
      <div 
      className="alert_window"
       
      >
       <div className='cartBtnDelete' 
            onClick={handleCloseWindow}>
              <div></div>
              <div></div>
         </div>
  
         <div className="alert_window_content">
               <p>{userAlert ? userAlert[currentLanguage]
                    : productAlert ? productAlert[currentLanguage] 
                    : orderAlert ? orderAlert[currentLanguage]
                    : categoryAlert ? categoryAlert[currentLanguage]
                    : typeAlert ? typeAlert[currentLanguage]
                    : statusAlert ? statusAlert[currentLanguage]
                    :""}
                </p>
          </div>
      </div>,
      document.body
    )

  // return (
  //   <div 
  //   className={
  //     userAlert || productAlert || orderAlert || categoryAlert || typeAlert ? "alert_window" 
  //     : "alert_window_inactive"}
  //   >
  //    <div className='cartBtnDelete' 
  //         onClick={handleCloseWindow}>
  //           <div></div>
  //           <div></div>
  //      </div>

  //      <div className="alert_window_content">
  //            <p>{userAlert ? userAlert[currentLanguage]
  //                 : productAlert ? productAlert[currentLanguage] 
  //                 : orderAlert ? orderAlert[currentLanguage]
  //                 : categoryAlert ? categoryAlert[currentLanguage]
  //                 : typeAlert ? typeAlert[currentLanguage]
  //                 :""}
  //             </p>
  //       </div>
  //   </div>
  // )
}

export default AlertWindow