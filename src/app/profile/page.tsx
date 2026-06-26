'use client'

import React, { useState } from 'react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Form'
import { Avatar } from '@/components/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { getInitials } from '@/lib/utils'
import { Mail, Phone, Building2, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const { user, loading, updateProfile } = useRequireAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [successMessage, setSuccessMessage] = useState('')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateProfile({
        full_name: formData.fullName,
        phone: formData.phone,
      } as any)
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-150">
      <TopNavigation />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            My Profile
          </h1>
          <p className="text-neutral-600 mt-2">
            Manage your account settings and personal information
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar
                  size="lg"
                  initials={getInitials(user?.full_name || '')}
                  color="bg-primary-600"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {user?.full_name}
                  </h3>
                  <p className="text-neutral-600 text-sm mt-1">
                    {user?.role?.name}
                  </p>
                  {!isEditing && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="mt-3"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Edit Form */}
              {isEditing ? (
                <div className="space-y-4 pt-6 border-t border-neutral-200">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    icon={<Mail size={18} />}
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    icon={<Mail size={18} />}
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={<Phone size={18} />}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      isLoading={isSaving}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          fullName: user?.full_name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-6 border-t border-neutral-200">
                  <div className="flex items-start gap-4">
                    <Mail size={20} className="text-neutral-600 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-600">Email Address</p>
                      <p className="text-neutral-900 font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone size={20} className="text-neutral-600 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-600">Phone Number</p>
                      <p className="text-neutral-900 font-medium">
                        {user?.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Building2 size={20} className="text-neutral-600 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-600">Department</p>
                      <p className="text-neutral-900 font-medium">
                        {user?.department?.name || 'Not assigned'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Calendar size={20} className="text-neutral-600 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-600">Joined</p>
                      <p className="text-neutral-900 font-medium">
                        {new Date(user?.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Account Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Keep your account secure with these options
              </p>
              <Button variant="outline">
                Change Password
              </Button>
              <Button variant="outline">
                Enable Two-Factor Authentication
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
