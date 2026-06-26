'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input, TextArea, Select } from '@/components/Form'
import { supabase } from '@/lib/supabase'
import { Client } from '@/types'

export default function NewProjectPage() {
  const { loading: authLoading } = useRequireAuth(['Administrator', 'Marketing Manager', 'Sales Executive'])
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_id: '',
    status: 'planning',
    priority: 'medium',
    budget: '',
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from('clients').select('*').order('name')
      setClients((data as Client[]) || [])
    }

    fetchClients()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      const { data, error } = await supabase.from('projects').insert([{ ...formData, budget: formData.budget ? Number(formData.budget) : null }]).select()
      if (error) throw error
      router.push(`/projects/${data?.[0]?.id}`)
    } catch (err) {
      console.error('Error creating project:', err)
    } finally {
      setIsSubmitting(false)
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 text-sm text-neutral-600 mb-6">
          <Link href="/projects" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
            <ArrowLeft size={16} /> Back to projects
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input label="Project Name" name="name" value={formData.name} onChange={handleChange} required />
                <Select
                  label="Client"
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  options={clients.map((client) => ({ value: client.id, label: client.name }))}
                  required
                />
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: 'planning', label: 'Planning' },
                    { value: 'active', label: 'Active' },
                    { value: 'on-hold', label: 'On Hold' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'archived', label: 'Archived' },
                  ]}
                />
                <Select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                />
                <Input label="Budget" name="budget" type="number" value={formData.budget} onChange={handleChange} />
                <Input label="Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleChange} />
                <Input label="End Date" name="end_date" type="date" value={formData.end_date} onChange={handleChange} />
              </div>

              <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} hint="Add project context and goals" />

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => router.push('/projects')}>
                  Cancel
                </Button>
                <Button variant="primary" size="lg" type="submit" isLoading={isSubmitting}>
                  <Save size={18} /> Save Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
