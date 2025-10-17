import type { NextApiRequest, NextApiResponse } from 'next';

import { apiStatusCodes } from '@/config/constants';
import { DevRelLead } from '@/database';
import { sendAPIResponse } from '@/utils';
import { connectDB } from '@/middleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(apiStatusCodes.METHOD_NOT_ALLOWED).json(
      sendAPIResponse({
        status: false,
        message: 'Method not allowed',
      })
    );
  } 

  try {
    await connectDB();

    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: 'Email parameter is required',
        })
      );
    }

    // Check if application exists
    const application = await DevRelLead.findOne({ email: email.toLowerCase() });

    if (!application) {
      return res.status(apiStatusCodes.NOT_FOUND).json(
        sendAPIResponse({
          status: true,
          data: null,
          message: 'No application found for this email',
        })
      );
    }

    // Return application status
    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        data: {
          id: application._id,
          email: application.email,
          status: application.status,
          submittedAt: application.createdAt,
          rejectedAt: application.rejectedAt,
          rejectionReason: application.rejectionReason,
          interviewDate: application.interviewData?.scheduledAt,
          interviewLink: application.interviewData?.meetingLink,
        },
        message: 'Application status retrieved successfully',
      })
    );

  } catch (_error) {
    console.error('Error checking application status:', error);
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        error: true,
        message: 'Internal server error while checking application status',
      })
    );
  }
};

export default handler; 