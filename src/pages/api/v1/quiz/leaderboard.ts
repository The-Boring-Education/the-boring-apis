import type { NextApiRequest, NextApiResponse } from 'next';

import { getLeaderboardFromDB } from '@/database';
import { cors } from '@/utils';
import { connectDB } from '@/middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    return handleGetLeaderboard(req, res);
  } catch (_error) {
    console.error('Leaderboard API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetLeaderboard(req: NextApiRequest, res: NextApiResponse) {
  const { limit = '50', category } = req.query;
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
  const _categoryFilter = typeof category === 'string' ? category : undefined;

  const { data: leaderboard, error } = await getLeaderboardFromDB(limitNum);

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json({
    success: true,
    data: leaderboard
  });
}

export default handler;