import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  user: "6us27jBuQ8SY9kd.root",
  password: "IJcg6ssNnlimAvvr",
  database: "test",
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {rejectUnauthorized: true}
});

try {
  const connection = await pool.getConnection();
  console.log("✅ Connected to MySQL database (luct)");
  connection.release();
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}

export default pool;
