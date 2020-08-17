import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointsmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    // Convertendo a Data de formato String para Date()
    // const parsedDate = parseISO(date);

    const service = container.resolve(CreateAppointsmentService);

    const appointment = await service.execute({
      provider_id,
      user_id,
      date,
    });

    return response.json(appointment);
  }
}
