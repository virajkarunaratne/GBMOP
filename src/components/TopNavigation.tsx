'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LogOut,
  Settings,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/Badge'
import { Button } from '@/components/Button'
import { getInitials } from '@/lib/utils'

export const TopNavigation: React.FC = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (!user) return null

  return (
    <>
      <nav className="bg-white border-b border-neutral-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GM</span>
            </div>
            <span className="font-bold text-primary-600">GMOP</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/tasks"
              className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
            >
              Tasks
            </Link>
            {user.role?.name === 'Administrator' && (
              <Link
                href="/admin/users"
                className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <Avatar
                  size="sm"
                  initials={getInitials(user.full_name)}
                  color="bg-primary-600"
                />
                <div className="hidden sm:flex flex-col items-start gap-0">
                  <span className="text-sm font-medium text-neutral-900">
                    {user.full_name.split(' ')[0]}
                  </span>
                  <span className="text-xs text-neutral-600">
                    {user.role?.name}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-neutral-600 transition-transform',
                    isProfileOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2">
                  <Link href="/profile">
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 transition-colors">
                      <UserIcon size={16} />
                      View Profile
                    </button>
                  </Link>
                  <Link href="/profile/settings">
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 transition-colors">
                      <Settings size={16} />
                      Settings
                    </button>
                  </Link>
                  <div className="border-t border-neutral-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-neutral-600" />
              ) : (
                <Menu size={20} className="text-neutral-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-2">
            <Link href="/dashboard">
              <button className="w-full text-left px-6 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                Dashboard
              </button>
            </Link>
            <Link href="/projects">
              <button className="w-full text-left px-6 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                Projects
              </button>
            </Link>
            <Link href="/tasks">
              <button className="w-full text-left px-6 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                Tasks
              </button>
            </Link>
            {user.role?.name === 'Administrator' && (
              <Link href="/admin/users">
                <button className="w-full text-left px-6 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                  Admin
                </button>
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  )
}

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}
