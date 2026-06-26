'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input, TextArea, Select } from '@/components/Form'
import { supabase } from '@/lib/supabase'

export default function NewClientPage() {
  const { user, loading: authLoading } = useRequireAuth(['Administrator', 'Marketing Manager', 'Sales Executive'])
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    description: '',
    address: '',
    city: '',
    country: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    status: 'active',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Client name is required'
    if (!formData.contact_person_name.trim()) newErrors.contact_person_name = 'Contact name is required'
    if (!formData.contact_person_email.trim()) {
      newErrors.contact_person_email = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_person_email)) {
      newErrors.contact_person_email = 'Enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase.from('clients').insert([{ ...formData, created_by: user?.id }])
      if (error) throw error
      router.push('/admin/clients')
    } catch (err) {
      console.error('Error creating client', err)
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
          <Link href="/admin/clients" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
            <ArrowLeft size={16} /> Back to clients
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Add New Client</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  label="Client Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
                <Input
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                />
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'archived', label: 'Archived' },
                  ]}
                />
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <Input
                  label="Contact Name"
                  name="contact_person_name"
                  value={formData.contact_person_name}
                  onChange={handleChange}
                  error={errors.contact_person_name}
                  required
                />
                <Input
                  label="Contact Email"
                  name="contact_person_email"
                  type="email"
                  value={formData.contact_person_email}
                  onChange={handleChange}
                  error={errors.contact_person_email}
                  required
                />
                <Input
                  label="Contact Phone"
                  name="contact_person_phone"
                  value={formData.contact_person_phone}
                  onChange={handleChange}
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                hint="Add client background or notes"
              />

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => router.push('/admin/clients')}>
                  Cancel
                </Button>
                <Button variant="primary" size="lg" type="submit" isLoading={isSubmitting}>
                  <Save size={18} /> Save Client
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
