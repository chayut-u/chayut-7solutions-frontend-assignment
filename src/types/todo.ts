export type ItemType = 'Fruit' | 'Vegetable'

export interface TodoItem {
  id: number
  type: ItemType
  name: string
}
