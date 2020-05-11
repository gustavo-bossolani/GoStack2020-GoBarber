import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlwares/ensureAuthenticated';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

// Rota: Receber a requisição, chamar outro arquivo, devolver uma resposta
// SoC: Separation of Concerns (Separação de preocupações)

appointmentsRouter.get('/', async (req, resp) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return resp.json(appointments);
});

appointmentsRouter.post('/', async (req, resp) => {
    const { provider_id, date } = req.body;

    // Convertendo a Data de formato String para Date()
    const parsedDate = parseISO(date);

    const service = new CreateAppointmentService();

    const appointment = await service.execute({
        date: parsedDate,
        provider_id,
    });

    return resp.json(appointment);
});

export default appointmentsRouter;
