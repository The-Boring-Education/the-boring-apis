import type { NextAuthOptions } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createGoogleProvider } from './google';
import { sessionConfig, getCookieConfig, getAuthSecret } from './session';
import type { AuthConfig } from './types';

/**
 * Factory function to create NextAuth configuration
 * Provides consistent auth setup across all apps
 *
 * @param config - Custom configuration options
 * @returns NextAuth configuration object
 */
export const createAuthOptions = (config: AuthConfig = {}): NextAuthOptions => {
    const { pages, onSignIn, onSession } = config;

    return {
        providers: [createGoogleProvider()],

        secret: getAuthSecret(),

        session: sessionConfig,

        cookies: getCookieConfig(),

        pages: pages || {
            signIn: '/auth/signin',
            error: '/auth/error'
        },

        callbacks: {
            async signIn({ user, account }) {
                // If custom sign-in logic is provided, use it
                if (onSignIn) {
                    return await onSignIn(user as any, account);
                }

                // Default: allow sign-in
                return true;
            },

            async jwt({ token, user, account }) {
                // Initial sign in
                if (account && user) {
                    return {
                        ...token,
                        accessToken: account.access_token,
                        provider: account.provider
                    };
                }

                return token;
            },

            async session({ session, token }) {
                // Attach user ID from token to session
                if (session.user) {
                    session.user.id = token.sub || '';

                    // If custom session logic is provided, use it
                    if (onSession) {
                        return await onSession(session, token);
                    }
                }

                return session;
            }
        },

        events: {
            async signIn({ user, account }) {
                console.log(
                    `User signed in: ${user.email} via ${account?.provider}`
                );
            },

            async signOut({ session }) {
                console.log(
                    `User signed out: ${session?.user?.email || 'unknown'}`
                );
            }
        },

        debug: process.env.NODE_ENV === 'development'
    };
};

/**
 * Server-side authentication middleware for API routes
 *
 * @param authOptions - NextAuth configuration
 * @returns Middleware function
 */
export const withAuth = (authOptions: NextAuthOptions) => {
    return (
        handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
    ) => {
        return async (req: NextApiRequest, res: NextApiResponse) => {
            try {
                const session = await getServerSession(req, res, authOptions);

                if (!session || !session.user) {
                    return res.status(401).json({
                        success: false,
                        error: true,
                        message: 'Authentication required'
                    });
                }

                // Attach session to request for handler to use
                (req as any).session = session
                ;(req as any).user = session.user;

                return handler(req, res);
            } catch (error) {
                console.error('Auth middleware error:', error);
                return res.status(500).json({
                    success: false,
                    error: true,
                    message: 'Authentication error'
                });
            }
        };
    };
};

/**
 * Server-side admin authentication middleware
 * Checks if user has admin privileges
 *
 * @param authOptions - NextAuth configuration
 * @param adminEmails - List of admin email addresses
 * @returns Middleware function
 */
export const withAdminAuth = (
    authOptions: NextAuthOptions,
    adminEmails: string[]
) => {
    return (
        handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
    ) => {
        return async (req: NextApiRequest, res: NextApiResponse) => {
            try {
                const session = await getServerSession(req, res, authOptions);

                if (!session || !session.user) {
                    return res.status(401).json({
                        success: false,
                        error: true,
                        message: 'Authentication required'
                    });
                }

                if (!adminEmails.includes(session.user.email || '')) {
                    return res.status(403).json({
                        success: false,
                        error: true,
                        message: 'Admin access required'
                    });
                }

                // Attach session to request for handler to use
                (req as any).session = session
                ;(req as any).user = session.user;

                return handler(req, res);
            } catch (error) {
                console.error('Admin auth middleware error:', error);
                return res.status(500).json({
                    success: false,
                    error: true,
                    message: 'Authentication error'
                });
            }
        };
    };
};
