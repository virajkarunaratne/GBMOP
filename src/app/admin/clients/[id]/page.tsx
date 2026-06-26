'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Loader } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { supabase } from '@/lib/supabase'
import { Client } from '@/types'

export default function ClientDetailPage() {
  const { id } = useParams() as { id: string }
  const { user, loading: authLoading } = useRequireAuth(['Administrator', 'Marketing Manager', 'Sales Executive'])
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchClient = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()
      if (error) throw error
      setClient(data)
    } catch (err) {
      console.error('Error fetching client:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClient()
  }, [id])

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this client? This action cannot be undone.')
    if (!confirmed) return

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (error) throw error
      router.push('/admin/clients')
    } catch (err) {
      console.error('Error deleting client:', err)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-neutral-150 flex items-center justify-center">
        <div className="text-center text-neutral-600">Client not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-150">
      <TopNavigation />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 text-sm text-neutral-600 mb-6">
          <Link href="/admin/clients" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
            <ArrowLeft size={16} /> Back to clients
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>{client.name}</CardTitle>
                <p className="text-sm text-neutral-600 mt-1">{client.industry || 'Industry not specified'}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/clients/${client.id}/edit`}>
                  <Button variant="outline" size="md" icon={<Edit size={16} />}>
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="md"
                  icon={<Trash2 size={16} />}
                  className="text-danger hover:text-danger"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">Contact</p>
                <p className="text-sm text-neutral-900 font-medium mt-2">{client.contact_person_name}</p>
                <p className="text-sm text-neutral-600">{client.contact_person_email}</p>
                <p className="text-sm text-neutral-600">{client.contact_person_phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">Address</p>
                <p className="text-sm text-neutral-900 font-medium mt-2">{client.address || 'No address provided'}</p>
                <p className="text-sm text-neutral-600">{client.city || '—'}, {client.country || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">Website</p>
                <p className="text-sm text-neutral-900 font-medium mt-2">{client.website || '—'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">Status</p>
                  <Badge variant={client.status === 'active' ? 'success' : client.status === 'inactive' ? 'warning' : 'secondary'} size="sm" className="mt-2">
                    {client.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">Created</p>
                  <p className="text-sm text-neutral-900 font-medium mt-2">{new Date(client.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">Description</p>
                <p className="text-sm text-neutral-700 mt-2">{client.description || 'No description available.'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
