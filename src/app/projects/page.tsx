'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, Edit, Loader } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Form'
import { Badge } from '@/components/Badge'
import { supabase } from '@/lib/supabase'
import { Project } from '@/types'

export default function ProjectsPage() {
  const { loading: authLoading } = useRequireAuth(['Administrator', 'Marketing Manager', 'Sales Executive'])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('projects')
          .select('*, client:clients(*)')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects((data as Project[]) || [])
      } catch (err) {
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client as any)?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus

    return matchesSearch && matchesStatus
  })

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
            <h1 className="text-3xl font-bold text-neutral-900">Project Management</h1>
            <p className="text-neutral-600 mt-2">Track initiatives, milestones, and delivery progress.</p>
          </div>
          <Link href="/projects/new">
            <Button variant="primary" size="md" icon={<Plus size={18} />}>
              New Project
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search projects or clients"
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
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={24} className="text-primary-600 animate-spin" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-neutral-600">No projects match your criteria.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-0 font-semibold text-neutral-700">Project</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">Client</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">Priority</th>
                      <th className="text-right py-3 px-0 font-semibold text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                        <td className="py-4 px-0">
                          <div>
                            <p className="font-medium text-neutral-900">{project.name}</p>
                            <p className="text-xs text-neutral-500 line-clamp-2">{project.description || 'No description provided.'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">{(project.client as any)?.name || '—'}</td>
                        <td className="py-4 px-4">
                          <Badge variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'primary' : project.status === 'on-hold' ? 'warning' : 'secondary'} size="sm">
                            {project.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">{project.priority}</td>
                        <td className="py-4 px-0 text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/projects/${project.id}`}>
                              <Button variant="ghost" size="sm" icon={<Eye size={16} />} />
                            </Link>
                            <Link href={`/projects/${project.id}/edit`}>
                              <Button variant="ghost" size="sm" icon={<Edit size={16} />} />
                            </Link>
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
