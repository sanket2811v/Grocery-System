🛒 Grocery E-Commerce Web Application

A full-stack grocery e-commerce web application featuring both customer and seller/admin workflows. The platform is built using modern technologies including React, Vite, Express, PostgreSQL, Cloudinary, JWT authentication, and Stripe payments.

🚀 Features
👤 Customer Features
User authentication: Register, Login, Logout
Browse products:
View all products
Filter by category
Search functionality
Product details page with related products
Shopping cart:
Add, update, and remove items
Address management:
Add and manage delivery addresses
Order placement:
Cash on Delivery (COD)
Online Payment (Stripe Checkout)
Order tracking:
View order history (My Orders)
🛍️ Seller / Admin Features
Seller authentication: Login, Logout
Product management:
Add new products with images
View product list
Toggle product availability (In Stock / Out of Stock)
Order management:
View customer orders
📩 Additional Features
Contact form API integration
Fully responsive UI:
Mobile
Tablet
Desktop
🧰 Tech Stack
🎨 Frontend (client)
React
Vite
Tailwind CSS
React Router
Axios
React Hot Toast
⚙️ Backend (server)
Node.js
Express.js
PostgreSQL (pg)
JWT Authentication with HTTP-only cookies
Cloudinary (image uploads)
Stripe (online payments)
📁 Folder Structure
Grocery/
├── client/                 # Frontend application
├── server/                 # Backend API
│   └── sql/                # Database schema & migration files
└── README.md
🔐 Environment Variables
server/.env
client/.env

⚠️ Important:
Do NOT commit .env files or sensitive credentials to GitHub.

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone <your-repository-url>
cd Grocery
2️⃣ Install Dependencies
Backend
cd server
npm install
Frontend
cd client
npm install
3️⃣ Setup PostgreSQL Database

Run the SQL files located in server/sql/ in the following order:

000_users.sql
001_products.sql
003_addresses.sql
004_orders.sql
005_products_category_string.sql
▶️ Run the Project

Open two terminals:

Terminal 1 – Start Backend
cd server
npm run dev
Terminal 2 – Start Frontend
cd client
npm run dev
🌐 Application URLs
Frontend: http://localhost:5173
Backend: http://localhost:4000
🔗 API Routes (Base)

All APIs are served under:

/api
Main Route Groups:
/api/user
/api/seller
/api/product
/api/cart
/api/address
/api/order
/api/contact