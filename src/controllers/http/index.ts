import {Router} from 'express';
import gameRoutes from './routes/game';

export default () => {
    const app = Router();
    gameRoutes(app);
    return app;
}