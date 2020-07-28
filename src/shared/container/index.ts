import { container } from 'tsyringe';

// Adicionando container de providers ao container 'principal'
import '@modules/users/providers';

// importando container dos providers
import './providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

/**
 * Diferença entre register e registerSingleton:
 * A função register vai retornar uma instância da dependência a cada requisição
 * A função registerSingleton retorna uma instância global e reutilizével  da dependência
 */

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
