import express from "express";
import {
  isSellerAuth,
  sellerLogin,
  logout,
} from "../controllers/sellerController.js";
import {
  addProduct,
  productList,
  productById,
  changeStock,
} from "../controllers/productController.js";
import { uploadProductImages } from "../config/multer.js";
import authSeller from "../middlewares/authSeller.js";

const sellerRouter = express.Router();

sellerRouter.post("/login", sellerLogin);
sellerRouter.get("/is-auth", authSeller, isSellerAuth);
sellerRouter.get("/logout", logout);

sellerRouter.post(
  "/add-product",
  authSeller,
  uploadProductImages,
  addProduct
);
sellerRouter.get("/product-list", authSeller, productList);
sellerRouter.get("/product/:id", authSeller, productById);
sellerRouter.post("/change-stock", authSeller, changeStock);

export default sellerRouter;