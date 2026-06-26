'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader, Lock, Shield } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { supabase } from '@/lib/supabase'
import { Role } from '@/types'

const DEFAULT_PERMISSIONS = [
  { code: 'view_dashboard', name: 'View Dashboard' },
  { code: 'manage_projects', name: 'Manage Projects' },
  { code: 'manage_tasks', name: 'Manage Tasks' },
  { code: 'manage_content', name: 'Manage Content' },
  { code: 'approve_content', name: 'Approve Content' },
  { code: 'manage_users', name: 'Manage Users' },
  { code: 'manage_clients', name: 'Manage Clients' },
  { code: 'view_reports', name: 'View Reports' },
  { code: 'manage_billing', name: 'Manage Billing' },
  { code: 'system_admin', name: 'System Administrator' },
]

export default function RolesManagementPage() {
  const { user, loading: authLoading } = useRequireAuth(['Administrator'])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('roles')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        setRoles(data || [])
      } catch (err) {
        console.error('Error fetching roles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  const hasPermission = (role: Role, permissionCode: string) => {
    return role.permissions?.[permissionCode] === true
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
              Roles & Permissions
            </h1>
            <p className="text-neutral-600 mt-2">
              Configure roles and manage user permissions
            </p>
          </div>
          <Button variant="primary" size="md" icon={<Plus size={18} />}>
            Add Role
          </Button>
        </div>

        {/* Roles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="text-primary-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield size={20} className="text-primary-600" />
                        {role.name}
                      </CardTitle>
                      {role.description && (
                        <p className="text-sm text-neutral-600 mt-2">
                          {role.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit size={16} />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={16} />}
                        className="text-danger"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-4">
                      Permissions
                    </p>
                    <div className="space-y-2">
                      {DEFAULT_PERMISSIONS.map((perm) => (
                        <div
                          key={perm.code}
                          className="flex items-center gap-3 p-2 rounded hover:bg-neutral-50"
                        >
                          <input
                            type="checkbox"
                            checked={hasPermission(role, perm.code)}
                            disabled
                            className="w-4 h-4 border border-neutral-300 rounded text-primary-600 cursor-not-allowed"
                          />
                          <label className="text-sm text-neutral-700 cursor-default">
                            {perm.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Box */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Lock size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  About Roles & Permissions
                </h3>
                <p className="text-sm text-blue-800">
                  Roles define what users can do in GMOP. Each role has specific
                  permissions that control access to features and data. Admins can
                  create custom roles and modify permissions as needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
