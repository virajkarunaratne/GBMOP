import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(11,107,162,0.12),_transparent_45%),linear-gradient(135deg,_#f7f9fc_0%,_#eef6fb_100%)]">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-16 lg:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
              GM
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">GMOP</p>
              <p className="text-sm text-neutral-600">Web operations platform</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login" className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-white">
              Sign In
            </Link>
            <Link href="/dashboard" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700">
              Open App
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
              Browser-based marketing operations
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              Run clients, projects, content, and tasks from one modern web workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-neutral-600">
              GMOP brings planning, approvals, delivery tracking, and team coordination into a secure, responsive experience designed for agencies and marketing teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/auth/login" className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
                Start Using GMOP
              </Link>
              <Link href="/projects" className="rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50">
                Explore Projects
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-primary-100/50">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm font-semibold text-primary-700">Web app highlights</p>
              <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                <li className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600" />Client and project management in one place</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600" />Monthly content planner to replace scattered sheets</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600" />Kanban, list, and calendar task workflows</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600" />Responsive web experience for desktop and tablet</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
