import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { DepartmentSummaryMap } from '../types/user'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: DepartmentSummaryMap }

export default function DepartmentSummaryPage() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    fetch('/api/departments')
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return
        if (!body.success) {
          setState({ status: 'error', message: body.error?.message ?? 'Unknown error' })
          return
        }
        setState({ status: 'ready', data: body.data })
      })
      .catch((err) => {
        if (!cancelled) setState({ status: 'error', message: err.message })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="app">
      <h1 className="app__title">Department Summary</h1>
      <nav className="app__nav">
        <Link href="/">Home</Link>
        <Link href="/todo">Todo List</Link>
      </nav>

      {state.status === 'loading' && <p className="state-message">Loading users from dummyjson…</p>}
      {state.status === 'error' && <p className="state-message">Failed to load: {state.message}</p>}

      {state.status === 'ready' && (
        <div className="dept-grid">
          {Object.entries(state.data).map(([department, summary]) => (
            <section key={department} className="dept-card">
              <h2 className="dept-card__title">{department}</h2>
              <div className="dept-card__row">
                <span>Male</span>
                <strong>{summary.male}</strong>
              </div>
              <div className="dept-card__row">
                <span>Female</span>
                <strong>{summary.female}</strong>
              </div>
              <div className="dept-card__row">
                <span>Age range</span>
                <strong>{summary.ageRange}</strong>
              </div>
              <div className="dept-card__hair">
                {Object.entries(summary.hair).map(([color, count]) => (
                  <span key={color}>
                    {color}: {count}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
