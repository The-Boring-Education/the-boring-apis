import type { NextApiRequest, NextApiResponse } from "next"

import { apiStatusCodes } from "@/config/constants"
import {
    enrollInACourse,
    getACourseFromDBById,
    getEnrolledCourseFromDB,
    getUserByIdFromDB
} from "@/database"
import type { CourseEnrollmentRequestProps } from "@/interfaces"
import { sendCourseEnrollmentEmail } from "@/services"
import { cors, sendAPIResponse } from "@/utils"
import { connectDB } from "@/middleware"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // CORS preflight support
        await cors(req, res)
        if (req.method === "OPTIONS") {
            return res.status(200).end()
        }
        await connectDB()

        switch (req.method) {
            case "POST":
                return handleCourseEnrollment(req, res)
            default:
                return res.status(apiStatusCodes.BAD_REQUEST).json(
                    sendAPIResponse({
                        status: false,
                        message: `Method ${req.method} Not Allowed`
                    })
                )
        }
    } catch (error) {
        return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
            sendAPIResponse({
                status: false,
                message: `Something went wrong`,
                error
            })
        )
    }
}

const handleCourseEnrollment = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const { userId, courseId } = (req.body ||
        {}) as CourseEnrollmentRequestProps

    if (!userId || !courseId) {
        return res.status(apiStatusCodes.BAD_REQUEST).json(
            sendAPIResponse({
                status: false,
                message: "userId and courseId are required",
                error: "MISSING_FIELDS"
            })
        )
    }

    try {
        const { data: alreadyExists, error: fetchEnrolledCourseError } =
            await getEnrolledCourseFromDB({ courseId, userId })

        if (fetchEnrolledCourseError)
            return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
                sendAPIResponse({
                    status: false,
                    message: "Failed while enrolling course"
                })
            )
        if (alreadyExists)
            return res.status(apiStatusCodes.BAD_REQUEST).json(
                sendAPIResponse({
                    status: false,
                    message: "Already enrolled in course"
                })
            )

        const { data, error } = await enrollInACourse({ userId, courseId })

        if (error)
            return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
                sendAPIResponse({
                    status: false,
                    message: "Failed while enrolling course"
                })
            )

        // Send course enrollment email (non-blocking)
        try {
            const [userResult, courseResult] = await Promise.all([
                getUserByIdFromDB(userId),
                getACourseFromDBById(courseId)
            ])

            if (userResult.data && courseResult.data) {
                sendCourseEnrollmentEmail({
                    email: userResult.data.email,
                    name: userResult.data.name,
                    id: userId,
                    courseName: courseResult.data.name,
                    courseDescription: courseResult.data.description
                }).catch((error) => {
                    console.error(
                        "Failed to send course enrollment email:",
                        error
                    )
                })
            }
        } catch (error) {
            console.error("Error fetching user/course data for email:", error)
        }

        return res.status(apiStatusCodes.OKAY).json(
            sendAPIResponse({
                status: true,
                data,
                message: "Successfully enrolled in course"
            })
        )
    } catch (error) {
        return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
            sendAPIResponse({
                status: false,
                message: "Failed while enrolling course",
                error
            })
        )
    }
}

export default handler
