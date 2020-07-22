import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointsmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    // Convertendo a Data de formato String para Date()
    const parsedDate = parseISO(date);

    const service = container.resolve(CreateAppointsmentService);

    const appointment = await service.execute({
      date: parsedDate,
      provider_id,
    });

    return response.json(appointment);
  }
}
