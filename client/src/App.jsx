  // import React from "react";
  // import Navbar from "./components/Navbar";
  // import { Route, Routes, useLocation } from "react-router-dom";
  // import Home from "./pages/Home";
  // import {Toaster} from "react-hot-toast"
  // import Footer from "./components/Footer";
  // import { useAppContext } from "./context/AppContext";
  // import Login from "./components/Login";
  // import AllProducts from "./pages/AllProducts";
  // import ProductCategory from "./pages/ProductCategory";
  // import ProductDetails from "./pages/ProductDetails";
  // import Cart from "./pages/Cart"
  // import AddAddress from "./pages/AddAddress";
  // import MyOrders from "./pages/MyOrders";
  // import SellerLogin from "./components/SellerLogin";
  // import SellerLayout from "./pages/seller/SellerLayout";
  // const App = () => {
  //   const isSellerPath = useLocation().pathname.includes("seller");
  //   const {showLoginUser , isSeller} = useAppContext() ;


  //   return (
  //     <div className="text-default min-h-screen text-gray-700 bg-white">
  //       {/* Hide Navbar on seller routes */}
  //       {!isSellerPath && <Navbar />}
  //       {showLoginUser ? <Login/> : null} 
  //       <Toaster />
  //       <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
  //         <Routes>
  //           <Route path="/" element={<Home />} />
  //           <Route path="/products" element={<AllProducts />} />
  //           <Route path="/products/:category" element={<ProductCategory />} /> 
  //           <Route path="/products/:category/:id" element={<ProductDetails />}/>    
  //           <Route path="/cart" element={<Cart />}/>  
  //           <Route path="/add-address" element={<AddAddress/>} />
  //           <Route path="/my-orders" element={<MyOrders/>} />
  //           <Route path="/seller" element={isSeller ? <SellerLayout/> : <SellerLogin />} />
  //         </Routes>
  //       </div>
  //       {!isSellerPath && <Footer />}
  //     </div>
  //   );
  // };

  // export default App; 

  // import React from "react";
  // import Navbar from "./components/Navbar";
  // import { Route, Routes, useLocation } from "react-router-dom";
  // import Home from "./pages/Home";
  // import { Toaster } from "react-hot-toast";
  // import Footer from "./components/Footer";
  // import { useAppContext } from "./context/AppContext";
  // import Login from "./components/Login";
  // import AllProducts from "./pages/AllProducts";
  // import ProductCategory from "./pages/ProductCategory";
  // import ProductDetails from "./pages/ProductDetails";
  // import Cart from "./pages/Cart";
  // import AddAddress from "./pages/AddAddress";
  // import MyOrders from "./pages/MyOrders";
  // import SellerLogin from "./components/SellerLogin";
  // import SellerLayout from "./pages/seller/SellerLayout";

  // const App = () => {
  //   const isSellerPath = useLocation().pathname.includes("seller");
  //   const { showLoginUser, isSeller } = useAppContext();

  //   return (
  //     <div className="text-default min-h-screen text-gray-700 bg-white">
        
  //       {!isSellerPath && <Navbar />}
  //       {showLoginUser ? <Login /> : null}
  //       <Toaster />

  //       <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
  //         <Routes>
  //           <Route path="/" element={<Home />} />
  //           <Route path="/products" element={<AllProducts />} />
  //           <Route path="/products/:category" element={<ProductCategory />} />
  //           <Route path="/products/:category/:id" element={<ProductDetails />} />
  //           <Route path="/cart" element={<Cart />} />
  //           <Route path="/add-address" element={<AddAddress />} />
  //           <Route path="/my-orders" element={<MyOrders />} />

  //           {/* ✅ FIXED SELLER ROUTES */}
  //           <Route
  //             path="/seller"
  //             element={isSeller ? <SellerLayout /> : <SellerLogin />}
  //           >
  //             <Route index element={<div>Dashboard</div>} />
  //             <Route path="product-list" element={<div>Product List</div>} /> 
  //             <Route path="orders" element={<div>Orders</div>} />
  //           </Route>
  //         </Routes>
  //       </div>

  //       {!isSellerPath && <Footer />}
  //     </div>
  //   );
  // };

  // export default App;

import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import Contact from "./pages/Contact";

// ✅ IMPORTANT IMPORT
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showLoginUser, isSeller } = useAppContext();

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">

      {!isSellerPath && <Navbar />}
      {showLoginUser ? <Login /> : null}
      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/contact" element={<Contact />} />

          {/* ✅ SELLER ROUTES FIXED */}
          <Route
            path="/seller"
            element={isSeller ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList/>} />
            <Route path="orders" element={<Orders/>} />
          </Route>

        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;