import type {
    AddFeedbackRequestProps,
    DatabaseQueryResponseType,
    UpdateFeedbackRequestProps
} from "@/interfaces"

import { Feedback } from "../models"

const addFeedbackToDB = async ({
    rating,
    type,
    ref,
    userId
}: AddFeedbackRequestProps): Promise<DatabaseQueryResponseType> => {
    try {
        const newFeedback = new Feedback({
            rating,
            type,
            ref,
            user: userId,
            feedback: ""
        })

        await newFeedback.save()
        return { data: newFeedback }
    } catch (_error) {
        return { error: "Failed to create feedback" }
    }
}

const updateFeedbackTextInDB = async ({
    feedbackId,
    userId,
    feedback
}: UpdateFeedbackRequestProps): Promise<DatabaseQueryResponseType> => {
    try {
        const existingFeedback = await Feedback.findOne({
            _id: feedbackId,
            user: userId
        })

        if (!existingFeedback) {
            return { error: "Feedback not found" }
        }

        existingFeedback.feedback = feedback
        await existingFeedback.save()
        return { data: existingFeedback }
    } catch (_error) {
        return { error: "Failed to update feedback text" }
    }
}

export { addFeedbackToDB, updateFeedbackTextInDB }
