export interface SourceUser {
  firstName: string
  lastName: string
  age: number
  gender: 'male' | 'female'
  hair: { color: string; type?: string }
  address: { postalCode: string }
  company: { department: string }
}

export interface DummyJsonUsersResponse {
  users: SourceUser[]
  total: number
  skip: number
  limit: number
}

export interface DepartmentSummary {
  male: number
  female: number
  ageRange: string
  hair: Record<string, number>
  addressUser: Record<string, string>
}

export type DepartmentSummaryMap = Record<string, DepartmentSummary>
