import React from 'react'
import { useSelector } from 'react-redux'
import { selectOrdersIds, selectSortedOrders } from '../../features/orders/ordersSlice'
import OrderAdmin from '../orderAdmin/OrderAdmin'
import OrderStatus from '../orderStatus/OrderStatus'

const OrdersAdmin = () => {
    const ordersIds = useSelector(selectOrdersIds)
    const sortedOrders = useSelector(selectSortedOrders)
    
  return (
    <div className='orders_admin'>
        <OrderStatus/>
        <table className='orders_table'>
            <thead>
                <tr>
                        <th>Order date</th>
                        <th>Order total Amount</th>
                        <th>Order products</th>
                        <th>Delivery address</th>
                        <th>Order status</th>
                </tr>
            </thead>

            <tbody>
                 {
                    sortedOrders?.map(order => <OrderAdmin id={order?._id} key={order?._id}/>)
                 }
            </tbody>
        </table>
    </div>
  )
}

export default OrdersAdmin