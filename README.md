# Godayana Marketing Operations Platform (GMOP)

A premium, enterprise-grade marketing operations platform built for digital marketing agencies. GMOP replaces Google Sheets, WhatsApp communication, email approvals, and manual project management with one centralized platform.

## 🎯 Overview

GMOP is a comprehensive solution designed to manage:
- **Client Portal** - Client project tracking, approvals, and reporting
- **Project Management** - Timeline, milestones, budgets, and team assignments
- **Monthly Content Planning** - Replace Google Sheets with structured planning
- **Task Management** - Kanban, List, Calendar, and Timeline views
- **Workflow Management** - Creative approval workflows with multiple stages
- **Team Collaboration** - Real-time comments, mentions, reactions, and notifications
- **Reports & Analytics** - Comprehensive insights and performance metrics
- **File Management** - Google Drive integration and version control
- **Billing & Invoicing** - Client invoicing and financial tracking

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- Lucide Icons

**Backend:**
- Supabase (PostgreSQL)
- Supabase Auth
- Row-Level Security (RLS)

**Deployment:**
- Vercel

## 🎨 Brand Identity

| Element | Value |
|---------|-------|
| Primary Color | #0B6BA2 (Blue) |
| Secondary Color | #FFC72C (Yellow) |
| Dark Navy | #084D73 |
| Background | #F7F9FC |
| Success | #22C55E |
| Warning | #F59E0B |
| Danger | #EF4444 |

## 📁 Project Structure

```
gmop/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard module
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home redirect
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── Button.tsx             # Reusable button component
│   │   ├── Card.tsx               # Card component system
│   │   ├── Badge.tsx              # Badge, Avatar, Progress components
│   │   ├── Dashboard.tsx          # Dashboard-specific components
│   │   └── index.ts               # Component exports
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   └── utils.ts               # Utility functions
│   └── types/
│       └── index.ts               # TypeScript type definitions
├── database.sql                   # PostgreSQL schema
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind CSS config
├── next.config.js                 # Next.js config
├── postcss.config.js              # PostCSS config
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

3. **Create database tables:**
- Log into your Supabase project
- Go to SQL Editor
- Copy and execute the entire `database.sql` file

4. **Run development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📊 Database Schema

The database includes the following tables:

### Core Tables
- **users** - User accounts with roles and departments
- **roles** - User roles with permissions
- **departments** - Organization departments

### Client Management
- **clients** - Client information
- **brand_assets** - Client brand assets

### Project Management
- **projects** - Projects and campaigns
- **project_members** - Project team assignments
- **milestones** - Project milestones
- **campaigns** - Marketing campaigns

### Content Planning
- **monthly_plans** - Monthly content plans
- **content_items** - Individual content pieces (replaces Google Sheets)

### Task Management
- **tasks** - Tasks with status, priority, and assignments
- **task_checklists** - Task subtasks

### Workflow & Approvals
- **approvals** - Approval requests and status
- **workflow_steps** - Workflow pipeline stages

### Collaboration
- **comments** - Comments on content and tasks
- **comment_reactions** - Emoji reactions

### Notifications
- **notifications** - User notifications

### Files & Storage
- **files** - File metadata and storage links

### Reports & Analytics
- **reports** - Generated reports
- **analytics** - Performance metrics

### Finance
- **invoices** - Client invoices
- **invoice_items** - Invoice line items

### Meetings & Knowledge
- **meetings** - Meeting scheduling
- **meeting_attendees** - Meeting attendance
- **meeting_notes** - Meeting notes
- **knowledge_base** - Knowledge articles

### Audit
- **audit_logs** - System audit trail

## 🎭 User Roles

1. **Administrator** - Full system access
2. **Marketing Manager** - Manages campaigns and team
3. **Digital Marketer** - Creates digital content
4. **Content Writer** - Writes content
5. **Graphic Designer** - Designs visual content
6. **Video Editor** - Edits videos
7. **Photographer** - Manages photography
8. **QA Reviewer** - Reviews and approves content
9. **Finance Officer** - Manages billing
10. **Sales Executive** - Manages clients
11. **Client** - Client portal user

## 📦 Modules (Roadmap)

### Phase 1 (Current)
✅ Dashboard - Overview and key metrics
✅ Database Schema - Complete data model

### Phase 2
- [ ] Authentication & User Management
- [ ] Client Management
- [ ] Project Management

### Phase 3
- [ ] Monthly Content Planner
- [ ] Content Calendar
- [ ] Task Management

### Phase 4
- [ ] Workflow Management
- [ ] Content Approval System
- [ ] Comments & Collaboration

### Phase 5
- [ ] Reports & Analytics
- [ ] Billing & Invoicing
- [ ] File Manager

### Phase 6
- [ ] Brand Assets
- [ ] Meeting Notes
- [ ] Knowledge Base
- [ ] Settings

## 🎨 Component Library

### Base Components

**Button**
```tsx
<Button variant="primary" size="md" icon={<IconComponent />}>
  Click Me
</Button>
```

**Card**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Badge**
```tsx
<Badge variant="primary" size="md">
  Label
</Badge>
```

**Avatar**
```tsx
<Avatar size="md" initials="JD" color="bg-primary-500" />
```

**Progress**
```tsx
<Progress value={65} variant="primary" size="md" showLabel />
```

### Dashboard Components

**StatCard**
```tsx
<StatCard
  title="Active Projects"
  value={12}
  icon={<IconComponent />}
  trend={{ value: 12, direction: 'up' }}
  variant="primary"
/>
```

**ActivityItem**
```tsx
<ActivityItem
  title="User Action"
  description="Item description"
  timestamp="2 hours ago"
  variant="success"
/>
```

## 🔐 Security

- Row-Level Security (RLS) enabled on all tables
- User authentication via Supabase Auth
- Role-based access control (RBAC)
- Audit logs for all changes
- Secure API endpoints

## 📱 Responsive Design

All components are fully responsive:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- Proper color contrast ratios
- Focus management

## 🚀 Performance Optimization

- Image optimization
- Code splitting
- Lazy loading
- Static generation where possible
- Optimized database queries

## 📝 Development Standards

- **Code Style**: ESLint + Prettier
- **Type Safety**: Full TypeScript coverage
- **Component Reusability**: Composable components
- **Documentation**: JSDoc comments
- **Testing**: Jest + React Testing Library (planned)

## 🐛 Known Issues

None currently

## 🤝 Contributing

1. Create a feature branch
2. Follow existing code patterns
3. Write clear commit messages
4. Submit pull request

## 📄 License

Proprietary - Godayana Business

## 📞 Support

For issues or questions, contact the development team.

---

**Last Updated:** June 26, 2026
**Version:** 0.1.0 (Dashboard Module)
