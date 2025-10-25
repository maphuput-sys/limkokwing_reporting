import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0629",
  database: "luct",
});

try {
  const connection = await pool.getConnection();
  console.log("✅ Connected to MySQL database (luct)");
  connection.release();
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}

export default pool;
