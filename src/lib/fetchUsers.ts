import type { DummyJsonUsersResponse, SourceUser } from '../types/user'

const SOURCE_URL = 'https://dummyjson.com/users?limit=0'
const FETCH_TIMEOUT_MS = 5000
const CACHE_TTL_MS = 60_000

let cache: { data: SourceUser[]; expiresAt: number } | null = null

export class UpstreamError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UpstreamError'
  }
}

export async function fetchUsers(): Promise<SourceUser[]> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.data
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(SOURCE_URL, { signal: controller.signal })
  } catch (err) {
    throw new UpstreamError(`Failed to reach dummyjson: ${(err as Error).message}`)
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new UpstreamError(`dummyjson responded with status ${response.status}`)
  }

  const body = (await response.json()) as DummyJsonUsersResponse
  if (!Array.isArray(body.users)) {
    throw new UpstreamError('dummyjson response missing users array')
  }

  cache = { data: body.users, expiresAt: Date.now() + CACHE_TTL_MS }
  return body.users
}
