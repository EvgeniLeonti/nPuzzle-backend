//TODO use dotenv

export default {
  port: parseInt(process.env.PORT, 10) || 80,
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
  api: {
    prefix: '/api', // todo version
  }
};
