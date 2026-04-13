// import React from "react"
// import { assets } from "../assets/assets";
// import { useAppContext } from "../context/AppContext";
// const ProductCard = ({product}) => {
//     // const [count, setCount] = React.useState(0);
//     if (!product) return null; // ✅ SAFE GUARD

//     const count = cartItems?.[product?._id] || 0; // ✅ SAFE ACCESS

//     const {currency , addToCart , updateCartItem , removeCartItem , cartItems , navigate} = useAppContext() ;

//     return product && (
//         <div className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
//             <div className="group cursor-pointer flex items-center justify-center px-2">
//                 <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
//             </div>
//             <div className="text-gray-500/60 text-sm">
//                 <p>{product.category}</p>
//                 <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
//                 <div className="flex items-center gap-0.5">
//                     {Array(5).fill('').map((_, i) => (
//                           <img key={i} className="md:w-3.5 w-3" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt=""/>
//                     ))}
//                     <p>(4)</p>
//                 </div>
//                 <div className="flex items-end justify-between mt-3">
//                     <p className="md:text-xl text-base font-medium text-primary">
//                         {currency}${product.offerPrice}{" "} <span className="text-gray-500/60 md:text-sm text-xs line-through">{currency}${product.price}</span>
//                     </p>
//                     <div className="text-primary" onClick={(e)=> {e.stopPropagation(); }}>
//                         {!cartItems[product._id] ? (
//                             <button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded text-primary cursor-pointer" onClick={() => addToCart(product._id)} >
//                                 <img src={assets.cart_icon} alt="cart_icon" />
//                                 Add
//                             </button>
//                         ) : (
//                             <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
//                                 <button onClick={() => {removeCartItem(product._id)}} className="cursor-pointer text-md px-2 h-full" >
//                                     -
//                                 </button>
//                                 <span className="w-5 text-center">{count}</span>
//                                 <button onClick={() => {addToCart(product._id)}} className="cursor-pointer text-md px-2 h-full" >
//                                     +
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCard ;

// import React from "react"
// import { assets } from "../assets/assets";
// import { useAppContext } from "../context/AppContext";

// const ProductCard = ({product}) => {

//     const {currency , addToCart , updateCartItem , removeCartItem , cartItems , navigate} = useAppContext() ;

//     if (!product) return null; // ✅ SAFE GUARD

//     const count = cartItems?.[product?._id] || 0; // ✅ SAFE ACCESS

//     return (
//         <div className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
//             <div className="group cursor-pointer flex items-center justify-center px-2">
//                 <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
//             </div>

//             <div className="text-gray-500/60 text-sm">
//                 <p>{product.category}</p>
//                 <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>

//                 <div className="flex items-center gap-0.5">
//                     {Array(5).fill('').map((_, i) => (
//                         <img key={i} className="md:w-3.5 w-3" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt=""/>
//                     ))}
//                     <p>(4)</p>
//                 </div>

//                 <div className="flex items-end justify-between mt-3">
//                     <p className="md:text-xl text-base font-medium text-primary">
//                         {currency}${product.offerPrice}{" "}
//                         <span className="text-gray-500/60 md:text-sm text-xs line-through">
//                             {currency}${product.price}
//                         </span>
//                     </p>

//                     <div className="text-primary" onClick={(e)=> {e.stopPropagation(); }}>

//                         {count === 0 ? (
//                             <button
//                                 className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded text-primary cursor-pointer"
//                                 onClick={() => addToCart(pid)}
//                             >
//                                 <img src={assets.cart_icon} alt="cart_icon" />
//                                 Add
//                             </button>
//                         ) : (
//                             <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                                
//                                 <button
//                                     onClick={() => removeCartItem(product._id)}
//                                     className="cursor-pointer text-md px-2 h-full"
//                                 >
//                                     -
//                                 </button>

//                                 <span className="w-5 text-center">{count}</span>

//                                 <button
//                                     onClick={() => addToCart(pid)}
//                                     className="cursor-pointer text-md px-2 h-full"
//                                 >
//                                     +
//                                 </button>

//                             </div>
//                         )}

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;

import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import {
  categoryLabel,
  categorySlug,
  productKey,
} from "../utils/productUtils";

const ProductCard = ({ product }) => {
  const {
    currency,
    addToCart,
    removeCartItem,
    cartItems,
    navigate,
  } = useAppContext();

  if (!product) return null;

  const pid = productKey(product);
  const slug = categorySlug(product.category);
  const count = cartItems?.[pid] || cartItems?.[product?._id] || 0;

  return (
    <div
      onClick={() => {
        navigate(`/products/${slug}/${pid}`);
        scrollTo(0, 0);
      }}
      className="bg-white border border-gray-200 rounded-xl p-4 
                    shadow-sm hover:shadow-md transition duration-300 
                    flex flex-col justify-between w-full">

      {/* Image */}
      <div className="group cursor-pointer flex items-center justify-center mb-4">
        <img
          className="group-hover:scale-105 transition duration-300 h-28 object-contain"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow space-y-1">
        <p className="text-gray-400 text-sm">{categoryLabel(product.category)}</p>

        <p className="text-gray-800 font-medium text-base truncate">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="w-3.5"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt=""
              />
            ))}
          <p className="text-gray-400 text-sm">(4)</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-end justify-between mt-4">
        {/* Price */}
        <div>
          <p className="text-lg font-semibold text-primary">
            {currency}{product.offerPrice}
          </p>
          <p className="text-gray-400 text-sm line-through">
            {currency}{product.price}
          </p>
        </div>

        {/* Cart Controls */}
        <div onClick={(e) => e.stopPropagation()}>
          {count === 0 ? (
            <button
              className="flex items-center justify-center gap-1 
                         bg-primary/10 border border-primary/40 
                         px-3 py-1.5 rounded-lg text-primary text-sm 
                         hover:bg-primary hover:text-white transition"
              onClick={() => addToCart(pid)}
            >
              <img src={assets.cart_icon} alt="cart_icon" className="w-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 px-2 h-8 
                            bg-primary/20 rounded-lg">
              <button
                onClick={() => removeCartItem(pid)}
                className="px-2 text-lg"
              >
                -
              </button>

              <span className="w-5 text-center">{count}</span>

              <button
                onClick={() => addToCart(pid)}
                className="px-2 text-lg"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;