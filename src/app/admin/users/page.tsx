'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, Trash2, Edit, Shield, Loader } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Form'
import { Badge, Avatar } from '@/components/Badge'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'
import { getInitials } from '@/lib/utils'

export default function UsersManagementPage() {
  const { user, loading: authLoading } = useRequireAuth(['Administrator'])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('users')
          .select(
            `
            *,
            role:roles(*),
            department:departments(*)
          `
          )
          .order('created_at', { ascending: false })

        if (error) throw error
        setUsers(data || [])
      } catch (err) {
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || u.role?.name === selectedRole

    return matchesSearch && matchesRole
  })

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Administrator':
        return 'danger'
      case 'Marketing Manager':
        return 'primary'
      case 'Content Writer':
        return 'info'
      case 'Graphic Designer':
        return 'secondary'
      default:
        return 'primary'
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-150">
      <TopNavigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              User Management
            </h1>
            <p className="text-neutral-600 mt-2">
              Manage team members, roles, and permissions
            </p>
          </div>
          <Link href="/admin/users/new">
            <Button variant="primary" size="md" icon={<Plus size={18} />}>
              Add User
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Search by name or email..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={18} />}
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="all">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Digital Marketer">Digital Marketer</option>
                <option value="Content Writer">Content Writer</option>
                <option value="Graphic Designer">Graphic Designer</option>
                <option value="QA Reviewer">QA Reviewer</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={24} className="text-primary-600 animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-0 font-semibold text-neutral-700">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                        Department
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                        Status
                      </th>
                      <th className="text-right py-3 px-0 font-semibold text-neutral-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="py-4 px-0">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size="sm"
                              initials={getInitials(u.full_name)}
                              color="bg-primary-600"
                            />
                            <span className="font-medium text-neutral-900">
                              {u.full_name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">
                          {u.email}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={getRoleColor(u.role?.name || '')}
                            size="sm"
                          >
                            {u.role?.name}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">
                          {u.department?.name || '—'}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={u.is_active ? 'success' : 'warning'}
                            size="sm"
                          >
                            {u.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 px-0 text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/admin/users/${u.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Eye size={16} />}
                              />
                            </Link>
                            <Link href={`/admin/users/${u.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Edit size={16} />}
                              />
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash2 size={16} />}
                              className="text-danger hover:text-danger"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
