import jwt from "jsonwebtoken";

const authSeller = async (request, response, next) => {
  const { sellerToken } = request.cookies;
  if (!sellerToken) {
    return response.json({ success: false, message: "Not Authorized" });
  }
  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return response.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

export default authSeller;
