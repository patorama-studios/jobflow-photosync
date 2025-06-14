-- MySQL Migration Script for JobFlow PhotoSync
-- Converted from Supabase TypeScript definitions
-- Generated on 2025-06-14

SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `team_invitations`;
DROP TABLE IF EXISTS `company_teams`;
DROP TABLE IF EXISTS `order_payouts`;
DROP TABLE IF EXISTS `order_communication`;
DROP TABLE IF EXISTS `order_activities`;
DROP TABLE IF EXISTS `additional_appointments`;
DROP TABLE IF EXISTS `custom_fields`;
DROP TABLE IF EXISTS `order_products`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `product_overrides`;
DROP TABLE IF EXISTS `payment_methods`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `client_photos`;
DROP TABLE IF EXISTS `client_notes`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `production_statuses`;
DROP TABLE IF EXISTS `tax_settings`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `esoft_settings`;
DROP TABLE IF EXISTS `integration_settings`;
DROP TABLE IF EXISTS `organization_settings`;
DROP TABLE IF EXISTS `app_settings`;
DROP TABLE IF EXISTS `profiles`;

-- Create profiles table (user authentication)
CREATE TABLE `profiles` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `avatar_url` TEXT,
    `full_name` VARCHAR(255),
    `phone` VARCHAR(20),
    `role` VARCHAR(50),
    `username` VARCHAR(100),
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_profiles_username` (`username`),
    INDEX `idx_profiles_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create app_settings table
CREATE TABLE `app_settings` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `key` VARCHAR(255) NOT NULL,
    `value` JSON NOT NULL,
    `user_id` VARCHAR(36),
    `is_global` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_app_settings_user_key` (`user_id`, `key`),
    INDEX `idx_app_settings_key` (`key`),
    INDEX `idx_app_settings_global` (`is_global`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create organization_settings table
CREATE TABLE `organization_settings` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `settings` JSON NOT NULL DEFAULT ('{}'),
    `updated_by` VARCHAR(36),
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create integration_settings table
CREATE TABLE `integration_settings` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `integration_type` VARCHAR(100) NOT NULL,
    `settings` JSON NOT NULL DEFAULT ('{}'),
    `user_id` VARCHAR(36),
    `is_company_wide` BOOLEAN NOT NULL DEFAULT FALSE,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_integration_type` (`integration_type`),
    INDEX `idx_integration_user` (`user_id`),
    INDEX `idx_integration_company_wide` (`is_company_wide`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create esoft_settings table
CREATE TABLE `esoft_settings` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `client_id` VARCHAR(255) NOT NULL,
    `api_username` VARCHAR(255) NOT NULL,
    `api_password` VARCHAR(255) NOT NULL,
    `white_label_domain` VARCHAR(255),
    `default_order_reference_format` VARCHAR(255),
    `allow_reference_editing` BOOLEAN DEFAULT TRUE,
    `auto_deliver_listings` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_esoft_client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create coupons table
CREATE TABLE `coupons` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `type` VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    `value` DECIMAL(10,2) NOT NULL,
    `usage_limit` INT,
    `used_count` INT DEFAULT 0,
    `enabled` BOOLEAN DEFAULT TRUE,
    `start_date` DATE,
    `end_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_coupon_code` (`code`),
    INDEX `idx_coupon_enabled` (`enabled`),
    INDEX `idx_coupon_dates` (`start_date`, `end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create tax_settings table
CREATE TABLE `tax_settings` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `type` VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    `percentage` DECIMAL(5,2),
    `fixed_amount` DECIMAL(10,2),
    `enabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `is_payment_fee` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_tax_enabled` (`enabled`),
    INDEX `idx_tax_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create production_statuses table
CREATE TABLE `production_statuses` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `color` VARCHAR(7) NOT NULL, -- Hex color code
    `sort_order` INT,
    `is_default` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_production_status_order` (`sort_order`),
    INDEX `idx_production_status_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create products table
CREATE TABLE `products` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `esoft_products` JSON, -- Array of esoft product IDs
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_products_active` (`is_active`),
    INDEX `idx_products_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create companies table
CREATE TABLE `companies` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `industry` VARCHAR(100) NOT NULL DEFAULT '',
    `email` VARCHAR(255),
    `phone` VARCHAR(20),
    `website` VARCHAR(255),
    `address` TEXT,
    `city` VARCHAR(100),
    `state` VARCHAR(50),
    `zip` VARCHAR(20),
    `logo_url` TEXT,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `total_jobs` INT DEFAULT 0,
    `open_jobs` INT DEFAULT 0,
    `total_revenue` DECIMAL(12,2) DEFAULT 0.00,
    `outstanding_amount` DECIMAL(12,2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_companies_name` (`name`),
    INDEX `idx_companies_status` (`status`),
    INDEX `idx_companies_industry` (`industry`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create clients table
CREATE TABLE `clients` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20),
    `company` VARCHAR(255),
    `company_id` VARCHAR(36),
    `photo_url` TEXT,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `total_jobs` INT DEFAULT 0,
    `outstanding_jobs` INT DEFAULT 0,
    `outstanding_payment` DECIMAL(12,2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_clients_email` (`email`),
    INDEX `idx_clients_name` (`name`),
    INDEX `idx_clients_company` (`company_id`),
    INDEX `idx_clients_status` (`status`),
    CONSTRAINT `fk_clients_companies` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create client_notes table
CREATE TABLE `client_notes` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `client_id` VARCHAR(36) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_client_notes_client` (`client_id`),
    INDEX `idx_client_notes_created` (`created_at`),
    CONSTRAINT `fk_client_notes_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create client_photos table
CREATE TABLE `client_photos` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `client_id` VARCHAR(36) NOT NULL,
    `photo_url` TEXT NOT NULL,
    `is_default` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_client_photos_client` (`client_id`),
    INDEX `idx_client_photos_default` (`is_default`),
    CONSTRAINT `fk_client_photos_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create invoices table
CREATE TABLE `invoices` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `client_id` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `date` DATE NOT NULL,
    `order_number` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_invoices_client` (`client_id`),
    INDEX `idx_invoices_status` (`status`),
    INDEX `idx_invoices_date` (`date`),
    INDEX `idx_invoices_order` (`order_number`),
    CONSTRAINT `fk_invoices_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create payment_methods table
CREATE TABLE `payment_methods` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `client_id` VARCHAR(36) NOT NULL,
    `card_type` VARCHAR(20) NOT NULL,
    `last_four` VARCHAR(4) NOT NULL,
    `expiry_date` VARCHAR(7) NOT NULL, -- MM/YYYY format
    `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_payment_methods_client` (`client_id`),
    INDEX `idx_payment_methods_default` (`is_default`),
    CONSTRAINT `fk_payment_methods_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create product_overrides table
CREATE TABLE `product_overrides` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `client_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `standard_price` DECIMAL(10,2) NOT NULL,
    `override_price` DECIMAL(10,2) NOT NULL,
    `discount` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_product_overrides_client` (`client_id`),
    INDEX `idx_product_overrides_name` (`name`),
    CONSTRAINT `fk_product_overrides_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create orders table
CREATE TABLE `orders` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_number` VARCHAR(100) NOT NULL,
    `client` VARCHAR(255) NOT NULL,
    `client_email` VARCHAR(255) NOT NULL,
    `client_phone` VARCHAR(20),
    `package` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `address` TEXT NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `zip` VARCHAR(20) NOT NULL,
    `property_type` VARCHAR(100) NOT NULL,
    `square_feet` INT NOT NULL,
    `scheduled_date` DATE NOT NULL,
    `scheduled_time` TIME NOT NULL,
    `photographer` VARCHAR(255),
    `photographer_payout_rate` DECIMAL(5,2),
    `status` VARCHAR(50) NOT NULL,
    `notes` TEXT,
    `internal_notes` TEXT,
    `customer_notes` TEXT,
    `stripe_payment_id` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_order_number` (`order_number`),
    INDEX `idx_orders_client_email` (`client_email`),
    INDEX `idx_orders_status` (`status`),
    INDEX `idx_orders_date` (`scheduled_date`),
    INDEX `idx_orders_photographer` (`photographer`),
    INDEX `idx_orders_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_products table
CREATE TABLE `order_products` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_id` VARCHAR(36) NOT NULL,
    `product_id` VARCHAR(36),
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `status_id` VARCHAR(36),
    `assigned_editor` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_order_products_order` (`order_id`),
    INDEX `idx_order_products_product` (`product_id`),
    INDEX `idx_order_products_status` (`status_id`),
    INDEX `idx_order_products_editor` (`assigned_editor`),
    CONSTRAINT `fk_order_products_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_products_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_order_products_status` FOREIGN KEY (`status_id`) REFERENCES `production_statuses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create custom_fields table
CREATE TABLE `custom_fields` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_id` VARCHAR(36) NOT NULL,
    `field_key` VARCHAR(255) NOT NULL,
    `field_value` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_custom_fields_order` (`order_id`),
    INDEX `idx_custom_fields_key` (`field_key`),
    CONSTRAINT `fk_custom_fields_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create additional_appointments table
CREATE TABLE `additional_appointments` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_id` VARCHAR(36) NOT NULL,
    `date` DATE NOT NULL,
    `time` TIME NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_additional_appointments_order` (`order_id`),
    INDEX `idx_additional_appointments_date` (`date`),
    CONSTRAINT `fk_additional_appointments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_activities table
CREATE TABLE `order_activities` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_id` VARCHAR(36) NOT NULL,
    `activity_type` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `created_by` VARCHAR(36),
    `metadata` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_order_activities_order` (`order_id`),
    INDEX `idx_order_activities_type` (`activity_type`),
    INDEX `idx_order_activities_created_by` (`created_by`),
    INDEX `idx_order_activities_created` (`created_at`),
    CONSTRAINT `fk_order_activities_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_communication table
CREATE TABLE `order_communication` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_id` VARCHAR(36) NOT NULL,
    `message` TEXT NOT NULL,
    `sender_role` VARCHAR(50) NOT NULL,
    `sender_id` VARCHAR(36),
    `recipient_role` VARCHAR(50),
    `source` VARCHAR(50) NOT NULL,
    `is_internal` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_order_communication_order` (`order_id`),
    INDEX `idx_order_communication_sender` (`sender_role`, `sender_id`),
    INDEX `idx_order_communication_internal` (`is_internal`),
    INDEX `idx_order_communication_created` (`created_at`),
    CONSTRAINT `fk_order_communication_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_payouts table
CREATE TABLE `order_payouts` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_id` VARCHAR(36) NOT NULL,
    `product_id` VARCHAR(36),
    `name` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `user_id` VARCHAR(36),
    `amount` DECIMAL(10,2) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `paid_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_order_payouts_order` (`order_id`),
    INDEX `idx_order_payouts_product` (`product_id`),
    INDEX `idx_order_payouts_user` (`user_id`),
    INDEX `idx_order_payouts_status` (`status`),
    INDEX `idx_order_payouts_role` (`role`),
    CONSTRAINT `fk_order_payouts_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_payouts_product` FOREIGN KEY (`product_id`) REFERENCES `order_products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create company_teams table
CREATE TABLE `company_teams` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `company_id` VARCHAR(36),
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_company_teams_company` (`company_id`),
    INDEX `idx_company_teams_name` (`name`),
    CONSTRAINT `fk_company_teams_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create team_invitations table
CREATE TABLE `team_invitations` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'member',
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `token` VARCHAR(255),
    `company_id` VARCHAR(36),
    `invited_by` VARCHAR(36),
    `expires_at` TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_team_invitations_email` (`email`),
    INDEX `idx_team_invitations_status` (`status`),
    INDEX `idx_team_invitations_company` (`company_id`),
    INDEX `idx_team_invitations_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create team_members table
CREATE TABLE `team_members` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `team_id` VARCHAR(36),
    `user_id` VARCHAR(36),
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255),
    `role` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_team_members_team` (`team_id`),
    INDEX `idx_team_members_user` (`user_id`),
    INDEX `idx_team_members_email` (`email`),
    INDEX `idx_team_members_role` (`role`),
    CONSTRAINT `fk_team_members_team` FOREIGN KEY (`team_id`) REFERENCES `company_teams` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_team_members_user` FOREIGN KEY (`user_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create billing_summary view
CREATE VIEW `billing_summary` AS
SELECT 
    c.id as client_id,
    c.name as client_name,
    c.outstanding_payment,
    COALESCE(SUM(i.amount), 0) as total_billed,
    MAX(i.amount) as last_payment_amount,
    MAX(i.date) as last_payment_date
FROM clients c
LEFT JOIN invoices i ON c.id = i.client_id
GROUP BY c.id, c.name, c.outstanding_payment;

SET FOREIGN_KEY_CHECKS = 1;

-- Insert default production statuses
INSERT INTO `production_statuses` (`id`, `name`, `description`, `color`, `sort_order`, `is_default`) VALUES
(UUID(), 'Not Started', 'Production has not yet begun', '#6B7280', 1, TRUE),
(UUID(), 'In Progress', 'Currently being worked on', '#F59E0B', 2, FALSE),
(UUID(), 'Under Review', 'Waiting for review and approval', '#8B5CF6', 3, FALSE),
(UUID(), 'Completed', 'Production work is finished', '#10B981', 4, FALSE),
(UUID(), 'On Hold', 'Production temporarily paused', '#EF4444', 5, FALSE);

-- Insert default app settings
INSERT INTO `app_settings` (`id`, `key`, `value`, `is_global`) VALUES
(UUID(), 'company_name', '"JobFlow PhotoSync"', TRUE),
(UUID(), 'default_currency', '"USD"', TRUE),
(UUID(), 'timezone', '"America/New_York"', TRUE),
(UUID(), 'date_format', '"MM/DD/YYYY"', TRUE),
(UUID(), 'time_format', '"12h"', TRUE);

-- Insert default tax settings
INSERT INTO `tax_settings` (`id`, `name`, `type`, `percentage`, `enabled`) VALUES
(UUID(), 'Sales Tax', 'percentage', 8.25, FALSE),
(UUID(), 'Processing Fee', 'percentage', 3.00, FALSE);

-- Add helpful comments
-- This migration creates a complete MySQL database schema based on the Supabase TypeScript definitions
-- Key features:
-- 1. Proper foreign key relationships with referential integrity
-- 2. Appropriate indexes for performance optimization
-- 3. JSON columns for flexible data storage
-- 4. Proper data types matching business requirements
-- 5. Default values and constraints for data integrity
-- 6. View for billing summary calculations
-- 7. Sample data for production statuses and basic settings

-- Performance optimization indexes added:
-- - Primary key indexes (automatic)
-- - Foreign key indexes for join performance
-- - Status and date indexes for filtering
-- - Email and name indexes for search functionality
-- - Composite indexes where appropriate

-- Security considerations:
-- - VARCHAR(36) for UUIDs to prevent enumeration attacks
-- - Proper foreign key constraints with CASCADE/SET NULL as appropriate
-- - Data validation through constraints and default values