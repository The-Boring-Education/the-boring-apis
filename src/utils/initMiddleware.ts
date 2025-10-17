// Conditional imports to avoid issues when Next.js is not available
let _NextApiRequest: any
let _NextApiResponse: any

try {
    const next = require("next")
    _NextApiRequest = next.NextApiRequest
    _NextApiResponse = next.NextApiResponse
} catch (error) {
    _NextApiRequest = class {}
    _NextApiResponse = class {}
}

export default function initMiddleware(middleware: any) {
    return (req: typeof _NextApiRequest, res: typeof _NextApiResponse) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result: any) => {
                if (result instanceof Error) return reject(result)
                return resolve(result)
            })
        })
}
