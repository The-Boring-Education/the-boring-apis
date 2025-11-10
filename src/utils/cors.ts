import Cors from 'cors';

import initMiddleware from './initMiddleware';

// CORS configuration - Allow all origins for now
// TODO: Restrict to specific domains in production for better security
export const cors = initMiddleware(
    Cors({
        origin: true, // Allow all origins and reflect the requesting origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true, // Critical: Enable credentials for NextAuth cookies
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'x-admin-secret',
            'cache',
            'Cookie',
            'X-Requested-With',
            'Accept',
            'Origin'
        ],
        exposedHeaders: ['Set-Cookie'],
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
);
