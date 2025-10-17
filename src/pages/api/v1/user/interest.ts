import type { NextApiRequest, NextApiResponse } from 'next';

import { apiStatusCodes } from '@/config/constants';
import {
  createUserInterestInDB,
  getUserInterestsFromDB,
  updateUserInterestInDB,
} from '@/database';
import type {
  CreateUserInterestRequestProps,
  GetUserInterestsRequestProps,
} from '@/interfaces';
import { sendAPIResponse } from '@/utils';
import { cors } from '@/utils';
import { connectDB } from '@/middleware';

/**
 * API Handler for User Interests
 * POST /user/interest - Create new user interest
 * GET /user/interest - Get user interests with filters
 * PATCH /user/interest - Update interest status (activate/deactivate)
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Apply CORS headers
  await cors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectDB();
  const { method } = req;

  switch (method) {
    case 'POST':
      return handleCreateInterest(req, res);
    case 'GET':
      return handleGetInterests(req, res);
    case 'PATCH':
      return handleUpdateInterest(req, res);
    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: `Method ${req.method} Not Allowed`,
        })
      );
  }
};

const handleCreateInterest = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const {
      userId,
      eventType,
      eventDescription,
      metadata,
      source,
    }: CreateUserInterestRequestProps = req.body;

    if (!userId || !eventType || !source) {
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: 'Required fields: userId, eventType, source',
        })
      );
    }

    // Get client IP and user agent for tracking
    const ipAddress = 
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.headers['x-real-ip']?.toString() ||
      req.connection.remoteAddress ||
      'unknown';
    
    const userAgent = req.headers['user-agent'] || 'unknown';

    const { data, error } = await createUserInterestInDB({
      userId,
      eventType,
      eventDescription,
      metadata,
      source,
      ipAddress,
      userAgent,
    });

    if (error) {
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Failed to create user interest',
          error,
        })
      );
    }

    return res.status(apiStatusCodes.RESOURCE_CREATED).json(
      sendAPIResponse({
        status: true,
        data,
        message: 'User interest created successfully',
      })
    );
  } catch (error: any) {
    console.error('Error creating user interest:', error);
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Failed to create user interest',
        error: error.message,
      })
    );
  }
};

const handleGetInterests = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const {
      userId,
      eventType,
      source,
      isActive,
      page = '1',
      limit = '10',
    } = req.query as unknown as GetUserInterestsRequestProps & {
      page: string;
      limit: string;
    };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Parse isActive properly
    let parsedIsActive: boolean | undefined;
    if (isActive !== undefined) {
      parsedIsActive = typeof isActive === 'string' ? isActive === 'true' : Boolean(isActive);
    }

    const { data, error } = await getUserInterestsFromDB({
      userId,
      eventType,
      source,
      isActive: parsedIsActive,
      page: pageNum,
      limit: limitNum,
    });

    if (error) {
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Failed to get user interests',
          error,
        })
      );
    }

    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        data,
        message: 'User interests retrieved successfully',
      })
    );
  } catch (error: any) {
    console.error('Error getting user interests:', error);
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Failed to get user interests',
        error: error.message,
      })
    );
  }
};

const handleUpdateInterest = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { interestId, isActive } = req.body;

    if (!interestId || isActive === undefined) {
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: 'Required fields: interestId, isActive',
        })
      );
    }

    const { data, error } = await updateUserInterestInDB(interestId, isActive);

    if (error) {
      if (error === 'Interest not found') {
        return res.status(apiStatusCodes.NOT_FOUND).json(
          sendAPIResponse({
            status: false,
            message: error,
          })
        );
      }

      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Failed to update user interest',
          error,
        })
      );
    }

    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        data,
        message: 'Interest status updated successfully',
      })
    );
  } catch (error: any) {
    console.error('Error updating user interest:', error);
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Failed to update user interest',
        error: error.message,
      })
    );
  }
};

export default handler;