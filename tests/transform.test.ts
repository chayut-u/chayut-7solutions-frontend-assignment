import { describe, it, expect } from 'vitest'
import { transformUsers } from '../src/lib/transform'
import type { SourceUser } from '../src/types/user'

function makeUser(overrides: Partial<SourceUser> = {}): SourceUser {
  return {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    gender: 'male',
    hair: { color: 'Black' },
    address: { postalCode: '10110' },
    company: { department: 'Engineering' },
    ...overrides,
  }
}

describe('transformUsers', () => {
  it('groups users into separate departments with correct counts', () => {
    const users = [
      makeUser({ firstName: 'Alice', lastName: 'A', gender: 'female', company: { department: 'Engineering' } }),
      makeUser({ firstName: 'Bob', lastName: 'B', gender: 'male', company: { department: 'Sales' } }),
    ]

    const result = transformUsers(users)

    expect(Object.keys(result).sort()).toEqual(['Engineering', 'Sales'])
    expect(result.Engineering.female).toBe(1)
    expect(result.Engineering.male).toBe(0)
    expect(result.Sales.male).toBe(1)
  })

  it('computes ageRange as "N-N" for a single user in a department', () => {
    const users = [makeUser({ age: 30 })]
    const result = transformUsers(users)
    expect(result.Engineering.ageRange).toBe('30-30')
  })

  it('returns an empty object for an empty input array', () => {
    expect(transformUsers([])).toEqual({})
  })

  it('accumulates hair color counts across multiple users', () => {
    const users = [
      makeUser({ firstName: 'A', lastName: '1', hair: { color: 'Black' } }),
      makeUser({ firstName: 'B', lastName: '2', hair: { color: 'Black' } }),
      makeUser({ firstName: 'C', lastName: '3', hair: { color: 'Blond' } }),
    ]

    const result = transformUsers(users)

    expect(result.Engineering.hair).toEqual({ Black: 2, Blond: 1 })
  })

  it('overwrites addressUser when firstName+lastName collide (documented limitation)', () => {
    const users = [
      makeUser({ firstName: 'John', lastName: 'Doe', address: { postalCode: '10110' } }),
      makeUser({ firstName: 'John', lastName: 'Doe', address: { postalCode: '99999' } }),
    ]

    const result = transformUsers(users)

    expect(result.Engineering.addressUser.JohnDoe).toBe('99999')
  })

  it('keeps the unused gender field at 0 (not undefined) when all users share one gender', () => {
    const users = [makeUser({ gender: 'male' }), makeUser({ firstName: 'X', lastName: 'Y', gender: 'male' })]
    const result = transformUsers(users)
    expect(result.Engineering.female).toBe(0)
  })

  it('tracks min/max age correctly across an unordered sequence', () => {
    const users = [
      makeUser({ firstName: 'A', lastName: '1', age: 45 }),
      makeUser({ firstName: 'B', lastName: '2', age: 22 }),
      makeUser({ firstName: 'C', lastName: '3', age: 33 }),
    ]

    const result = transformUsers(users)

    expect(result.Engineering.ageRange).toBe('22-45')
  })
})
