import type { NextApiRequest, NextApiResponse } from 'next';

import { apiStatusCodes } from '@/config/constants';
import { InterviewSheet } from '@/database';
import type { UpdateCompanyTypePayload } from '@/interfaces';
import { sendAPIResponse } from '@/utils';
import { connectDB } from '@/middleware';

/**
 * API Handler to update company types for multiple interview questions
 * POST /api/v1/interview-prep/company-types/update
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    const { method } = req;

    switch (method) {
        case 'POST':
            return handleUpdateCompanyTypes(req, res);
        default:
            return res.status(apiStatusCodes.BAD_REQUEST).json(
                sendAPIResponse({
                    status: false,
                    message: `Method ${req.method} Not Allowed`
                })
            );
    }
};

const handleUpdateCompanyTypes = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const { questionIds, companyTypes }: UpdateCompanyTypePayload = req.body;

        if (
            !questionIds ||
      !Array.isArray(questionIds) ||
      questionIds.length === 0
        ) {
            return res.status(apiStatusCodes.BAD_REQUEST).json(
                sendAPIResponse({
                    status: false,
                    message: 'Question IDs array is required'
                })
            );
        }

        if (
            !companyTypes ||
      !Array.isArray(companyTypes) ||
      companyTypes.length === 0
        ) {
            return res.status(apiStatusCodes.BAD_REQUEST).json(
                sendAPIResponse({
                    status: false,
                    message: 'Company types array is required'
                })
            );
        }

        // Update questions across all interview sheets
        const updateResult = await InterviewSheet.updateMany(
            { 'questions._id': { $in: questionIds } },
            {
                $set: {
                    'questions.$[elem].companyTypes': companyTypes
                }
            },
            {
                arrayFilters: [{ 'elem._id': { $in: questionIds } }],
                multi: true
            }
        );

        return res.status(apiStatusCodes.OKAY).json(
            sendAPIResponse({
                status: true,
                data: {
                    modifiedCount: updateResult.modifiedCount,
                    matchedCount: updateResult.matchedCount
                },
                message: 'Company types updated successfully'
            })
        );
    } catch (error: any) {
        console.error('Error updating company types:', error);
        return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
            sendAPIResponse({
                status: false,
                message: 'Failed while updating company types',
                error: error.message
            })
        );
    }
};

export default handler;
