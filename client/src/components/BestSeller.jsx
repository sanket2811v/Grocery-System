// // import React from "react" 
// // import ProductCard from "./ProductCard";

// // const BestSeller = () => {
// //     return(
// //         <div className='mt-16'>
// //             <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
// //             <ProductCard product={products[0]}></ProductCard>
// //         </div>
// //     );
// // }

// // export default BestSeller ;


// import React from "react";
// import ProductCard from "./ProductCard";
// import { useAppContext } from "../context/AppContext"; // ✅ ADD

// const BestSeller = () => {

//     const { products } = useAppContext(); // ✅ FIX

//     return (
//         <div className='mt-16'>
//             <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
//             <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-8 mt-6'>                {products.filter((product)=>product.inStock).slice(0,5).map((product , index)=>(
//                     <ProductCard key={index} product={product} />
//                 ))}  
//             </div>

//             {/* {products.length > 0 && (   // ✅ SAFE
//                 <ProductCard product={products[0]} />
//             )} */}
//         </div>
//     );
// }

// export default BestSeller;

import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
  const { products } = useAppContext()

  return (
    <div className='mt-16 px-4 md:px-8'>
      <p className='text-2xl md:text-3xl font-semibold mb-6'>
        Best Sellers
      </p>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-8'>
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  )
}

export default BestSeller;