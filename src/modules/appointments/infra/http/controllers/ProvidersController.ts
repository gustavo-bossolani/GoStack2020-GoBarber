import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class AppointmentController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const service = container.resolve(ListProvidersService);

    const providers = await service.execute({
      user_id,
    });

    return response.json(providers);
  }
}
