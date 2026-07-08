import { useCallback, useEffect, useRef, useState } from 'react'
import type { TodoItem } from '../types/todo'
import { INITIAL_ITEMS, RETURN_DELAY_MS } from '../constants/items'

export function useTodoList() {
  const [mainList, setMainList] = useState<TodoItem[]>(INITIAL_ITEMS)
  const [activeItems, setActiveItems] = useState<TodoItem[]>([])

  // Timers live outside React state — they're a side effect, not something
  // that should trigger a re-render or ever be a useEffect dependency.
  // Keying by item.id (not the timer id) lets cancelAndReturn look one up
  // directly instead of scanning activeItems.
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const returnToMain = useCallback((item: TodoItem) => {
    timersRef.current.delete(item.id)
    setActiveItems((prev) => prev.filter((i) => i.id !== item.id))
    setMainList((prev) => [...prev, item])
  }, [])

  const moveToColumn = useCallback(
    (item: TodoItem) => {
      setMainList((prev) => prev.filter((i) => i.id !== item.id))
      setActiveItems((prev) => [...prev, item])

      const timerId = setTimeout(() => returnToMain(item), RETURN_DELAY_MS)
      timersRef.current.set(item.id, timerId)
    },
    [returnToMain],
  )

  const cancelAndReturn = useCallback(
    (item: TodoItem) => {
      const timerId = timersRef.current.get(item.id)
      if (timerId) {
        clearTimeout(timerId)
      }
      returnToMain(item)
    },
    [returnToMain],
  )

  // Runs once on unmount only — an empty dep array is required here, not
  // [activeItems], otherwise this would fire on every move and cancel
  // timers for items that haven't reached 5s yet.
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timerId) => clearTimeout(timerId))
    }
  }, [])

  return { mainList, activeItems, moveToColumn, cancelAndReturn }
}
