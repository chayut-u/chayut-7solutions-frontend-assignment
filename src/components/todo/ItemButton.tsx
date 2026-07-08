import type { TodoItem } from '../../types/todo'

type Props = {
  item: TodoItem
  onClick: (item: TodoItem) => void
  showTimer?: boolean
}

export function ItemButton({ item, onClick, showTimer }: Props) {
  return (
    <button
      type="button"
      className={`item-button item-button--${item.type.toLowerCase()}`}
      onClick={() => onClick(item)}
    >
      <span>{item.name}</span>
      {showTimer && <span className="item-button__timer-bar" aria-hidden="true" />}
    </button>
  )
}
