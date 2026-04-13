import jwt from "jsonwebtoken";

export const sellerLogin = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      response.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return response.json({ success: true, message: "Successfully logged in" });
    }
    return response.json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    console.log(error.message);
    return response.json({ success: false, message: error.message });
  }
};

export const isSellerAuth = async (request, response) => {
  try {
    return response.json({ success: true });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

export const logout = async (request, response) => {
  try {
    response.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return response.json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    console.log(error.message);
    return response.json({ success: false, message: error.message });
  }
};
