import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

// pool of connections
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getBusinesses() {
    const [rows] = await pool.query("SELECT * FROM BUSINESS")
    return rows
}

export async function insertBusiness(business_id, business_name, days_of_op, ambient_type, address, business_category_id) {
    const result = await pool.query(`
    INSERT INTO BUSINESS (BUSINESS_ID, BUSINESS_NAME, DAYS_OF_OP, AMBIENT_TYPE, ADDRESS, BUSINESS_CATEGORY_ID)
    VALUES (?, ?, ?, ?, ?, ?)
    `, [business_id, business_name, days_of_op, ambient_type, address, business_category_id])
    return result
}

// const businesses = await getBusinesses()
// console.log(businesses)

// const result = await insertBusiness('B45', 'Con Azucar', 'Mon', 'Touristy', '3rd street', 'BCT6')
// console.log(result)