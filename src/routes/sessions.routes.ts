import { Router } from 'express';
import SessionService from '../services/CreateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, resp) => {
    const { email, password } = req.body;

    const sessionService = new SessionService();

    const { user, token } = await sessionService.execute({
        email,
        password,
    });

    return resp.json({ user, token });
});

export default sessionsRouter;
