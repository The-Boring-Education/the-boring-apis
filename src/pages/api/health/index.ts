import type { NextApiRequest, NextApiResponse } from 'next';

interface HealthResponse {
    status: 'healthy'
    timestamp: string
    uptime: number
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<HealthResponse>
) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end();
    }

    const response: HealthResponse = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    };

    res.status(200).json(response);
}
