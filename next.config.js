/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    // API-only configuration
    poweredByHeader: false,

    // Enable standalone output for containerized deployments
    output: "standalone",

    // Disable image optimization for API-only apps
    images: {
        unoptimized: true
    },

    // Environment variables
    env: {
        // Add other environment variables here if needed
        // NODE_ENV is automatically handled by Next.js
    },

    // Experimental features for better containerization
    experimental: {
        // Reduce memory usage
        isrMemoryCacheSize: 0,
        // Disable symlinks for Windows compatibility
        esmExternals: false
    },

    // Redirect all non-API routes to API documentation or health check
    async redirects() {
        return [
            {
                source: "/",
                destination: "/api/health",
                permanent: false
            }
        ]
    },

    // Headers for CORS - Let the CORS middleware handle everything
    async headers() {
        return []
    }
}

export default nextConfig
