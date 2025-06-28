-- Updated Customers Module Schema for JobFlow PhotoSync
-- This extends the existing schema to match the new requirements

-- Update companies table to match requirements
ALTER TABLE `companies` 
ADD COLUMN IF NOT EXISTS `agency_name` VARCHAR(255) AFTER `name`,
ADD COLUMN IF NOT EXISTS `billing_address` TEXT AFTER `address`,
ADD COLUMN IF NOT EXISTS `contact_email` VARCHAR(255) AFTER `email`,
ADD COLUMN IF NOT EXISTS `delivery_preferences` JSON AFTER `contact_email`,
ADD COLUMN IF NOT EXISTS `client_status` ENUM('active', 'inactive', 'onboarding') DEFAULT 'active' AFTER `status`,
ADD COLUMN IF NOT EXISTS `notes` TEXT AFTER `client_status`,
ADD COLUMN IF NOT EXISTS `primary_contact_id` VARCHAR(36) AFTER `notes`;

-- Create users table for team members (separate from clients)
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('team_leader', 'agent') NOT NULL DEFAULT 'agent',
    `status` ENUM('active', 'invited', 'inactive') NOT NULL DEFAULT 'invited',
    `company_id` VARCHAR(36),
    `phone` VARCHAR(20),
    `last_activity` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_company` (`company_id`),
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_status` (`status`),
    CONSTRAINT `fk_users_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create jobs table (extends orders concept for the CRM context)
CREATE TABLE IF NOT EXISTS `jobs` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `job_number` VARCHAR(100) NOT NULL UNIQUE,
    `company_id` VARCHAR(36) NOT NULL,
    `booked_by_user_id` VARCHAR(36),
    `address` TEXT NOT NULL,
    `city` VARCHAR(100),
    `state` VARCHAR(50),
    `zip` VARCHAR(20),
    `property_type` VARCHAR(100),
    `square_feet` INT,
    `scheduled_date` DATE,
    `scheduled_time` TIME,
    `status` ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'on_hold') DEFAULT 'scheduled',
    `assigned_creator_id` VARCHAR(36),
    `assigned_editor_id` VARCHAR(36),
    `total_amount` DECIMAL(10,2) DEFAULT 0.00,
    `notes` TEXT,
    `internal_notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_jobs_company` (`company_id`),
    INDEX `idx_jobs_booked_by` (`booked_by_user_id`),
    INDEX `idx_jobs_status` (`status`),
    INDEX `idx_jobs_date` (`scheduled_date`),
    INDEX `idx_jobs_creator` (`assigned_creator_id`),
    INDEX `idx_jobs_editor` (`assigned_editor_id`),
    CONSTRAINT `fk_jobs_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_jobs_booked_by` FOREIGN KEY (`booked_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update invoices table to work with companies and jobs
DROP TABLE IF EXISTS `job_invoices`;
CREATE TABLE `job_invoices` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `company_id` VARCHAR(36) NOT NULL,
    `job_id` VARCHAR(36),
    `invoice_number` VARCHAR(100) NOT NULL UNIQUE,
    `amount` DECIMAL(10,2) NOT NULL,
    `status` ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') NOT NULL DEFAULT 'draft',
    `due_date` DATE,
    `paid_date` DATE,
    `xero_invoice_id` VARCHAR(255),
    `stripe_invoice_id` VARCHAR(255),
    `stripe_status` VARCHAR(50),
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_job_invoices_company` (`company_id`),
    INDEX `idx_job_invoices_job` (`job_id`),
    INDEX `idx_job_invoices_status` (`status`),
    INDEX `idx_job_invoices_due_date` (`due_date`),
    INDEX `idx_job_invoices_number` (`invoice_number`),
    CONSTRAINT `fk_job_invoices_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_job_invoices_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key for primary contact
ALTER TABLE `companies` 
ADD CONSTRAINT `fk_companies_primary_contact` FOREIGN KEY (`primary_contact_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

-- Create views for reporting
CREATE OR REPLACE VIEW `company_summary` AS
SELECT 
    c.id,
    c.name,
    c.agency_name,
    c.contact_email,
    c.phone,
    c.client_status,
    COUNT(DISTINCT u.id) as team_members_count,
    COUNT(DISTINCT j.id) as total_jobs,
    COUNT(DISTINCT CASE WHEN j.status IN ('scheduled', 'in_progress') THEN j.id END) as active_jobs,
    COALESCE(SUM(CASE WHEN ji.status = 'paid' THEN ji.amount END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN ji.status IN ('sent', 'overdue') THEN ji.amount END), 0) as outstanding_amount,
    COALESCE(SUM(ji.amount), 0) as total_invoiced,
    MAX(j.created_at) as last_job_date,
    c.created_at
FROM companies c
LEFT JOIN users u ON c.id = u.company_id AND u.status = 'active'
LEFT JOIN jobs j ON c.id = j.company_id
LEFT JOIN job_invoices ji ON c.id = ji.company_id
GROUP BY c.id, c.name, c.agency_name, c.contact_email, c.phone, c.client_status, c.created_at;

CREATE OR REPLACE VIEW `user_summary` AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.status,
    u.company_id,
    c.name as company_name,
    COUNT(DISTINCT CASE WHEN u.role = 'team_leader' THEN j.id 
                      WHEN u.role = 'agent' THEN (CASE WHEN j.booked_by_user_id = u.id THEN j.id END) 
                      END) as job_count,
    MAX(u.last_activity) as last_activity,
    u.created_at
FROM users u
LEFT JOIN companies c ON u.company_id = c.id
LEFT JOIN jobs j ON (
    (u.role = 'team_leader' AND j.company_id = u.company_id) OR
    (u.role = 'agent' AND j.booked_by_user_id = u.id)
)
GROUP BY u.id, u.name, u.email, u.role, u.status, u.company_id, c.name, u.created_at;

-- Insert sample data for testing
INSERT IGNORE INTO `companies` (`id`, `name`, `agency_name`, `contact_email`, `phone`, `client_status`, `notes`) VALUES
(UUID(), 'Premier Real Estate Group', 'Premier Realty', 'contact@premierrealty.com', '(555) 123-4567', 'active', 'High-volume client, priority scheduling'),
(UUID(), 'Sunset Properties', 'Sunset Real Estate', 'info@sunsetprops.com', '(555) 987-6543', 'active', 'Specializes in luxury homes'),
(UUID(), 'Metro Housing Solutions', 'Metro Housing', 'admin@metrohousing.com', '(555) 456-7890', 'onboarding', 'New client, still setting up processes');

-- Insert sample users
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `status`, `company_id`) 
SELECT 
    UUID(), 
    'John Smith', 
    'john@premierrealty.com', 
    '$2b$10$placeholder_hash', 
    'team_leader', 
    'active',
    c.id
FROM companies c WHERE c.name = 'Premier Real Estate Group' LIMIT 1;

INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `status`, `company_id`) 
SELECT 
    UUID(), 
    'Sarah Johnson', 
    'sarah@premierrealty.com', 
    '$2b$10$placeholder_hash', 
    'agent', 
    'active',
    c.id
FROM companies c WHERE c.name = 'Premier Real Estate Group' LIMIT 1;