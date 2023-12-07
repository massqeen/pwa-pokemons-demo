// @ts-check

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    cacheStartUrl: true,
    cacheOnFrontendNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: false,
    extendDefaultRuntimeCaching: true,
    workboxOptions: {
        runtimeCaching: [
            // Your runtimeCaching array
            {
                urlPattern: /\.(?:json|xml|csv)$/i,
                handler: "CacheFirst",
                options: {
                    cacheName: "static-data-assets",
                    expiration: {
                        maxEntries: 1000,
                        maxAgeSeconds: 48 * 60 * 60, // 48 hours
                    },
                },
            },
            {
                urlPattern: ({ sameOrigin }) => !sameOrigin,
                handler: "CacheFirst",
                options: {
                    cacheName: "cross-origin",
                    expiration: {
                        maxEntries: 1000,
                        maxAgeSeconds: 48 * 60 * 60, // 48 hours
                    },
                    networkTimeoutSeconds: 10, // fallback to cache if API does not response within 10 seconds
                },
            },
        ],
    },
})

module.exports = withPWA({
    reactStrictMode: true,
})