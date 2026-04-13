import User, { mapPublicUser } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: mapPublicUser(user),
    });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: mapPublicUser(user),
    });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const isAuth = async (request, response) => {
  try {
    const user = await User.getUserById(request.userId);
    if (!user) {
      return response.json({ success: false, message: "User not found" });
    }
    return response.json({ success: true, user: mapPublicUser(user) });
  } catch (error) {
    console.error(error.message);
    return response.json({ success: false, message: error.message });
  }
};

export const updateCart = async (request, response) => {
  try {
    const { cartItems } = request.body;
    if (cartItems === undefined) {
      return response.json({
        success: false,
        message: "cartItems is required",
      });
    }
    const row = await User.updateCartItems(request.userId, cartItems);
    return response.json({ success: true, user: mapPublicUser(row) });
  } catch (error) {
    console.error(error.message);
    return response.json({ success: false, message: error.message });
  }
};

export const logout = async (request, response) => {
  try {
    response.clearCookie("token", {
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
