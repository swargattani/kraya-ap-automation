import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

/**
 * Gets the session and extracts companyId.
 * Returns { session, companyId } or sends a 401 and returns null.
 */
export async function requireSession(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return { session, companyId: session.user.companyId || null };
}
