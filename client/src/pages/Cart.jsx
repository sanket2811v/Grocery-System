import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { categorySlug, productKey } from "../utils/productUtils";
import toast from "react-hot-toast";

const Cart = () => {
    const {
        products,
        navigate,
        currency,
        cartItems,
        removeCartItem,
        getCartCount,
        updateCartItem,
        getTotalAmount,
        axios,
        user,
        setCartItems,
    } = useAppContext();

    const location = useLocation();

    const [cartArray, setCartArray] = useState([]);
    const [address, setAddress] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");
    const [placingOrder, setPlacingOrder] = useState(false);

    const getUserAddress = async () => {
        try {
            const { data } = await axios.post("/api/address/get", {});

            if (data.success && Array.isArray(data.addresses)) {
                setAddress(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                } else {
                    setSelectedAddress(null);
                }
            } else if (!data.success) {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    error.message ||
                    "Failed to load addresses"
            );
        }
    };

    const placeOrder = async () => {
        if (!user) {
            toast.error("Please log in to place an order");
            return;
        }
        if (!selectedAddress) {
            toast.error("Please select an address");
            return;
        }
        if (getCartCount() === 0 || cartArray.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setPlacingOrder(true);
        try {
            const userId = user.id ?? user._id;
            const addressId = selectedAddress.id ?? selectedAddress._id;
            const items = cartArray.map((item) => ({
                product: productKey(item),
                quantity: item.quantity,
            }));

            if (paymentOption === "COD") {
                const { data } = await axios.post("/api/order/cod", {
                    userId,
                    items,
                    address: addressId,
                });

                if (data.success) {
                    toast.success(data.message || "Order placed successfully");
                    setCartItems({});
                    try {
                        await axios.post("/api/user/cart", { cartItems: {} });
                    } catch {
                        /* cart cleared locally; server sync optional */
                    }
                    navigate("/my-orders");
                } else {
                    toast.error(data.message || "Could not place order");
                }
            } else {
                const { data } = await axios.post("/api/order/stripe", {
                    userId,
                    items,
                    address: addressId,
                });

                if (data.success && data.url) {
                    window.location.href = data.url;
                } else {
                    toast.error(data.message || "Could not start payment");
                }
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    error.message ||
                    "Failed to place order"
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    const getCart = () => {
        const tempArray = [];

        for (const key in cartItems) {
            if (!Object.prototype.hasOwnProperty.call(cartItems, key)) continue;
            const product = products.find(
                (item) => String(productKey(item)) === String(key)
            );

            if (product) {
                tempArray.push({
                    ...product,
                    quantity: cartItems[key],
                });
            }
        }

        setCartArray(tempArray);
    };


    // ✅ FIXED useEffect
    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    useEffect(() => {
        if (user) {
            getUserAddress();
        } else {
            setAddress([]);
            setSelectedAddress(null);
        }
    }, [user, location.pathname]);

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16">
            
            {/* LEFT SIDE */}
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart{" "}
                    <span className="text-sm text-primary">
                        {getCartCount()} Items
                    </span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
                    >
                        <div className="flex items-center md:gap-6 gap-3">
                            
                            {/* PRODUCT IMAGE */}
                            <div
                                onClick={() => {
                                    navigate(
                                        `/products/${categorySlug(product.category)}/${productKey(product)}`
                                    );
                                    scrollTo(0, 0);
                                }}
                                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                            >
                                <img
                                    className="max-w-full h-full object-cover"
                                    src={
                                        Array.isArray(product.image)
                                            ? product.image[0]
                                            : product.image
                                    }
                                    alt={product.name}
                                />
                            </div>

                            {/* PRODUCT DETAILS */}
                            <div>
                                <p className="font-semibold">
                                    {product.name}
                                </p>

                                <div className="font-normal text-gray-500/70">
                                    <p>
                                        Weight:{" "}
                                        <span>{product.weight || "N/A"}</span>
                                    </p>

                                    <div className="flex items-center">
                                        <p>Qty:</p>

                                        <select
                                            className="outline-none"
                                            value={product.quantity}
                                            onChange={(e) =>
                                                updateCartItem(
                                                    productKey(product),
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {Array(
                                                product.quantity > 9
                                                    ? product.quantity
                                                    : 9
                                            )
                                                .fill("")
                                                .map((_, i) => (
                                                    <option
                                                        key={i}
                                                        value={i + 1}
                                                    >
                                                        {i + 1}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PRICE */}
                        <p className="text-center">
                            {currency}
                            {product.offerPrice * product.quantity}
                        </p>

                        {/* REMOVE */}
                        <button
                            onClick={() => removeCartItem(productKey(product))}
                            className="cursor-pointer mx-auto"
                        >
                            <img
                                src={assets.remove_icon}
                                alt="remove"
                                className="inline-block w-6 h-6"
                            />
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => {
                        navigate("/products");
                        scrollTo(0, 0);
                    }}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
                >
                    <img src={assets.arrow_right_icon_colored} alt="arrow" />
                    Continue Shopping
                </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">
                    Order Summary
                </h2>

                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">
                        Delivery Address
                    </p>

                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">
                            {selectedAddress
                                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                                : "No Address Found"}
                        </p>

                        <button
                            onClick={() => setShowAddress(!showAddress)}
                            className="text-primary hover:underline cursor-pointer"
                        >
                            Change
                        </button>

                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                
                                {address.map((addr, index) => (
                                    <p
                                        key={index}
                                        onClick={() => {
                                            setSelectedAddress(addr);
                                            setShowAddress(false);
                                        }}
                                        className="text-gray-500 p-2 hover:bg-gray-100"
                                    >
                                        {addr.street}, {addr.city}, {addr.state}, {addr.country}
                                    </p>
                                ))}

                                <p
                                    onClick={() => navigate("/add-address")}
                                    className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                                >
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">
                        Payment Method
                    </p>

                    <select
                        onChange={(e) => setPaymentOption(e.target.value)}
                        className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
                    >
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span>
                        <span>{currency}{getTotalAmount()}</span>
                    </p>

                    <p className="flex justify-between">
                        <span>Shipping Fee</span>
                        <span className="text-green-600">Free</span>
                    </p>

                    <p className="flex justify-between">
                        <span>Tax (2%)</span>
                        <span>{currency}{(getTotalAmount() * 2) / 100}</span>
                    </p>

                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span>
                        <span>
                            {currency}
                            {getTotalAmount() + (getTotalAmount() * 2) / 100}
                        </span>
                    </p>
                </div>

                <button
                    type="button"
                    disabled={placingOrder}
                    onClick={placeOrder}
                    className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {placingOrder
                        ? "Placing order…"
                        : paymentOption === "COD"
                          ? "Place Order"
                          : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ) : null;
};

export default Cart;