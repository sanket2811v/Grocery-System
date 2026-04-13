// import { useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { useParams } from "react-router-dom";
// import { assets } from "../assets/assets";

// const ProductDetails = () => {

//     const {products , navigate , currency , addToCart} = useAppContext() ;
//     const {id} =useParams() ;
//     const [relatedProducts , setRelatedProducts] = useState([]) ;
//     const [thumbnail, setThumbnail] = useState(null);
//     const product = products.find((item) => item._id === id) ;

//     useEffect(()=>{
//         if(products.length > 0){
//             let productsCopy = products.slice() ;
//             productsCopy = productsCopy.filter((item) => product.category === item.category)
//             setRelatedProducts(productsCopy.slice(0 , 5))
//         }
//     },[products]);

//     useEffect(()=>{
//         setThumbnail(product?.image[0] ? product.image[0] : null)
//     },[]);

//     return product && (
//         <div className="mt-12">
//             <p>
//                 <Link to={"/"}>Home</Link> /
//                 <Link to={"/products"}> Products</Link> / 
//                 <Link to={`/products/${product.category.toLowerCase()}`}>{product.category}</Link> /
//                 <span className="text-indigo-500"> {product.name}</span>
//             </p>

//             <div className="flex flex-col md:flex-row gap-16 mt-4">
//                 <div className="flex gap-3">
//                     <div className="flex flex-col gap-3">
//                         {product.image.map((image, index) => (
//                             <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
//                                 <img src={image} alt={`Thumbnail ${index + 1}`} />
//                             </div>
//                         ))}
//                     </div>

//                     <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
//                         <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
//                     </div>
//                 </div>

//                 <div className="text-sm w-full md:w-1/2">
//                     <h1 className="text-3xl font-medium">{product.name}</h1>

//                     <div className="flex items-center gap-0.5 mt-1">
//                         {Array(5).fill('').map((_, i) => ((
//                                <img src={i<4 ? assets.star_icon : assets.star_dull_icon}  alt="" className="md:w-4 w-3.5"></img>
//                             )
//                         ))}
//                         <p className="text-base ml-2">(4)</p>
//                     </div>

//                     <div className="mt-6">
//                         <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
//                         <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
//                         <span className="text-gray-500/70">(inclusive of all taxes)</span>
//                     </div>

//                     <p className="text-base font-medium mt-6">About Product</p>
//                     <ul className="list-disc ml-4 text-gray-500/70">
//                         {product.description.map((desc, index) => (
//                             <li key={index}>{desc}</li>
//                         ))}
//                     </ul>

//                     <div className="flex items-center mt-10 gap-4 text-base">
//                         <button onClick={()=>addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
//                             Add to Cart
//                         </button>
//                         <button onClick={()=>{addToCart(product._id); navigate("/cart")}} className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition" >
//                             Buy now
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductDetails ;

import { useState, useEffect } from "react"; // ✅ FIXED
import { useAppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom"; // ✅ FIXED
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import {
    categoryLabel,
    categorySlug,
    productKey,
} from "../utils/productUtils";

const ProductDetails = () => {

    const { products, navigate, currency, addToCart } = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find(
        (item) => String(productKey(item)) === String(id)
    );

    // ✅ FIX: wait for product
    useEffect(() => {
        if (products.length > 0 && product) {
            let productsCopy = products.slice();

            productsCopy = productsCopy.filter(
                (item) =>
                    categoryLabel(item.category) === categoryLabel(product.category)
            );

            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [products, product]);

    // ✅ FIX: wait for product
    useEffect(() => {
        if (product) {
            setThumbnail(product.image?.[0] || null);
        }
    }, [product]);

    // ✅ SAFETY: prevent crash
    if (!product) {
        return (
            <div className="mt-12 text-center text-xl">
                {products.length > 0 ? "Product not found." : "Loading..."}
            </div>
        );
    }

    const catLabel = categoryLabel(product.category);
    const catSlug = categorySlug(product.category);
    const pid = productKey(product);
    const descriptionLines = Array.isArray(product.description)
        ? product.description
        : product.description != null
          ? [String(product.description)]
          : [];

    return (
        <div className="mt-12">
            <p className="text-sm md:text-base break-words">
                <Link to={"/"}>Home</Link> /
                <Link to={"/products"}> Products</Link> / 
                <Link to={`/products/${catSlug}`}>
                    {catLabel}
                </Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-4">
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                        {product.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setThumbnail(image)}
                                className="border w-20 sm:max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer shrink-0"
                            >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 w-full max-w-full sm:max-w-100 rounded overflow-hidden">
                        <img
                            src={thumbnail}
                            alt="Selected product"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-2xl md:text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill("").map((_, i) => (
                            <img
                                key={i}
                                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                                alt=""
                                className="md:w-4 w-3.5"
                            />
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">
                            MRP: {currency}{product.price}
                        </p>
                        <p className="text-2xl font-medium">
                            MRP: {currency}{product.offerPrice}
                        </p>
                        <span className="text-gray-500/70">
                            (inclusive of all taxes)
                        </span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center mt-10 gap-3 sm:gap-4 text-base">
                        <button
                            onClick={() => addToCart(pid)}
                            className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                        >
                            Add to Cart
                        </button>

                        <button
                            onClick={() => {
                                addToCart(pid);
                                navigate("/cart");
                            }}
                            className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary transition"
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                    {relatedProducts
                        .filter((product) => product.inStock)
                        .map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                </div>

                <button
                    onClick={() => {
                        navigate('/products');
                        scrollTo(0, 0);
                    }}
                    className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
                >
                    See more
                </button>

            </div>
        </div>
    );
};

export default ProductDetails;