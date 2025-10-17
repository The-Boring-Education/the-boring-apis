const NODE_ENV = process.env.NODE_ENV as string;
const MONGODB_URI = process.env.MONGODB_URI as string;
const ADMIN_SECRET = process.env.ADMIN_SECRET as string;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY as string;
const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL as string;
const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL as string;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY as string;
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID as string;
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN as string;

// Email Service Configuration
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL as string;
const EMAIL_API_KEY = process.env.EMAIL_API_KEY as string;
const FROM_EMAIL = process.env.FROM_EMAIL as string;

const envConfig = {
    NODE_ENV,
    MONGODB_URI,
    ADMIN_SECRET,
    YOUTUBE_API_KEY,
    NEXTAUTH_SECRET,
    GA_TRACKING_ID,
    ADMIN_BASE_URL,
    CASHFREE_BASE_URL,
    CASHFREE_SECRET_KEY,
    CASHFREE_CLIENT_ID,
    SENTRY_DSN,
    EMAIL_SERVICE_URL,
    EMAIL_API_KEY,
    FROM_EMAIL
};

export { envConfig };

