import User from "../models/UserModel.js";

// Mirrors the original workflow in your screenshot:
// POST /api/cart/update (authUser middleware sets req.userId)
// Body: { userId, cartItems }
export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body || {};
    const finalUserId = userId ?? req.userId;

    if (!finalUserId) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    // cartItems is an object like: { "<productId>": quantity }
    await User.updateCartItems(finalUserId, cartItems || {});

    // Keep response shape/message stable.
    return res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

