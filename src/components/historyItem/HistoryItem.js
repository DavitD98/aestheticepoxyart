
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { dialogues } from '../history/historyDialogues'
import { selectStatusById, selectStatuses } from '../../features/statuses/statusesSlice'
import UseWindowResize from '../../customHooks/UseWindowResize'

const HistoryItem = React.memo(({order}) => {
    const {width} = UseWindowResize()
    const currentLanguage = useSelector(selectCurrentLanguage)
    const [productListShow,setProductListShow] = useState(false)
    const status = useSelector(state => selectStatusById(state,order?.status))

  return (
    <tr key={order?._id}  onClick={()=>setProductListShow(!productListShow) }>
                            <td>{order?.date}</td>
                            <td>{order?.totalAmount} {dialogues.amCurrency[currentLanguage]}</td>
                           
                            <td>
                            {`${order?.address.home} 
                             ${order?.address?.street}
                             ${order?.address?.city} 
                             ${order?.address?.region}`}
                             </td>
                            <td>{status?.name[currentLanguage]}</td>


                            <div className={
                                                productListShow ? "ordered_products_container ordered_products_container_open"
                                                : "ordered_products_container "
                                                 }>
                                 {
                                    productListShow &&
                                      <ul className="ordered_product_list">
                                        {
                                            order?.cart?.map((product,index) => (
                                                <li key={product?._id}>
                                                    <img src={product?.images?.url}/>
                                                    <span className='bold'>{product?.name[currentLanguage]}</span>
                                                    <span> {`${product?.quantity} ${dialogues.pc[currentLanguage]} x ${product?.price}
                                                            ${dialogues.amCurrency[currentLanguage]}`}
                                                     </span>
                                                        
                                                </li>
                                            ))
                                        }
                                    </ul>
                                     }
                            </div>
                        </tr>
  )
})

export default HistoryItem