import type { SourceUser, DepartmentSummaryMap } from '../types/user'

export function transformUsers(users: SourceUser[]): DepartmentSummaryMap {
  const result: DepartmentSummaryMap = {}
  const ageTracker: Record<string, { min: number; max: number }> = {}

  for (const user of users) {
    const dept = user.company.department

    if (!result[dept]) {
      result[dept] = { male: 0, female: 0, ageRange: '', hair: {}, addressUser: {} }
      ageTracker[dept] = { min: user.age, max: user.age }
    }

    const summary = result[dept]
    const ages = ageTracker[dept]

    if (user.gender === 'male') {
      summary.male += 1
    } else {
      summary.female += 1
    }

    if (user.age < ages.min) ages.min = user.age
    if (user.age > ages.max) ages.max = user.age

    const hairColor = user.hair.color
    summary.hair[hairColor] = (summary.hair[hairColor] ?? 0) + 1

    summary.addressUser[`${user.firstName}${user.lastName}`] = user.address.postalCode
  }

  for (const dept of Object.keys(result)) {
    result[dept].ageRange = `${ageTracker[dept].min}-${ageTracker[dept].max}`
  }

  return result
}
