import type { TodoItem } from '../../types/todo'
import { ItemButton } from './ItemButton'

type Props = {
  items: TodoItem[]
  onItemClick: (item: TodoItem) => void
}

export function MainList({ items, onItemClick }: Props) {
  return (
    <section className="main-list" aria-labelledby="main-list-heading">
      <h2 id="main-list-heading" className="main-list__title">
        Items
      </h2>
      <div className="main-list__items">
        {items.map((item) => (
          <ItemButton key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </section>
  )
}
