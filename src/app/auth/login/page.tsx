'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Input } from '@/components/Form'

export default function LoginPage() {
  const router = useRouter()
  const { login, loading, error: authError, resetError } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      await login(formData.email, formData.password)
      router.push('/dashboard')
    } catch (err) {
      // Error is handled by auth context
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-neutral-100 flex items-center justify-center p-4">
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

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">
              Welcome Back
            </h2>
            <p className="text-neutral-600 mb-8">
              Sign in to your account to continue
            </p>

            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock size={18} />}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border border-neutral-300 rounded text-primary-600 focus:ring-primary-600 cursor-pointer"
                  />
                  <span className="text-neutral-700">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting || loading}
                disabled={isSubmitting || loading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <p className="text-center text-neutral-600 text-sm">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-primary-600 font-semibold hover:text-primary-700"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Footer Info */}
        <p className="text-center text-neutral-600 text-xs mt-6">
          By signing in, you agree to our{' '}
          <Link href="#" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
