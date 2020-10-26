import config from './config';
import express from 'express';
import loaders from './loaders';
import Logger from './loaders/logger';

(async () => {
    const app = express();

    await loaders({ expressApp: app });

    app.listen(config.port, () => {
        Logger.info(`server listening on port: ${config.port}`);
    }).on('error', error => {
        Logger.error(`failed on server start`, {error})
        process.exit(1);
    });
})().catch(error => {
    Logger.error(`failed on server start`, {error});
    process.exit(1);
})
