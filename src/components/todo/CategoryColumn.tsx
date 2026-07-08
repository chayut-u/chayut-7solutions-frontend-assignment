import type { ItemType, TodoItem } from '../../types/todo'
import { ItemButton } from './ItemButton'

type Props = {
  type: ItemType
  items: TodoItem[]
  onItemClick: (item: TodoItem) => void
}

export function CategoryColumn({ type, items, onItemClick }: Props) {
  const filtered = items.filter((item) => item.type === type)
  const headingId = `column-${type}`

  return (
    <section className={`category-column category-column--${type.toLowerCase()}`} aria-labelledby={headingId}>
      <h2 id={headingId} className="category-column__title">
        {type}
      </h2>
      <div className="category-column__items">
        {filtered.map((item) => (
          <ItemButton key={item.id} item={item} onClick={onItemClick} showTimer />
        ))}
      </div>
    </section>
  )
}
