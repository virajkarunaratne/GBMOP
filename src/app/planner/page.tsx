'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Search, Filter, Loader } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Input } from '@/components/Form'
import { Badge } from '@/components/Badge'
import { supabase } from '@/lib/supabase'
import { ContentItem } from '@/types'

export default function PlannerPage() {
  const { loading: authLoading } = useRequireAuth(['Administrator', 'Marketing Manager', 'Sales Executive'])
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approvalFilter, setApprovalFilter] = useState('all')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('content_items')
          .select('*')
          .order('scheduled_date', { ascending: true })

        if (error) throw error
        setItems((data as ContentItem[]) || [])
      } catch (err) {
        console.error('Error fetching content planner items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesApproval = approvalFilter === 'all' || item.approval_status === approvalFilter

      return matchesSearch && matchesStatus && matchesApproval
    })
  }, [items, searchQuery, statusFilter, approvalFilter])

  const groupedItems = useMemo(() => {
    return filteredItems.reduce<Record<string, ContentItem[]>>((acc, item) => {
      const key = item.scheduled_date ? new Date(item.scheduled_date).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'Unscheduled'
      acc[key] = acc[key] ? [...acc[key], item] : [item]
      return acc
    }, {})
  }, [filteredItems])

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
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Monthly Content Planner</h1>
            <p className="text-neutral-600 mt-2">Replace scattered Google Sheets with a single publishing command center.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-neutral-600">Planned Posts</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{items.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-neutral-600">Awaiting Approval</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{items.filter((item) => item.approval_status === 'pending').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-neutral-600">Scheduled</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{items.filter((item) => item.status === 'scheduled').length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search posts, platforms or captions"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={18} />}
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="in-review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
                <select
                  value={approvalFilter}
                  onChange={(e) => setApprovalFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="all">All Approval</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="revision-requested">Revision Requested</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="text-primary-600 animate-spin" />
          </div>
        ) : Object.keys(groupedItems).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-neutral-600">No content items found for the selected filters.</CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([month, monthItems]) => (
              <Card key={month}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-primary-600" />
                    {month}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {monthItems.map((item) => (
                      <div key={item.id} className="border border-neutral-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-neutral-900">{item.title}</p>
                            <Badge variant="info" size="sm">{item.platform}</Badge>
                            <Badge variant="secondary" size="sm">{item.content_type}</Badge>
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">{item.caption || 'No caption provided.'}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={item.status === 'published' ? 'success' : item.status === 'scheduled' ? 'warning' : 'secondary'} size="sm">
                            {item.status}
                          </Badge>
                          <Badge variant={item.approval_status === 'approved' ? 'success' : item.approval_status === 'pending' ? 'warning' : 'danger'} size="sm">
                            {item.approval_status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
