import React, { useEffect } from "react" 
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets" ;
import { useAppContext } from "../context/AppContext";
const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const { user, setUser, setShowLoginUser, navigate , searchQuery , setSearchQuery , getCartCount, axios, setCartItems} = useAppContext();
    const logout = async () => {
        try {
            await axios.get("/api/user/logout");
        } catch {
            /* still clear local session if cookie already expired */
        }
        setUser(null);
        setCartItems({});
        navigate("/") ;
    }

    useEffect(()=>{
        if(searchQuery.length > 0){
            navigate("/products")
        }
    },[searchQuery]);

    return(
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to='/' onClick={() => setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="Logo" />
            </NavLink>
            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/products'>All</NavLink>
                <NavLink to='/contact'>Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e)=>setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                   <img src={assets.search_icon} alt="Search Icon" className="w-4 h-6"></img>
                </div>

                <div onClick={()=>navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="Cart Icon" className="w-6 opacity-80"></img>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ? (
                    <button
                        onClick={() => setShowLoginUser(true)}
                        className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary transition text-white rounded-full"
                    >
                        Login
                    </button>
                    ) : (
                    <div className="relative group">
                        <img
                        src={assets.profile_icon}
                        alt="Profile"
                        className="w-10 h-10 cursor-pointer"
                        />

                        <ul className="absolute hidden group-hover:block right-0 bg-white shadow-md rounded-md p-2">
                        <li onClick={()=>navigate("my-orders")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            My Orders
                        </li>
                        <li onClick={logout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Logout
                        </li>
                        </ul>
                    </div>
                    )}
            </div>

            <div className="flex items-center gap-6 sm:hidden">
                <div onClick={()=>navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="Cart Icon" className="w-6 opacity-80"></img>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt="Menu Icon"></img>
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink to='/' onClick={() => setOpen(false)}>Home</NavLink>
                <NavLink to='/products' onClick={() => setOpen(false)}>All Products</NavLink>
                {user &&
                <NavLink to='/my-orders' onClick={() => setOpen(false)}>My Orders</NavLink>
                }
                <NavLink to='/contact' onClick={() => setOpen(false)}>Contact</NavLink>

                {!user ? (
                <button onClick={()=>{
                    setOpen(false) ;
                    setShowLoginUser(true) ;
                }}className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full text-sm">
                    Login
                </button>
                ) : (
                <button onClick={logout}className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full text-sm">
                    Logout
                </button>
                )}
            </div>
            )}
        </nav>
    );
}

export default Navbar ;
