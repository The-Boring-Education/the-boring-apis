import type { NextApiRequest, NextApiResponse } from 'next';

import { getLeaderboardFromDB } from '@/database';
import { cors } from '@/utils';
import { connectDB } from '@/middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS headers
  await cors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { limit } = req.query;

  try {
    await connectDB();

    const { data, error } = await getLeaderboardFromDB(
      limit ? parseInt(limit as string) : 10
    );

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: true, data });
  } catch (_error) {
    console.error('Leaderboard API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;
