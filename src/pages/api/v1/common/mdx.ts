import type { NextApiRequest, NextApiResponse } from 'next';

import { apiStatusCodes } from '@/config/constants';
import { sendAPIResponse } from '@/utils';
import { cors } from '@/utils';
import { getMDXContent } from '@/utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Apply CORS headers
  await cors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  switch (req.method) {
    case 'GET':
      return generateMDXContent(req, res);
    case 'POST':
      return generateBulkMDXContent(req, res);

    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: `Method ${req.method} Not Allowed`,
        })
      );
  }
};

const generateMDXContent = async (req: NextApiRequest, res: NextApiResponse) =>
  res.status(apiStatusCodes.OKAY).json(getMDXContent());

const generateBulkMDXContent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { bulkMDPayload } = req.body;

  if (!bulkMDPayload) {
    return res.status(apiStatusCodes.BAD_REQUEST).json(
      sendAPIResponse({
        status: false,
        message: 'bulkMDPayload is required',
      })
    );
  }

  const mappedData = bulkMDPayload.map((item: any) => {
    const { name, path } = item;
    return {
      name,
      content: getMDXContent(path),
    };
  });

  return res.status(apiStatusCodes.OKAY).json(mappedData);
};

export default handler;
