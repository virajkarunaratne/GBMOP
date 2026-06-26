-- GMOP Database Schema
-- PostgreSQL Database for Godayana Marketing Operations Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USERS & AUTHENTICATION TABLES
-- ============================================================

-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  head_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(20),
  role_id UUID NOT NULL REFERENCES roles(id),
  department_id UUID REFERENCES departments(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Permissions table
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_code VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. CLIENT MANAGEMENT TABLES
-- ============================================================

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  industry VARCHAR(100),
  description TEXT,
  logo_url TEXT,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  contact_person_name VARCHAR(255),
  contact_person_email VARCHAR(255),
  contact_person_phone VARCHAR(20),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brand Assets table
CREATE TABLE brand_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  file_url TEXT,
  description TEXT,
  version INT DEFAULT 1,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. PROJECT MANAGEMENT TABLES
-- ============================================================

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'planning',
  priority VARCHAR(50) DEFAULT 'medium',
  budget DECIMAL(15, 2),
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Team Members
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Milestones table
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. CAMPAIGNS & CONTENT PLANNING TABLES
-- ============================================================

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  objective TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15, 2),
  status VARCHAR(50) DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Monthly Plans table
CREATE TABLE monthly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  approver_id UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Items table (replaces Google Sheets)
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  monthly_plan_id UUID NOT NULL REFERENCES monthly_plans(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id),
  platform VARCHAR(100),
  content_type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  objective TEXT,
  caption TEXT,
  hashtags TEXT,
  creative_preview_url TEXT,
  google_drive_link TEXT,
  scheduled_date TIMESTAMP,
  assigned_writer_id UUID REFERENCES users(id),
  assigned_designer_id UUID REFERENCES users(id),
  assigned_editor_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'draft',
  approval_status VARCHAR(50) DEFAULT 'pending',
  version INT DEFAULT 1,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. TASK MANAGEMENT TABLES
-- ============================================================

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  due_date TIMESTAMP,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  order_index INT,
  parent_task_id UUID REFERENCES tasks(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task Checklist
CREATE TABLE task_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. WORKFLOW & APPROVAL TABLES
-- ============================================================

-- Approvals table
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  comments TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow Steps table
CREATE TABLE workflow_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  order_index INT,
  role_required VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. COMMENTS & COLLABORATION TABLES
-- ============================================================

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES approvals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id),
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comment Reactions
CREATE TABLE comment_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. NOTIFICATIONS TABLE
-- ============================================================

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_item_id UUID,
  related_item_type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 9. FILES & STORAGE TABLE
-- ============================================================

-- Files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  content_item_id UUID REFERENCES content_items(id),
  comment_id UUID REFERENCES comments(id),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(50),
  is_preview_available BOOLEAN DEFAULT false,
  version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. REPORTS & ANALYTICS TABLE
-- ============================================================

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  report_type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB,
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content_item_id UUID REFERENCES content_items(id),
  metric_name VARCHAR(255),
  metric_value DECIMAL(15, 2),
  platform VARCHAR(100),
  recorded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 11. BILLING & INVOICES TABLE
-- ============================================================

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  invoice_number VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'draft',
  total_amount DECIMAL(15, 2) NOT NULL,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  net_amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  issue_date DATE,
  due_date DATE,
  paid_date DATE,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice Items table
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2),
  unit_price DECIMAL(15, 2),
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 12. MEETINGS & KNOWLEDGE BASE TABLES
-- ============================================================

-- Meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INT,
  meeting_link VARCHAR(255),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meeting Attendees
CREATE TABLE meeting_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  attended BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meeting Notes
CREATE TABLE meeting_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Base
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT,
  author_id UUID REFERENCES users(id),
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 13. AUDIT LOGS TABLE
-- ============================================================

-- Audit Logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(255),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_clients_created_by ON clients(created_by);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_content_items_monthly_plan_id ON content_items(monthly_plan_id);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_approval_status ON content_items(approval_status);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_content_item_id ON comments(content_item_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_files_project_id ON files(project_id);
CREATE INDEX idx_reports_project_id ON reports(project_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================
-- DEFAULT ROLES
-- ============================================================

INSERT INTO roles (name, description) VALUES
('Administrator', 'Full system access and admin capabilities'),
('Marketing Manager', 'Manages marketing campaigns and team'),
('Digital Marketer', 'Creates and manages digital content'),
('Content Writer', 'Writes content for campaigns'),
('Graphic Designer', 'Designs visual content'),
('Video Editor', 'Edits and produces videos'),
('Photographer', 'Takes and manages photos'),
('QA Reviewer', 'Reviews and approves content'),
('Finance Officer', 'Manages billing and invoices'),
('Sales Executive', 'Manages client relationships'),
('Client', 'External client portal user')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DEFAULT DEPARTMENTS
-- ============================================================

INSERT INTO departments (name, description) VALUES
('Marketing', 'Marketing and campaign management'),
('Design', 'Creative and design team'),
('Content', 'Content creation and management'),
('Finance', 'Finance and billing'),
('Sales', 'Sales and client management'),
('Operations', 'Operations and administration')
ON CONFLICT DO NOTHING;
