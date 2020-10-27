import {Router, JSONOptions} from 'express';
import GameService from '../../../services/game';
import GameInputValidator from '../../../validators/gameInput';

const route = Router();

const validateInput = (req, next) => {
    const name = req && req.route && req.route.path && req.route.path.split("/")[1];
    if (typeof name !== "string" || name.length < 1) {
        return next({status: 500});
    }
    const validationResult = GameInputValidator[name](req.body);
    if (!validationResult.success) {
        return next({status: 400, message: validationResult.errorMessage});
    }
    return next();
}

export default (app: Router) => {
    app.use('/game', route);

    route.post('/init', (req, res, next) => validateInput(req, next), async (req, res, next) => {
        const {n} = req.body;
        const newGame = await GameService.init(n);

        if (!newGame.success) {
            return next({status: 400, message: newGame.errorMessage});
        }

        return res.json(newGame.game as JSONOptions).status(201);
    });

    route.post('/play', (req, res, next) => validateInput(req, next), async (req, res, next) => {
        const {id, source, destination} = req.body;
        const updatedGame = await GameService.play(id, source, destination);

        if (!updatedGame.success) {
            return next({status: 400, message: updatedGame.errorMessage});
        }

        return res.json(updatedGame.game as JSONOptions).status(200);
    });
};
