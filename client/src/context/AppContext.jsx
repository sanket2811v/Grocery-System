import { createContext, useContext , useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import App from "../App";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios" ;
import { productKey } from "../utils/productUtils";

axios.defaults.withCredentials = true ;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL ;

export const AppContext = createContext() ;

export const AppContextProvider = ({children}) => {
    const navigate = useNavigate() ;
    const [user , setUser] = useState(null) ;
    const [isSeller , setIsSeller] = useState(false) ;
    const [showLoginUser , setShowLoginUser] = useState(false) ;
    const [products , setProducts] = useState([]) ;
    const [cartItems , setCartItems] = useState({}) ;
    const [searchQuery , setSearchQuery] = useState({}) ;

    // Fetch Seller Status
const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

    const addToCart = (itemId) => {   // ✅ FIXED
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
        toast.success("Added to Cart");
    };

    const updateCartItem = (itemId , quantity) => {
        let cartData = structuredClone(cartItems) ;
        cartData[itemId] = quantity ;
        setCartItems(cartData) ;
        toast.success("Cart is updated") ;
    }

    const removeCartItem = (itemId) => {
        let cartData = structuredClone(cartItems) ;
        if(cartData[itemId]){
            cartData[itemId] -= 1 ;
            if(cartData[itemId] === 0){
                delete cartData[itemId] ;
            }
        }
        toast.success("Removed from Cart") ;
        setCartItems(cartData) ;
    }

    const getCartCount = () => {
        let totalCount = 0 
        for(const item in cartItems){
            totalCount += cartItems[item] ;
            }
        return totalCount ;
    }

    const getTotalAmount = () => {
        let totalAmount = 0 ;
        for(const items in cartItems){
            const itemInfo = products.find(
                (product) => String(productKey(product)) === String(items)
            );

            if(cartItems[items] > 0 && itemInfo){
                    totalAmount += itemInfo.offerPrice * cartItems[items] 
            } 
        }
        return Math.floor(totalAmount * 100 / 100) ;
    }

    const currency = import.meta.env.VITE_CURRENCY ;

// Fetch User Auth Status, User Data and Cart Items
const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
  
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch (error) {
      setUser(null);
    }
  };

    // Fetch All Products
const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
  
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts() 
    },[]) ;
    
    const value = {navigate , user , setIsSeller , setUser , isSeller , 
        showLoginUser , setShowLoginUser , products , currency , addToCart , updateCartItem , removeCartItem 
        , cartItems , setCartItems , searchQuery , setSearchQuery , getTotalAmount , getCartCount , axios , fetchProducts , fetchSeller , fetchUser   }  
    return <AppContext.Provider value={value}> 
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext) ;

}