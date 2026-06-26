'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Calendar, Users, Target, Plus } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input, Select, TextArea } from '@/components/Form'
import { Badge } from '@/components/Badge'
import { supabase } from '@/lib/supabase'
import { Project, Milestone, User } from '@/types'

interface ProjectMember {
  id: string
  role?: string
  user?: User
}

export default function ProjectDetailPage() {
  const { id } = useParams() as { id: string }
  const { loading: authLoading } = useRequireAuth(['Administrator', 'Marketing Manager', 'Sales Executive'])
  const [project, setProject] = useState<Project | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [milestoneForm, setMilestoneForm] = useState({ name: '', description: '', due_date: '', status: 'pending', progress: '0' })
  const [memberForm, setMemberForm] = useState({ user_id: '', role: '' })

  const fetchProject = async () => {
    try {
      setLoading(true)
      const [{ data: projectData }, { data: milestoneData }, { data: memberData }, { data: userData }] = await Promise.all([
        supabase.from('projects').select('*, client:clients(*)').eq('id', id).single(),
        supabase.from('milestones').select('*').eq('project_id', id).order('due_date', { ascending: true }),
        supabase.from('project_members').select('*, user:users(*)').eq('project_id', id),
        supabase.from('users').select('*').order('full_name'),
      ])

      setProject((projectData as Project) || null)
      setMilestones((milestoneData as Milestone[]) || [])
      setMembers((memberData as ProjectMember[]) || [])
      setUsers((userData as User[]) || [])
    } catch (err) {
      console.error('Error fetching project data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [id])

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.from('milestones').insert([{ ...milestoneForm, project_id: id, progress: Number(milestoneForm.progress) }]).select()
      if (error) throw error
      setMilestones((prev) => [...(data as Milestone[]), ...prev])
      setMilestoneForm({ name: '', description: '', due_date: '', status: 'pending', progress: '0' })
    } catch (err) {
      console.error('Error creating milestone:', err)
    }
  }

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.from('project_members').insert([{ project_id: id, user_id: memberForm.user_id, role: memberForm.role }]).select('*, user:users(*)')
      if (error) throw error
      setMembers((prev) => [...(data as ProjectMember[]), ...prev])
      setMemberForm({ user_id: '', role: '' })
    } catch (err) {
      console.error('Error assigning team member:', err)
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

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-600">Project not found.</div>
  }

  return (
    <div className="min-h-screen bg-neutral-150">
      <TopNavigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 text-sm text-neutral-600 mb-6">
          <Link href="/projects" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
            <ArrowLeft size={16} /> Back to projects
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <p className="text-sm text-neutral-600 mt-2">{project.description || 'No description provided.'}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/projects/${project.id}/edit`}>
                  <Button variant="outline" size="md" icon={<Edit size={16} />}>
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Client</p>
              <p className="text-sm font-medium text-neutral-900 mt-2">{(project.client as any)?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Status</p>
              <Badge variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'primary' : project.status === 'on-hold' ? 'warning' : 'secondary'} size="sm" className="mt-2">
                {project.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Budget</p>
              <p className="text-sm font-medium text-neutral-900 mt-2">{project.budget ? `$${project.budget}` : '—'}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4" onSubmit={handleMilestoneSubmit}>
                <Input label="Milestone Name" name="name" value={milestoneForm.name} onChange={(e) => setMilestoneForm((prev) => ({ ...prev, name: e.target.value }))} required />
                <TextArea label="Description" name="description" value={milestoneForm.description} onChange={(e) => setMilestoneForm((prev) => ({ ...prev, description: e.target.value }))} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Due Date" name="due_date" type="date" value={milestoneForm.due_date} onChange={(e) => setMilestoneForm((prev) => ({ ...prev, due_date: e.target.value }))} />
                  <Input label="Progress (%)" name="progress" type="number" min="0" max="100" value={milestoneForm.progress} onChange={(e) => setMilestoneForm((prev) => ({ ...prev, progress: e.target.value }))} />
                </div>
                <Select
                  label="Status"
                  name="status"
                  value={milestoneForm.status}
                  onChange={(e) => setMilestoneForm((prev) => ({ ...prev, status: e.target.value }))}
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                  ]}
                />
                <Button type="submit" variant="primary" size="md" icon={<Plus size={16} />}>
                  Add Milestone
                </Button>
              </form>

              <div className="space-y-3 pt-4">
                {milestones.length === 0 ? (
                  <p className="text-sm text-neutral-600">No milestones added yet.</p>
                ) : milestones.map((milestone) => (
                  <div key={milestone.id} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-neutral-900">{milestone.name}</p>
                        <p className="text-xs text-neutral-500">Due {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : 'TBD'}</p>
                      </div>
                      <Badge variant={milestone.status === 'completed' ? 'success' : milestone.status === 'in-progress' ? 'warning' : 'secondary'} size="sm">
                        {milestone.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600 mt-2">{milestone.description || '—'}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4" onSubmit={handleMemberSubmit}>
                <Select
                  label="Team Member"
                  name="user_id"
                  value={memberForm.user_id}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, user_id: e.target.value }))}
                  options={users.map((user) => ({ value: user.id, label: user.full_name }))}
                  required
                />
                <Input label="Role" name="role" value={memberForm.role} onChange={(e) => setMemberForm((prev) => ({ ...prev, role: e.target.value }))} placeholder="Owner, Designer, Analyst" />
                <Button type="submit" variant="primary" size="md" icon={<Users size={16} />}>
                  Assign Team Member
                </Button>
              </form>

              <div className="space-y-3 pt-4">
                {members.length === 0 ? (
                  <p className="text-sm text-neutral-600">No team assignments yet.</p>
                ) : members.map((member) => (
                  <div key={member.id} className="border border-neutral-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{member.user?.full_name || 'Assigned user'}</p>
                      <p className="text-xs text-neutral-500">{member.role || 'Team member'}</p>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Users size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
