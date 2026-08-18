/**
 * Run this script ONCE to set up the CRM database and users table.
 * Usage: node database/setup.js
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function setup() {
  console.log('🔧 Setting up CRM database...\n');

  // Connect without a database first to create it
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    // Create database
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database '${process.env.DB_NAME}' created / already exists.`);

    // Use it
    await connection.query(`USE \`${process.env.DB_NAME}\``);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT            NOT NULL AUTO_INCREMENT,
        name        VARCHAR(100)   NOT NULL,
        email       VARCHAR(150)   NOT NULL,
        phone       VARCHAR(15)    NOT NULL,
        password    VARCHAR(255)   NOT NULL,
        created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_users_email (email),
        INDEX idx_users_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table \'users\' created / already exists.');

    console.log('\n🎉 Database setup complete!');
    console.log('   You can now start the backend with: npm run dev');
  } catch (err) {
    console.error('\n❌ Setup failed:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setup();
