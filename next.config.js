const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    cacheStartUrl: true,
    cacheOnFrontendNav: true,
    reloadOnOnline: true
})

module.exports = withPWA({
    reactStrictMode: true,
})