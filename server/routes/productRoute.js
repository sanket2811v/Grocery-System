import express from "express";
import { upload } from "../config/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  productById,
  productList,
} from "../controllers/productController.js";

const productRouter = express.Router();

// Field name must be the string "images" (not an array). Max 12 files.
productRouter.post("/add", upload.array("images", 12), authSeller, addProduct);

productRouter.get("/list", productList);

// Must be after /list so "list" is not captured as :id
productRouter.get("/:id", productById);

productRouter.post("/stock", authSeller, changeStock);

export default productRouter;
