import "dotenv/config"; // ✅ MUST BE FIRST

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import productRoutes from "./routes/productRoute.js";
import connectCloudinary from "./config/cloudinary.js" ;
import cartRouter from "./routes/cartRoutes.js" ;
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js" ;
import contactRouter from "./routes/contactRoute.js";

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = ["http://localhost:5173"];

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// routes
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart" , cartRouter) ;
app.use("/api/address", addressRouter);
app.use("/api/order" , orderRouter) ;
app.use("/api/contact" , contactRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

// start server
const startServer = async () => {
  await connectDB();
  await connectCloudinary() ;
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();