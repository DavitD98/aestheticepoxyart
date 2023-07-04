
import React, { useEffect, useState } from 'react'
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPhone} from "@fortawesome/free-solid-svg-icons"
import {faEnvelope} from "@fortawesome/free-solid-svg-icons"
import BASE_URL from '../../api/baseUrl'
import { Link } from 'react-router-dom'
import UseWindowResize from '../../customHooks/UseWindowResize'

const Contact = () => {

    const {width} = UseWindowResize()
    const [contactInfo,setContactInfo] = useState()

    useEffect(() => {
      const getContactInfo = async () => {
        try{
            const response = await axios.get(`${BASE_URL}/api/contactinfor`) 
            setContactInfo(response?.data?.adminContact)
        }catch(error){
            throw error
        }
      }

      getContactInfo()
    },[])
    
    const emailAddress = `mailto:${contactInfo?.email}`
    const phoneAddress = `tel:${contactInfo?.phone}`
  return (
    <div className={width >= 1024 ? "contact" : "contact contact_responsive"}>
        <span>
        <Link to={phoneAddress}>
            <FontAwesomeIcon icon={faPhone} size="sm" style={{color: "#b5b5b5",}} />
            {contactInfo?.phone}
          </Link>
        </span>
        <span>
            <Link to={emailAddress}>
               <FontAwesomeIcon icon={faEnvelope} size="sm" style={{color: "#b5b5b5",}} />
               {contactInfo?.email}
            </Link>
        </span>
    </div>
  )
}

export default Contact