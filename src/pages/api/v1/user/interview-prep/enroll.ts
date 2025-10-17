import type { NextApiRequest, NextApiResponse } from "next"

import { apiStatusCodes } from "@/config/constants"
import {
    enrollInASheet,
    getEnrolledSheetFromDB,
    getInterviewSheetByIDFromDB,
    getUserByIdFromDB
} from "@/database"
import type { SheetEnrollmentRequestProps } from "@/interfaces"
import { sendInterviewPrepEnrollmentEmail } from "@/services"
import { cors, sendAPIResponse } from "@/utils"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await cors(req, res)
        if (req.method === "OPTIONS") {
            return res.status(200).end()
        }
        switch (req.method) {
            case "POST":
                return handleSheetEnrollment(req, res)
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

const handleSheetEnrollment = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const { userId, sheetId } = req.body as SheetEnrollmentRequestProps

    try {
        const { data: alreadyExists, error: fetchEnrolledSheetError } =
            await getEnrolledSheetFromDB({ sheetId, userId })

        if (fetchEnrolledSheetError)
            return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
                sendAPIResponse({
                    status: false,
                    message: "Failed while enrolling in sheet"
                })
            )

        if (alreadyExists)
            return res.status(apiStatusCodes.BAD_REQUEST).json(
                sendAPIResponse({
                    status: false,
                    message: "Already enrolled in sheet"
                })
            )

        const { data, error } = await enrollInASheet({ userId, sheetId })

        if (error)
            return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
                sendAPIResponse({
                    status: false,
                    message: "Failed while enrolling in sheet"
                })
            )

        // Send interview prep enrollment email (non-blocking)
        try {
            const [userResult, sheetResult] = await Promise.all([
                getUserByIdFromDB(userId),
                getInterviewSheetByIDFromDB(sheetId)
            ])

            if (userResult.data && sheetResult.data) {
                sendInterviewPrepEnrollmentEmail({
                    email: userResult.data.email,
                    name: userResult.data.name,
                    id: userId,
                    sheetName: sheetResult.data.name,
                    sheetDescription: sheetResult.data.description
                }).catch((error) => {
                    console.error(
                        "Failed to send interview prep enrollment email:",
                        error
                    )
                })
            }
        } catch (error) {
            console.error("Error fetching user/sheet data for email:", error)
        }

        return res.status(apiStatusCodes.OKAY).json(
            sendAPIResponse({
                status: true,
                data,
                message: "Successfully enrolled in sheet"
            })
        )
    } catch (error) {
        return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
            sendAPIResponse({
                status: false,
                message: "Failed while enrolling in sheet",
                error
            })
        )
    }
}

export default handler
