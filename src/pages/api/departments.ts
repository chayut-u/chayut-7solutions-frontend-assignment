import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchUsers, UpstreamError } from '../../lib/fetchUsers'
import { transformUsers } from '../../lib/transform'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await fetchUsers()
    const summary = transformUsers(users)
    res.status(200).json({ success: true, data: summary })
  } catch (err) {
    if (err instanceof UpstreamError) {
      res.status(502).json({ success: false, error: { code: 'UPSTREAM_ERROR', message: err.message } })
      return
    }
    throw err
  }
}
