import Link from 'next/link'

export default function Home() {
  return (
    <main className="app">
      <h1 className="app__title">7solutions Frontend Coding Test</h1>
      <nav className="app__nav">
        <Link href="/todo">Todo List</Link>
        <Link href="/department-summary">Department Summary</Link>
      </nav>
    </main>
  )
}
