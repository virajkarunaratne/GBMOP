'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, AlertCircle, Building2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Input, Select, Checkbox } from '@/components/Form'

export default function SignupPage() {
  const router = useRouter()
  const { signup, loading, error: authError, resetError } = useAuth()
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([])
  const [departments, setDepartments] = useState<
    Array<{ id: string; name: string }>
  >([])
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    departmentId: '',
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch roles and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, departmentsData] = await Promise.all([
          supabase.from('roles').select('id, name').limit(10),
          supabase.from('departments').select('id, name').limit(10),
        ])

        if (rolesData.data) {
          setRoles(rolesData.data)
        }
        if (departmentsData.data) {
          setDepartments(departmentsData.data)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Please select a role'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
    resetError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      await signup(
        formData.email,
        formData.password,
        formData.fullName,
        formData.roleId,
        formData.departmentId || undefined
      )
      router.push('/auth/verify-email')
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-neutral-100 flex items-center justify-center p-4 py-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-48 -mb-48"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">GMOP</h1>
          <p className="text-neutral-600">
            Godayana Marketing Operations Platform
          </p>
        </div>

        {/* Signup Card */}
        <Card className="shadow-xl border-0">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">
              Create Account
            </h2>
            <p className="text-neutral-600 mb-8">
              Join GMOP and start managing your marketing operations
            </p>

            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                icon={<User size={18} />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail size={18} />}
                required
              />

              <Select
                label="Role"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                error={errors.roleId}
                options={roles.map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
                required
                disabled={loadingData}
              />

              <Select
                label="Department (Optional)"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select a department' },
                  ...departments.map((dept) => ({
                    value: dept.id,
                    label: dept.name,
                  })),
                ]}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock size={18} />}
                hint="At least 8 characters"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={<Lock size={18} />}
                required
              />

              <div className="flex gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 border border-neutral-300 rounded text-primary-600 focus:ring-primary-600 cursor-pointer flex-shrink-0 mt-1"
                />
                <div>
                  <label className="text-sm text-neutral-700 cursor-pointer">
                    I agree to the{' '}
                    <Link href="#" className="text-primary-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-danger mt-1">
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting || loading}
                disabled={isSubmitting || loading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <p className="text-center text-neutral-600 text-sm">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary-600 font-semibold hover:text-primary-700"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
