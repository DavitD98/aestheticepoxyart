import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editOrder, selectOrderById } from '../../features/orders/ordersSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { selectStatuses, selectStatusesIds } from '../../features/statuses/statusesSlice'
import { dialogues } from '../CreateProduct/createProductDialogues'
import { selectToken } from '../../features/token/tokenSlice'

const OrderAdmin = React.memo(({id}) => {
    const dispatch = useDispatch()
    const order = useSelector(state => selectOrderById(state,id))
    const address = order?.address
    
    const token = useSelector(selectToken)
    const currentLanguage = useSelector(selectCurrentLanguage)
    const statuses = useSelector(selectStatuses)
    const statusOfOrder = statuses?.find(status => status?._id === order?.status)
    const filteredStatuses = statuses?.filter(status => status?._id !== order?.status)
     
    const [editedOrder,setEditedOrder] = useState()
    const [enableSave,setEnableSave] = useState(false)

    // sets order to edit
    useEffect(() => {
       if(order){
        setEditedOrder(order)
       }
    },[order])

    // If status is not changed,save is disabled
    useEffect(() => {
      if(editedOrder?.status === order?.status){
        setEnableSave(false)
      }
    },[editedOrder])

    const handleChangeStatus = (e) => {
        setEditedOrder({
          ...editedOrder,
          status:e.target.value
        })
        setEnableSave(true)
    }

    const handleSave = () => {
      const fetchParameters = {
        editedOrder:editedOrder,
        token:token
      }
      dispatch(editOrder({fetchParameters}))
      setEnableSave(false)
    }

  return (
    <tr>
        <td>{order?.date}</td>
        <td>{order?.totalAmount}</td>
        <td>Ordered Products{order?.products?.length}</td>
        <td>{address?.home} {address?.street} {address?.city} {address?.region} </td>
        <td>
          <select className='main_select' onChange={handleChangeStatus}>
            <option value={statusOfOrder?._id}>{statusOfOrder?.name[currentLanguage]}</option>
            {
              filteredStatuses?.map(status => (
                <option key={status?._id} value={status?._id}>{status?.name[currentLanguage]}</option>
              ))
            }
          </select>

        
         {
         enableSave && 
           <button className='btn btnDelete' onClick={handleSave}>
             {dialogues.save[currentLanguage]}
           </button>
           } 
          </td>
    </tr>
  )
})

export default OrderAdmin