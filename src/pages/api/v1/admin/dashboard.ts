import type { NextApiRequest, NextApiResponse } from 'next';

import { apiStatusCodes } from '@/config/constants';
import {
    Course,
    getAllDocumentsFromModel,
    getTotalCountFromModel,
    InterviewSheet,
    Project,
    User,
    UserCourse,
    UserProject,
    UserSheet
} from '@/database';
import { cors, sendAPIResponse } from '@/utils';
import { connectDB } from '@/middleware';

// Helper function to convert date to IST and format it
const formatDateToIST = (date: Date) => {
    const istDate = new Date(
        date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    };

    const readableTime = istDate.toLocaleString('en-US', options);
    const daysAgo = Math.floor(
        (Date.now() - istDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
        readableTime: `${daysAgo} Days Ago | ${istDate.getDate()} ${istDate.toLocaleString(
            'default',
            { month: 'short', timeZone: 'Asia/Kolkata' }
        )} | ${readableTime}`,
        daysAgo,
        istDate
    };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await cors(req, res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    await connectDB();

    const { method, query } = req;
    const { type = 'overview', page = '1', limit = '20' } = query;

    if (method !== 'GET') {
        return res.status(apiStatusCodes.METHOD_NOT_ALLOWED).json(
            sendAPIResponse({
                status: false,
                message: `Method ${method} not allowed`
            })
        );
    }

    return handleAdminDashboard(
        res,
        type as string,
        parseInt(page as string),
        parseInt(limit as string)
    );
};

const handleAdminDashboard = async (
    res: NextApiResponse,
    type: string,
    page: number,
    limit: number
) => {
    try {
        const mapUserLearningProgress = (
            items: any[],
            type: 'course' | 'project' | 'sheet'
        ) =>
            items.map((item: any) => {
                const completedChapters =
                    type === 'course'
                        ? item.chapters?.filter((c: any) => c.isCompleted)
                            .length || 0
                        : undefined;
                const totalChapters =
                    type === 'course' ? item.chapters?.length || 0 : undefined;

                const lastUpdatedDate = new Date(item.updatedAt);
                const createdDate = new Date(item.createdAt);

                const lastUpdatedIST = formatDateToIST(lastUpdatedDate);
                const createdIST = formatDateToIST(createdDate);

                return {
                    _id: item._id,
                    user: {
                        userId: item.userId?._id,
                        userName: item.userId?.name,
                        userEmail: item.userId?.email,
                        userContactNo: item.userId?.contactNo
                    },
                    [type]: item[`${type}Id`],
                    completedChapters,
                    totalChapters,
                    isCompleted: item.isCompleted,
                    certificateId: item.certificateId,
                    lastUpdated: lastUpdatedIST.readableTime,
                    createdAt: createdIST.readableTime
                };
            });

        switch (type) {
            case 'overview': {
                const [
                    totalUsers,
                    totalCourses,
                    coursesEnrolled,
                    totalProjects,
                    projectsEnrolled,
                    totalSheets,
                    sheetsEnrolled
                ] = await Promise.all([
                    getTotalCountFromModel(User),
                    getTotalCountFromModel(Course),
                    getTotalCountFromModel(UserCourse),
                    getTotalCountFromModel(Project),
                    getTotalCountFromModel(UserProject),
                    getTotalCountFromModel(InterviewSheet),
                    getTotalCountFromModel(UserSheet)
                ]);

                return res.status(apiStatusCodes.OKAY).json(
                    sendAPIResponse({
                        status: true,
                        data: {
                            totalUsers: totalUsers.data || 0,
                            totalCourses: totalCourses.data || 0,
                            coursesEnrolled: coursesEnrolled.data || 0,
                            totalProjects: totalProjects.data || 0,
                            projectsEnrolled: projectsEnrolled.data || 0,
                            totalSheets: totalSheets.data || 0,
                            sheetsEnrolled: sheetsEnrolled.data || 0
                        }
                    })
                );
            }

            case 'users': {
                const {
                    data: { items },
                    error
                } = await getAllDocumentsFromModel(User, page, limit, [], {
                    updatedAt: -1
                });

                if (error) {
                    return res
                        .status(apiStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(
                            sendAPIResponse({
                                status: false,
                                error,
                                message: 'Failed to fetch users'
                            })
                        );
                }

                const total = await User.countDocuments();
                const totalPages = Math.ceil(total / limit);

                return res.status(apiStatusCodes.OKAY).json(
                    sendAPIResponse({
                        status: true,
                        data: {
                            items: items.map((item: any) => {
                                const lastUpdatedIST = formatDateToIST(
                                    new Date(item.updatedAt)
                                );
                                const createdIST = formatDateToIST(
                                    new Date(item.createdAt)
                                );

                                return {
                                    _id: item._id,
                                    name: item.name,
                                    userName: item.userName,
                                    email: item.email,
                                    contactNo: item.contactNo,
                                    isOnboarded: item.isOnboarded,
                                    occupation: item.occupation,
                                    purpose: item.purpose?.join(', ') || '',
                                    lastUpdated: lastUpdatedIST.readableTime,
                                    createdAt: createdIST.readableTime
                                };
                            }),
                            total,
                            currentPage: page,
                            totalPages
                        }
                    })
                );
            }

            case 'user-courses': {
                const {
                    data: { items },
                    error
                } = await getAllDocumentsFromModel(
                    UserCourse,
                    page,
                    limit,
                    [
                        { path: 'courseId', select: 'name slug coverImageURL' },
                        { path: 'userId', select: 'name email contactNo' }
                    ],
                    { updatedAt: -1 }
                );

                if (error) {
                    return res
                        .status(apiStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(
                            sendAPIResponse({
                                status: false,
                                error,
                                message: 'Failed to fetch user courses'
                            })
                        );
                }

                const mappedData = mapUserLearningProgress(items, 'course');
                const total = await UserCourse.countDocuments();
                const totalPages = Math.ceil(total / limit);

                return res.status(apiStatusCodes.OKAY).json(
                    sendAPIResponse({
                        status: true,
                        data: {
                            items: mappedData,
                            total,
                            currentPage: page,
                            totalPages
                        }
                    })
                );
            }

            case 'user-projects': {
                const {
                    data: { items },
                    error
                } = await getAllDocumentsFromModel(
                    UserProject,
                    page,
                    limit,
                    [
                        {
                            path: 'projectId',
                            select: 'name slug coverImageURL'
                        },
                        { path: 'userId', select: 'name email contactNo' }
                    ],
                    { updatedAt: -1 }
                );

                if (error) {
                    return res
                        .status(apiStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(
                            sendAPIResponse({
                                status: false,
                                error,
                                message: 'Failed to fetch user projects'
                            })
                        );
                }

                const mappedData = mapUserLearningProgress(items, 'project');
                const total = await UserProject.countDocuments();
                const totalPages = Math.ceil(total / limit);

                return res.status(apiStatusCodes.OKAY).json(
                    sendAPIResponse({
                        status: true,
                        data: {
                            items: mappedData,
                            total,
                            currentPage: page,
                            totalPages
                        }
                    })
                );
            }

            case 'user-sheets': {
                const {
                    data: { items },
                    error
                } = await getAllDocumentsFromModel(
                    UserSheet,
                    page,
                    limit,
                    [
                        {
                            path: 'sheetId',
                            select: 'name slug coverImageURL'
                        },
                        { path: 'userId', select: 'name email contactNo' }
                    ],
                    { updatedAt: -1 }
                );

                if (error) {
                    return res
                        .status(apiStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(
                            sendAPIResponse({
                                status: false,
                                error,
                                message: 'Failed to fetch user sheets'
                            })
                        );
                }

                const mappedData = mapUserLearningProgress(items, 'sheet');
                const total = await UserSheet.countDocuments();
                const totalPages = Math.ceil(total / limit);

                return res.status(apiStatusCodes.OKAY).json(
                    sendAPIResponse({
                        status: true,
                        data: {
                            items: mappedData,
                            total,
                            currentPage: page,
                            totalPages
                        }
                    })
                );
            }

            default:
                return res.status(apiStatusCodes.BAD_REQUEST).json(
                    sendAPIResponse({
                        status: false,
                        message: 'Invalid admin dashboard type'
                    })
                );
        }
    } catch (error) {
        return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
            sendAPIResponse({
                status: false,
                error,
                message: 'Unexpected error in admin dashboard API'
            })
        );
    }
};

export default handler;
