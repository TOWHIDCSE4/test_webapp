module.exports = {
    publicRuntimeConfig: {
        PRODUCTION: false
    },
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    images: {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    i18n: {
        locales: [ 'vi', 'en'],
        defaultLocale: 'en',
        localeDetection: true
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.(js|ts)x?$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    future: {
        webpack5: true,
    }
};
