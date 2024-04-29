import mysql from 'mysql2'
import express from 'express'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function insertAccount(username, password) {
    const sql = `
        INSERT INTO ACCOUNT (username, password) 
        VALUES (?, ?);    
    `;
    try {
        const [result] = await pool.query(sql, [username, password]);
        if (result.affectedRows) {
            return { username, password, inserted: true };
        } else {
            throw new Error('Insert failed, no rows affected');
        }
    } catch (error) {
        throw new Error('Failed to insert business: ' + error.message);
    }
}

export async function getAccount(username, password) {
    const sql = `
        SELECT * FROM ACCOUNT WHERE username = ? AND password = ?
    `;
    try {
        const [rows] = await pool.query(sql, [username, password]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('Wrong username/password combination');
        }
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
}