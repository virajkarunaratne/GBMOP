'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export default function VerifyEmailPage() {
  const [resendClicked, setResendClicked] = useState(false)

  const handleResend = async () => {
    setResendClicked(true)
    setTimeout(() => setResendClicked(false), 3000)
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

        {/* Verification Card */}
        <Card className="shadow-xl border-0 text-center">
          <div className="p-8">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <Mail size={32} className="text-success" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-neutral-600 mb-6">
              We've sent a confirmation link to your email address. Please check
              your inbox and click the link to verify your account.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-900">
                <strong>Didn't receive the email?</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4 list-disc">
                <li>Check your spam/junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Try requesting a new verification email</li>
              </ul>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full mb-3"
              onClick={handleResend}
            >
              {resendClicked ? 'Email Sent!' : 'Resend Verification Email'}
            </Button>

            <Link href="/auth/login">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                icon={<ArrowLeft size={18} />}
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
