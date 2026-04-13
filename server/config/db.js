import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected successfully ✅");
  } catch (error) {
    console.error("DB connection error:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

export { pool };
export default connectDB;