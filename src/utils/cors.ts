import Cors from 'cors';

import initMiddleware from './initMiddleware';

// Allowed origins for CORS - adjust based on environment
const getAllowedOrigins = () => {
    const origins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'https://platform.theboringeducation.com',
        'https://tbe-dev-git-development-tbe.vercel.app',
        'https://tbe-platform.vercel.app',
        'https://prep.theboringeducation.com',
        'https://quiz.theboringeducation.com',
        'https://onboarding.theboringeducation.com'
    ];

    // Add any custom origins from environment variable
    if (process.env.ALLOWED_ORIGINS) {
        origins.push(...process.env.ALLOWED_ORIGINS.split(','));
    }

    return origins;
};

export const cors = initMiddleware(
    Cors({
        origin: (origin, callback) => {
            const allowedOrigins = getAllowedOrigins();
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true, // ← Critical: Enable credentials for NextAuth cookies
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'x-admin-secret',
            'cache',
            'Cookie'
        ],
        exposedHeaders: ['Set-Cookie']
    })
);
