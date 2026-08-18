-- ============================================================
-- CRM 2.0 — Database Schema
-- Run this in MySQL Workbench before starting the backend
-- ============================================================

CREATE DATABASE IF NOT EXISTS crm_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crm_db;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Test User (run AFTER backend registers it, or use the app)
-- Password hash below is for: Test@12345
-- ============================================================
-- INSERT INTO users (name, email, phone, password) VALUES
-- ('Test CRM User', 'testcrm@example.com', '9876543210',
--  '$2a$12$exampleHashHere');
-- Use the Register page to create the test user instead.
