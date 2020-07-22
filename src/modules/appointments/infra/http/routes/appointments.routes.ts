import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

// Rota: Receber a requisição, chamar outro arquivo, devolver uma resposta
// SoC: Separation of Concerns (Separação de preocupações)

// appointmentsRouter.get('/', async (req, resp) => {
//   const appointments = await appointmentsRepository.find();
//   return resp.json(appointments);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
