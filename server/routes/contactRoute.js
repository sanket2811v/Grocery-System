import express from "express";
import { createContact } from "../controllers/contactController.js";

const contactRouter = express.Router();

// Public endpoint to create a contact message
contactRouter.post("/", createContact);

export default contactRouter;