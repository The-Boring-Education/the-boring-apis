import type { NextApiRequest, NextApiResponse } from 'next';

import { apiStatusCodes } from '@/config/constants';
import {
  handleGamificationPoints,
  updateUserProjectChapterInDB,
} from '@/database';
import type { UpdateUserChapterInProjectRequestProps } from '@/interfaces';
import { sendAPIResponse } from '@/utils';
import { connectDB } from '@/middleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    const { method } = req;

    switch (method) {
      case 'PATCH':
        return handleUpdateChapterStatus(req, res);
      default:
        return res.status(apiStatusCodes.BAD_REQUEST).json(
          sendAPIResponse({
            status: false,
            message: `Method ${req.method} Not Allowed`,
          })
        );
    }
  } catch (_error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: `Something went wrong`,
        error,
      })
    );
  }
};

const handleUpdateChapterStatus = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { userId, projectId, sectionId, chapterId, isCompleted } =
    req.body as UpdateUserChapterInProjectRequestProps;

  try {
    const { data, error } = await updateUserProjectChapterInDB({
      userId,
      projectId,
      sectionId,
      chapterId,
      isCompleted,
    });

    if (error) {
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Failed to update project chapter status',
        })
      );
    }

    await handleGamificationPoints(
      isCompleted,
      userId,
      'COMPLETE_PROJECT_CHAPTER'
    );

    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        data,
        message: 'Project chapter status updated successfully',
      })
    );
  } catch (_error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Failed to update project chapter status',
        error,
      })
    );
  }
};

export default handler;
