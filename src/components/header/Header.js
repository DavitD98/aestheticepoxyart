import { Link } from "react-router-dom"
import Logo from "../../images/Logo.jpeg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBagShopping} from "@fortawesome/free-solid-svg-icons"
import {faGlobe} from "@fortawesome/free-solid-svg-icons"
import {faUser} from "@fortawesome/free-solid-svg-icons"
import React, { useEffect, useState } from 'react'
import { dialogues } from "./headerDialogues"
import Languages from "../../features/languages/Languages"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentLanguage } from "../../features/languages/languagesSlice"
import { selectCart, selectHistory, selectIsAdmin, selectIsLogged, selectUser } from "../../features/user/userSlice"
import AuthMenu from "./AuthMenu"
import Cart from "../cart/Cart"
import UseWindowResize from "../../customHooks/UseWindowResize"
import { fetchProducts } from "../../features/products/productsSlice"
import SearchComponent from "../searchComponent/SearchComponent"

const Header = () => {
  const {width} = UseWindowResize()
  const dispatch = useDispatch()
  const currentLanguage = useSelector(selectCurrentLanguage)
  const [languageMenuShow,setLanguageMenuShow] = useState(false)
  const [authMenuShow,setAuthMenuShow] = useState(false)
  const [cartShow,setCartShow] = useState(false)
  const [responsiveMenuShow,setResponsiveMenuShow] = useState(false)
  const isLoggedIn = localStorage.getItem(`logged`)

  
  const user = useSelector(selectUser)
  const isLogged = useSelector(selectIsLogged)
  const isAdmin = useSelector(selectIsAdmin)
  const cart = useSelector(selectCart)


  // Admin router
  const adminRoutes = () => (
    <ul className={responsiveMenuShow ? "menu menu_active" : "menu"}>
        <li><Link to={`/`} onClick={closeMenuWhenLinked}>{dialogues.menu[currentLanguage].products}</Link></li>
        <li>
          <Link to={`/product/create`} onClick={closeMenuWhenLinked}>{dialogues.menu[currentLanguage].createProduct}</Link>
          
        </li>
        <li><Link to={`/category`} onClick={closeMenuWhenLinked}>{dialogues.menu[currentLanguage].categories}</Link></li>
        <li><Link to={`/orders`} onClick={closeMenuWhenLinked}>{dialogues.menu[currentLanguage].orders}</Link></li>
    </ul>
  )

  // User router
  const userRoutes = () => (
    <ul className={responsiveMenuShow ? "menu menu_active" : "menu"}>
        <li><Link to={`/`} onClick={closeMenuWhenLinked}>{dialogues.menu[currentLanguage].shop}</Link></li>
        <li><Link to={`/history`} onClick={closeMenuWhenLinked}>{dialogues.menu[currentLanguage].history}</Link></li>
    </ul>
  )

  // Login router
   const loginRoutes = () => (
     <ul className={responsiveMenuShow ? "menu menu_active" : "menu"}>
          <li><Link to={`/user/login`} onClick={closeMenuWhenLinked}>{dialogues.loginAndRegister[currentLanguage].login}</Link></li>
          <li><Link to={`/`} onClick={closeMenuWhenLinked}>{dialogues.menu[currentLanguage].shop}</Link></li>
     </ul>
  )

  const renderMenu = () => {
    if(isLogged && isAdmin){
      return adminRoutes() 
    } else if(isLogged && !isAdmin){
      return userRoutes()
    }else{
      return loginRoutes()
    }
  }
  const closeMenuWhenLinked = () => {
     setResponsiveMenuShow(false)
  }

  return (
    <header>
        <div className='start_section'>
          
             <Link onClick={() => window.location.href = `/`}>
               <img src={Logo} alt="logo"/>
             </Link> 

             {
                  isLogged && isAdmin && <span className="admin_header">Admin</span>                   
             }

             
               <span className="change_language_section" 
                                        onClick={() => setLanguageMenuShow(!languageMenuShow)}>
                                             {dialogues.language[currentLanguage].changeLanguage}
                                             <FontAwesomeIcon icon={faGlobe} style={{color: "#202020",}} />
                                      </span>
             
           
            <Languages languageMenuShow={languageMenuShow}
               setLanguageMenuShow={setLanguageMenuShow}
               />
           
           {
            width >= 1024 && <SearchComponent/>
           }
             

        </div>

        <div className="end_section">

             
               {
                // Big size
                width > 1024 ?
                renderMenu()

                // Small Size

                   
                 :  
                 
                   <div className="responsive_menu">
                        <div className={
                             responsiveMenuShow ?  "responsive_menu_button responsive_menu_button_opened" 
                             : "responsive_menu_button"}
                           onClick={() => setResponsiveMenuShow(!responsiveMenuShow)}>
                          <span className="line_1"></span>
                          <span className="line_2"></span>
                          <span className="line_3"></span>
                         </div>
                       {
                        // Menu is opened
                        responsiveMenuShow &&
                        
                            isLogged && isAdmin ? adminRoutes()
                            : isLogged && !isAdmin ? userRoutes()
                            : loginRoutes()
                       }
                      
                   </div>
               }

               {
                isLogged && <Link to='#' className="auth"  onClick={() => setAuthMenuShow(!authMenuShow)}>
                               <FontAwesomeIcon icon={faUser} size="2xl" style={{color: "#202020",}}/>
                              </Link>
               }
                <AuthMenu user={user}
                           authMenuShow={authMenuShow}
                           setAuthMenuShow={setAuthMenuShow}
                           />
               
            
     
     {
       !isAdmin &&  <div className="cart_section" onClick={() => setCartShow(!cartShow)}>
                       <FontAwesomeIcon icon={faBagShopping} size="2xl" style={{color: "#202020",}} />
                       <span className="cart_quantity">{cart?.length}</span>
                    </div>
     }
             
        </div>

      <Cart cartShow={cartShow} 
            setCartShow={setCartShow}/>
    </header>
  )
}

export default Header