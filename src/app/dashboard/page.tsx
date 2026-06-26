'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import {
  StatCard,
  ChartContainer,
  ActivityItem,
  KPIMetric,
} from '@/components/Dashboard'
import { cn, formatDate, daysUntilDue } from '@/lib/utils'

// Mock data for demonstration
const mockStats = {
  total_projects: 12,
  active_projects: 8,
  pending_approvals: 3,
  total_tasks: 45,
  completed_tasks: 28,
  total_revenue: 45250,
  overdue_tasks: 2,
  active_clients: 9,
}

const mockPendingApprovals = [
  {
    id: '1',
    title: 'Q3 Social Media Campaign Post',
    client: 'TechStart Inc',
    type: 'Content Approval',
    daysLeft: 2,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Newsletter Design - Monthly Issue',
    client: 'Eco Fashion Co',
    type: 'Design Review',
    daysLeft: 5,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Video Editing - Product Launch',
    client: 'TechStart Inc',
    type: 'Video Review',
    daysLeft: 1,
    priority: 'urgent',
  },
]

const mockTodaysTasks = [
  {
    id: '1',
    title: 'Complete Instagram content calendar',
    assignee: 'Sarah Johnson',
    priority: 'high',
    status: 'in-progress',
    dueTime: '3:00 PM',
  },
  {
    id: '2',
    title: 'Review client feedback on designs',
    assignee: 'Mike Chen',
    priority: 'medium',
    status: 'todo',
    dueTime: '5:00 PM',
  },
  {
    id: '3',
    title: 'Upload final video to cloud storage',
    assignee: 'You',
    priority: 'high',
    status: 'todo',
    dueTime: '6:00 PM',
  },
  {
    id: '4',
    title: 'Team standup meeting',
    assignee: 'Team',
    priority: 'medium',
    status: 'done',
    dueTime: '10:00 AM',
  },
]

const mockRecentActivity = [
  {
    id: '1',
    user: 'Sarah Johnson',
    action: 'Approved',
    item: 'Instagram Story - Product Launch',
    timestamp: '2 hours ago',
    type: 'approval',
  },
  {
    id: '2',
    user: 'Mike Chen',
    action: 'Completed',
    item: 'Email Newsletter Design',
    timestamp: '4 hours ago',
    type: 'completion',
  },
  {
    id: '3',
    user: 'You',
    action: 'Assigned',
    item: 'Content Calendar - Q4 Planning',
    timestamp: '6 hours ago',
    type: 'assignment',
  },
  {
    id: '4',
    user: 'Emma Wilson',
    action: 'Commented on',
    item: 'Facebook Ad Mockup',
    timestamp: '8 hours ago',
    type: 'comment',
  },
]

const mockProjects = [
  {
    id: '1',
    name: 'Q3 Digital Marketing Campaign',
    client: 'TechStart Inc',
    progress: 65,
    status: 'active',
    team: 5,
  },
  {
    id: '2',
    name: 'Social Media Rebranding',
    client: 'Eco Fashion Co',
    progress: 40,
    status: 'active',
    team: 3,
  },
  {
    id: '3',
    name: 'Content Strategy Development',
    client: 'Global Consulting',
    progress: 80,
    status: 'active',
    team: 2,
  },
]

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  useEffect(() => {
    // Simulate data loading
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [selectedPeriod])

  const handleApprove = (id: string) => {
    console.log('Approving:', id)
  }

  const handleReject = (id: string) => {
    console.log('Rejecting:', id)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-150">
        <TopNavigation />

        {/* Header */}
        <div className="bg-white border-b border-neutral-300">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
                <p className="text-neutral-600 mt-1">
                  Welcome back! Here's your marketing operations overview.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="md">
                  Export Report
                </Button>
                <Button variant="primary" size="md">
                  + New Project
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Projects"
              value={mockStats.active_projects}
              subtitle={`out of ${mockStats.total_projects} total`}
              icon={<BarChart3 size={24} />}
              trend={{ value: 12, direction: 'up' }}
              variant="primary"
            />
            <StatCard
              title="Pending Approvals"
              value={mockStats.pending_approvals}
              subtitle="Awaiting your decision"
              icon={<AlertCircle size={24} />}
              trend={{ value: 8, direction: 'up' }}
              variant="warning"
            />
            <StatCard
              title="Tasks Completed"
              value={`${mockStats.completed_tasks}/${mockStats.total_tasks}`}
              subtitle={`${Math.round((mockStats.completed_tasks / mockStats.total_tasks) * 100)}% completion`}
              icon={<CheckCircle size={24} />}
              trend={{ value: 5, direction: 'up' }}
              variant="success"
            />
            <StatCard
              title="Total Revenue"
              value={`$${(mockStats.total_revenue / 1000).toFixed(1)}k`}
              subtitle="This month"
              icon={<TrendingUp size={24} />}
              trend={{ value: 23, direction: 'up' }}
              variant="secondary"
            />
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Pending Approvals */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Pending Approvals</CardTitle>
                  <Button variant="ghost" size="sm" icon={<ChevronRight />} />
                </div>
              </CardHeader>
              <CardContent>
                {mockPendingApprovals.length > 0 ? (
                  <div className="space-y-4">
                    {mockPendingApprovals.map((approval) => (
                      <div
                        key={approval.id}
                        className="flex items-start justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full mt-2',
                                approval.priority === 'urgent'
                                  ? 'bg-danger'
                                  : approval.priority === 'high'
                                    ? 'bg-warning'
                                    : 'bg-info'
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-900 truncate">
                                {approval.title}
                              </p>
                              <p className="text-sm text-neutral-600 mt-1">
                                {approval.client} • {approval.type}
                              </p>
                              <p className="text-xs text-neutral-500 mt-2">
                                Due in {approval.daysLeft} days
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(approval.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(approval.id)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <CheckCircle
                      size={48}
                      className="text-neutral-300 mx-auto mb-3"
                    />
                    <p className="text-neutral-600">No pending approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <KPIMetric
                  label="Tasks Due Today"
                  value={mockTodaysTasks.length}
                  comparison={{ value: 2, period: 'yesterday' }}
                />
                <KPIMetric
                  label="Overdue Tasks"
                  value={mockStats.overdue_tasks}
                  comparison={{ value: -1, period: 'last week' }}
                />
                <KPIMetric
                  label="Active Clients"
                  value={mockStats.active_clients}
                  comparison={{ value: 1, period: 'last month' }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Tasks */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Today's Tasks</CardTitle>
                <Badge
                  variant="primary"
                  size="sm"
                  className="bg-primary-100 text-primary-700"
                >
                  {mockTodaysTasks.filter((t) => t.status !== 'done').length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockTodaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border',
                      task.status === 'done'
                        ? 'bg-neutral-50 border-neutral-200'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          task.status === 'done'
                            ? 'text-neutral-500 line-through'
                            : 'text-neutral-900'
                        )}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {task.assignee} • {task.dueTime}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'high' ? 'danger' : 'warning'
                      }
                      size="sm"
                      className={cn(
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      )}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" icon={<ChevronRight />} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-neutral-200 -mx-6">
                {mockRecentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    title={`${activity.user} ${activity.action}`}
                    description={activity.item}
                    timestamp={activity.timestamp}
                    variant={
                      activity.type === 'approval'
                        ? 'success'
                        : activity.type === 'completion'
                          ? 'success'
                          : 'primary'
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Overview */}
        <section className="mt-12 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Active Projects</CardTitle>
                <Button variant="ghost" size="sm" icon={<ChevronRight />} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-0 font-semibold text-neutral-700">
                        Project
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                        Progress
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                        Team
                      </th>
                      <th className="text-right py-3 px-0 font-semibold text-neutral-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="py-4 px-0">
                          <p className="font-medium text-neutral-900">
                            {project.name}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">
                          {project.client}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden max-w-xs">
                              <div
                                className="h-full bg-primary-600 transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-neutral-600 w-8 text-right">
                              {project.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="info" size="sm">
                            {project.team} members
                          </Badge>
                        </td>
                        <td className="py-4 px-0 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<ChevronRight size={16} />}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
        </div>
      </div>
    </ProtectedRoute>
  )
}
