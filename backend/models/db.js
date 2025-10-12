import mysql from "mysql2/promise";


const pool = mysql.createPool({
    host: "localhost",
    user: "root",       
    password: "0629",   
    database: "luct",   
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


(async () => {
    try {
        await pool.getConnection();
        console.log("✅ Connected to MySQL Database Pool: 'luct'");
    } catch (err) {
        console.error("❌ DB Connection Failed:", err.message);
        
        process.exit(1); 
    }
})();

export default pool;
