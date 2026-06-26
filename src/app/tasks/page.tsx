'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { LayoutGrid, List, CalendarDays, Plus, Loader } from 'lucide-react'
import { useRequireAuth } from '@/components/ProtectedRoute'
import { TopNavigation } from '@/components/TopNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { supabase } from '@/lib/supabase'
import { Task } from '@/types'

export default function TasksPage() {
  const { loading: authLoading } = useRequireAuth(['Administrator', 'Marketing Manager', 'Sales Executive'])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'kanban' | 'list' | 'calendar'>('kanban')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true })
        if (error) throw error
        setTasks((data as Task[]) || [])
      } catch (err) {
        console.error('Error fetching tasks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const groupedByStatus = useMemo(() => {
    return {
      todo: tasks.filter((task) => task.status === 'todo'),
      'in-progress': tasks.filter((task) => task.status === 'in-progress'),
      review: tasks.filter((task) => task.status === 'review'),
      done: tasks.filter((task) => task.status === 'done'),
    }
  }, [tasks])

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
            <h1 className="text-3xl font-bold text-neutral-900">Task Management</h1>
            <p className="text-neutral-600 mt-2">Plan work in Kanban, list, or calendar view.</p>
          </div>
          <Button variant="primary" size="md" icon={<Plus size={18} />}>
            New Task
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setView('kanban')} className={`px-3 py-2 rounded-lg text-sm font-medium ${view === 'kanban' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200'}`}>
            <LayoutGrid size={16} className="inline mr-2" /> Kanban
          </button>
          <button onClick={() => setView('list')} className={`px-3 py-2 rounded-lg text-sm font-medium ${view === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200'}`}>
            <List size={16} className="inline mr-2" /> List
          </button>
          <button onClick={() => setView('calendar')} className={`px-3 py-2 rounded-lg text-sm font-medium ${view === 'calendar' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200'}`}>
            <CalendarDays size={16} className="inline mr-2" /> Calendar
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="text-primary-600 animate-spin" />
          </div>
        ) : view === 'kanban' ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {Object.entries(groupedByStatus).map(([status, statusTasks]) => (
              <Card key={status}>
                <CardHeader>
                  <CardTitle className="capitalize">{status.replace('-', ' ')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {statusTasks.length === 0 ? (
                    <p className="text-sm text-neutral-600">No tasks</p>
                  ) : statusTasks.map((task) => (
                    <div key={task.id} className="border border-neutral-200 rounded-lg p-3 bg-neutral-50">
                      <p className="font-medium text-neutral-900">{task.title}</p>
                      <p className="text-xs text-neutral-600 mt-1">{task.description || 'No description'}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'secondary'} size="sm">
                          {task.priority}
                        </Badge>
                        {task.due_date ? <span className="text-xs text-neutral-500">{new Date(task.due_date).toLocaleDateString()}</span> : null}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : view === 'list' ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="border border-neutral-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                      <p className="font-medium text-neutral-900">{task.title}</p>
                      <p className="text-sm text-neutral-600 mt-1">{task.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'secondary'} size="sm">{task.priority}</Badge>
                      <Badge variant={task.status === 'done' ? 'success' : task.status === 'review' ? 'warning' : 'secondary'} size="sm">{task.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="border border-neutral-200 rounded-lg p-4">
                    <p className="font-medium text-neutral-900">{task.title}</p>
                    <p className="text-sm text-neutral-600 mt-1">{task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString()}` : 'No due date'}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
