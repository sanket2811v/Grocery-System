import express from "express";
import {
  login,
  register,
  isAuth,
  logout,
  updateCart,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/is-auth", authUser, isAuth);
router.post("/cart", authUser, updateCart);
router.get("/logout", authUser, logout);

export default router;