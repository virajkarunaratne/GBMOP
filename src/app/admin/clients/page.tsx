'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, Edit, Trash2, Loader } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Form'
import { Badge, Avatar } from '@/components/Badge'
import { supabase } from '@/lib/supabase'
import { Client } from '@/types'
import { getInitials } from '@/lib/utils'

export default function ClientsManagementPage() {
  const { user, loading: authLoading } = useRequireAuth(['Administrator', 'Marketing Manager', 'Sales Executive'])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      console.error('Error fetching clients:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleDelete = async (clientId: string) => {
    const confirmed = window.confirm('Delete this client? This action cannot be undone.')
    if (!confirmed) return

    try {
      setDeletingClientId(clientId)
      const { error } = await supabase.from('clients').delete().eq('id', clientId)
      if (error) throw error
      setClients((prev) => prev.filter((client) => client.id !== clientId))
    } catch (err) {
      console.error('Error deleting client:', err)
    } finally {
      setDeletingClientId(null)
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      selectedStatus === 'all' || client.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-neutral-150">
      <TopNavigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Client Management</h1>
            <p className="text-neutral-600 mt-2">
              Manage clients, view account details and track status.
            </p>
          </div>
          <Link href="/admin/clients/new">
            <Button variant="primary" size="md" icon={<Plus size={18} />}>
              Add Client
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search clients by name, email or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={18} />}
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Client Directory</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={24} className="text-primary-600 animate-spin" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12 text-neutral-600">
                No clients match your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-0 font-semibold text-neutral-700">Client</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">Industry</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
                      <th className="text-right py-3 px-0 font-semibold text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                        <td className="py-4 px-0">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size="sm"
                              initials={client.name
                                .split(' ')
                                .map((part) => part[0])
                                .join('')
                                .toUpperCase()
                              }
                              color="bg-primary-600"
                            />
                            <div>
                              <p className="font-medium text-neutral-900">{client.name}</p>
                              <p className="text-xs text-neutral-500">{client.website || 'No website'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">
                          {client.contact_person_name || '—'}
                          <div className="text-xs text-neutral-500">{client.contact_person_email || client.email || '—'}</div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">{client.industry || 'General'}</td>
                        <td className="py-4 px-4">
                          <Badge variant={client.status === 'active' ? 'success' : client.status === 'inactive' ? 'warning' : 'secondary'} size="sm">
                            {client.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-0 text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/admin/clients/${client.id}`}>
                              <Button variant="ghost" size="sm" icon={<Eye size={16} />} />
                            </Link>
                            <Link href={`/admin/clients/${client.id}/edit`}>
                              <Button variant="ghost" size="sm" icon={<Edit size={16} />} />
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash2 size={16} />}
                              className="text-danger hover:text-danger"
                              onClick={() => handleDelete(client.id)}
                              isLoading={deletingClientId === client.id}
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
