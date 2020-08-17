import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { month, year, day } = request.body;

    const service = container.resolve(ListProviderAppointmentsService);

    const appointments = await service.execute({
      provider_id,
      year,
      month,
      day,
    });

    return response.json(appointments);
  }
}
