import mysql from "mysql2/promise";
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "sls@1002",
    database: "datalens",
});

export default db;