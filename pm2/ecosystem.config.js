const config = {
    apps: getApps()
};

function getApps() {
    const NUMBER_OF_APPS = process.env.NUMBER_OF_APPS || 1;
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const BASE_PORT = process.env.BASE_PORT || 3300;
    const apps = [];

    for (let i = 0; i < NUMBER_OF_APPS; i++) {
        const app = {
            name: 'ispeak-webapp' + '-' + NODE_ENV + '-' + i,
            script: 'yarn',
            args: 'start'
        };
        apps.push(app);
    }

    return apps;
}

module.exports = config;
