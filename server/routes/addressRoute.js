import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addAddress,
  getAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

// POST /api/address/add
addressRouter.post("/add", authUser, addAddress);

// GET or POST /api/address/get (client uses POST with empty body)
addressRouter.get("/get", authUser, getAddress);
addressRouter.post("/get", authUser, getAddress);

export default addressRouter;

