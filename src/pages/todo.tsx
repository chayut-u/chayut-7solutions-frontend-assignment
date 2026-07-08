import Link from 'next/link'
import { useTodoList } from '../hooks/useTodoList'
import { MainList } from '../components/todo/MainList'
import { CategoryColumn } from '../components/todo/CategoryColumn'

export default function TodoPage() {
  const { mainList, activeItems, moveToColumn, cancelAndReturn } = useTodoList()

  return (
    <main className="app">
      <h1 className="app__title">Auto Delete Todo List</h1>
      <nav className="app__nav">
        <Link href="/">Home</Link>
        <Link href="/department-summary">Department Summary</Link>
      </nav>
      <div className="app__layout">
        <MainList items={mainList} onItemClick={moveToColumn} />
        <CategoryColumn type="Fruit" items={activeItems} onItemClick={cancelAndReturn} />
        <CategoryColumn type="Vegetable" items={activeItems} onItemClick={cancelAndReturn} />
      </div>
    </main>
  )
}
