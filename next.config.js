// @ts-check

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    cacheStartUrl: true,
    cacheOnFrontendNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    extendDefaultRuntimeCaching: true,
    workboxOptions: {
        runtimeCaching: [
            // Your runtimeCaching array
            {
                urlPattern: /\/_next\/image\?url=.+$/i,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "next-image",
                    expiration: {
                        maxEntries: 1000,
                        maxAgeSeconds: 48 * 60 * 60, // 48 hours
                    },
                },
            },
            {
                urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "static-image-assets",
                    expiration: {
                        maxEntries: 1000,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    },
                },
            },
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
                urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
                    request.headers.get("RSC") === "1" &&
                    sameOrigin &&
                    !pathname.startsWith("/api/"),
                handler: "CacheFirst",
                options: {
                    cacheName: "pages-rsc",
                    expiration: {
                        maxEntries: 1000,
                        maxAgeSeconds: 48 * 60 * 60, // 48 hours
                    },
                },
            },
            {
                urlPattern: ({ url: { pathname }, sameOrigin }) =>
                    sameOrigin && !pathname.startsWith("/api/"),
                handler: "CacheFirst",
                options: {
                    cacheName: "pages",
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
                    // networkTimeoutSeconds: 10, // fallback to cache if API does not response within 10 seconds
                },
            },
            {
                urlPattern: ({ url: { pathname } }) =>
                    pathname.includes("maps.googleapis.com"),
                handler: "CacheFirst",
                options: {
                    cacheName: "maps",
                    expiration: {
                        maxEntries: 2000,
                        maxAgeSeconds: 48 * 60 * 60, // 48 hours
                    },
                },
            },
        ],
    },
})

module.exports = withPWA({
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
            },
        ],
    },
})