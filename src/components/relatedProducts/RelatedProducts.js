import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Product from '../product/Product';
import UseWindowResize from '../../customHooks/UseWindowResize';

const RelatedProducts = ({relatedProducts}) => {
    const width = UseWindowResize()
    const responsive = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 1024 },
          items: 3,
        },
        desktop: {
          breakpoint: { max: 1024 , min: 800 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 800, min: 464 },
          items: 1
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };

  return (
    <div className='related_product_carousel'>
       <Carousel 
        className='carousel_product_card'
         responsive={responsive}
         showDots={true}
         >
            
        {
            relatedProducts?.map(product => <Product key={product?._id} id={product?._id}/>)
        }
      </Carousel>
    </div>
  )
}

export default RelatedProducts