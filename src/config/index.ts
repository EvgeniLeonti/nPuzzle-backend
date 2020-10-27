if (process.env.ENV !== 'production') {
    const dotenv = require('dotenv');
    const envFound = dotenv.config();
    if (envFound.error) {
        throw new Error(`Couldn't find .env file`);
    }
}

export default {
    PORT: parseInt(process.env.PORT, 10),
    LOGS: {
        level: process.env.LOG_LEVEL,
    },
    API: {
        prefix: '/api/v1'
    }
};
