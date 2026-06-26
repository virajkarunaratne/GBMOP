// User Types
export interface Role {
  id: string
  name: string
  description?: string
  permissions: Record<string, boolean>
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  role_id: string
  department_id?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
  role?: Role
}

export interface Department {
  id: string
  name: string
  description?: string
  head_id?: string
  created_at: string
  updated_at: string
}

// Client Types
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  website?: string
  industry?: string
  description?: string
  logo_url?: string
  address?: string
  city?: string
  country?: string
  status: 'active' | 'inactive' | 'archived'
  contact_person_name?: string
  contact_person_email?: string
  contact_person_phone?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface BrandAsset {
  id: string
  client_id: string
  name: string
  type?: string
  file_url?: string
  description?: string
  version: number
  uploaded_by?: string
  created_at: string
  updated_at: string
}

// Project Types
export interface Project {
  id: string
  name: string
  description?: string
  client_id: string
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  budget?: number
  start_date?: string
  end_date?: string
  created_by?: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface Milestone {
  id: string
  project_id: string
  name: string
  description?: string
  due_date?: string
  status: 'pending' | 'in-progress' | 'completed'
  progress: number
  created_at: string
  updated_at: string
}

// Task Types
export interface Task {
  id: string
  project_id?: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  created_by?: string
  due_date?: string
  start_date?: string
  end_date?: string
  order_index?: number
  parent_task_id?: string
  created_at: string
  updated_at: string
  assigned_user?: User
}

// Campaign Types
export interface Campaign {
  id: string
  project_id: string
  name: string
  description?: string
  objective?: string
  start_date?: string
  end_date?: string
  budget?: number
  status: 'draft' | 'active' | 'paused' | 'completed'
  created_by?: string
  created_at: string
  updated_at: string
}

// Content Item Types
export interface ContentItem {
  id: string
  monthly_plan_id: string
  campaign_id?: string
  platform: string
  content_type: string
  title: string
  objective?: string
  caption?: string
  hashtags?: string
  creative_preview_url?: string
  google_drive_link?: string
  scheduled_date?: string
  assigned_writer_id?: string
  assigned_designer_id?: string
  assigned_editor_id?: string
  status: 'draft' | 'in-review' | 'approved' | 'scheduled' | 'published'
  approval_status: 'pending' | 'approved' | 'rejected' | 'revision-requested'
  version: number
  created_by?: string
  created_at: string
  updated_at: string
}

// Approval Types
export interface Approval {
  id: string
  content_item_id?: string
  task_id?: string
  approver_id: string
  status: 'pending' | 'approved' | 'rejected'
  comments?: string
  requested_at: string
  responded_at?: string
  updated_at: string
  approver?: User
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message?: string
  related_item_id?: string
  related_item_type?: string
  is_read: boolean
  read_at?: string
  created_at: string
}

// Invoice Types
export interface Invoice {
  id: string
  client_id: string
  project_id?: string
  invoice_number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  total_amount: number
  tax_amount: number
  net_amount: number
  currency: string
  issue_date?: string
  due_date?: string
  paid_date?: string
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}

// Report Types
export interface Report {
  id: string
  project_id?: string
  client_id?: string
  report_type: string
  title: string
  description?: string
  data: Record<string, any>
  generated_by?: string
  generated_at: string
  created_at: string
}

// Dashboard Stats
export interface DashboardStats {
  total_projects: number
  active_projects: number
  pending_approvals: number
  total_tasks: number
  completed_tasks: number
  total_revenue: number
  overdue_tasks: number
  active_clients: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
