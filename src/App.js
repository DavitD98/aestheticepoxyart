import Header from "./components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectProducts } from "./features/products/productsSlice";
import { useEffect, useState } from "react";
import Pages from "./components/pages/Pages";
import { fetchUser, selectIsAdmin, selectIsLogged, selectUser, selectUserTokenExpiredMessage } from "./features/user/userSlice";
import TokenExpired from "./features/user/tokenExpired";
import Filters from "./components/filters/Filters";
import AlertWindow from "./components/alertWindow.js/AlertWindow";
import { setLanguage } from "./features/languages/languagesSlice";
import { fetchCategories } from "./features/categories/categoriesSlice";
import { fetchTypes } from "./features/types/typesSlice";
import { fetchOrders } from "./features/orders/ordersSlice";
import { fetchStatuses } from "./features/statuses/statusesSlice";
import UseWindowResize from "./customHooks/UseWindowResize";
import SearchComponent from "./components/searchComponent/SearchComponent";
import Products from "./features/products/Products";
import Footer from "./components/footer/Footer";
import { selectToken } from "./features/token/tokenSlice";


function App() {
  const {width} = UseWindowResize()
  const dispatch = useDispatch()
  const token = useSelector(selectToken)
  const user = useSelector(selectUser)
  const userTokenExpiredMessage = useSelector(selectUserTokenExpiredMessage)
  const products = useSelector(selectProducts)
  const isAdmin = useSelector(selectIsAdmin)

  const [filterShow,setFilterShow] = useState(false)

  // LocalStorage Token  -> fetch user  
   // user Fetch
    useEffect(() => {
       if(token && !user){
        dispatch(fetchUser(token))
       }
    },[token,dispatch])

    // Set current language by localStorage,if it is empty set to armenian
    useEffect(() =>{
        if(localStorage.getItem(`lang`) !== null){
          dispatch(setLanguage(localStorage.getItem(`lang`)))
        }else{
         dispatch(setLanguage(`arm`))
        }
    },[localStorage])

 

  // Fetch products
  useEffect(() => {  
      const getProducts = () => {
         const fetchParameters = {
         }
         dispatch(fetchProducts({fetchParameters}))
      }
      
      setTimeout(getProducts,1500)
  },[dispatch])

  // Fetch categories & types 
  useEffect(() => {
   if(products){
      dispatch(fetchCategories())
      dispatch(fetchTypes())
   }
  },[products])

  // fetch Orders
  useEffect(() => {
     if(isAdmin && token){
      dispatch(fetchOrders(token))
     }
  },[dispatch,isAdmin,token])

  // fetch Statuses
  useEffect(() => {
      dispatch(fetchStatuses())
  },[dispatch])


  return (  
       <div className="App">
         
          <Header/>
          {width < 1024 && <SearchComponent/>}
          <Filters filterShow={filterShow} setFilterShow={setFilterShow}/>
          {userTokenExpiredMessage  && <TokenExpired/>}
          <AlertWindow/>
          <Pages/>
          {/* <Footer/> */}

       </div>
  );
}

export default App;
