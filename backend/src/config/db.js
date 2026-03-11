const path = require('path');
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise'); // Required to create the DB if it doesn't exist
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, MYSQL_URL, DATABASE_URL } = process.env;

// Check if we have a full URL (Railway/Production) or separate parts
const connectionUrl = MYSQL_URL || DATABASE_URL;

/**
 * Enhanced Database Initialization
 * 1. Checks if the Database exists.
 * 2. Creates it if missing.
 */
const initializeDatabase = async () => {
  if (connectionUrl) {
    console.log('✅ Using production database connection URL.');
    return;
  }

  // 1. Connect to MySQL without specifying a database first
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
  });

  // 2. Run the Create Database command
  console.log(`Checking if database "${DB_NAME}" exists...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.end();
};

// We export a promise that resolves to the sequelize instance
const sequelize = connectionUrl
  ? new Sequelize(connectionUrl, {
    dialect: 'mysql',
    logging: false,
  })
  : new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
  });

// Helper function to be called in server.js
module.exports = { sequelize, initializeDatabase };