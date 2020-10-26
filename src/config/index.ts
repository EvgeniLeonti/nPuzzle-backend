//TODO use dotenv

export default {
  port: parseInt(process.env.PORT, 10) || 8080,
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
  api: {
    prefix: '/api/v1'
  }
};
