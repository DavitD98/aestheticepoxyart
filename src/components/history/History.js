import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectToken } from '../../features/token/tokenSlice'
import { fetchHistory, selectHistory, selectSortedHisotry } from '../../features/user/userSlice'
import { selectCurrentLanguage } from '../../features/languages/languagesSlice'
import { dialogues } from './historyDialogues'
import HistoryItem from '../historyItem/HistoryItem'
import UseWindowResize from '../../customHooks/UseWindowResize'

const History = () => {
    const dispatch = useDispatch()
    const {width} = UseWindowResize()

    const currentLanguage = useSelector(selectCurrentLanguage)
    const token = useSelector(selectToken)
    const history = useSelector(selectHistory)
    useEffect(() => {
        if(token){
            dispatch(fetchHistory(token))
        }
      
    },[token])
    
  return (
    <div className='order_history'>
        <table className='orders_table'>
            <thead>
                <tr>
                    <th>{dialogues.orderDate[currentLanguage]}</th>
                    <th>{dialogues.orderTotal[currentLanguage]}</th>
                    {/* {width >= 720 && <th>{dialogues.orderProducts[currentLanguage]}</th>} */}
                    <th>{dialogues.deliveryAddress[currentLanguage]}</th>
                    <th>{dialogues.orderStatus[currentLanguage]}</th>
                </tr>
            </thead>

            <tbody>
                {
                    history?.map((order) => <HistoryItem key={order?._id} order={order}/>)
                    
                }
            </tbody>
        </table>
        </div>
  )
}

export default History