import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

/**
 * [X] Recebimento das informações
 * [X] Tratativa de erros/excessões
 * [X] Acesso ao repositorio
 */

// DRY: Don't repeat Yourself

interface IRequestDTO {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  // Um service deve ter apenas um método.
  // Um service nunca deve ter acesso a requisição e reposta
  // Um service sempre retorna erros

  // Aqui está sendo implementato o D do SOLID (Dependency Inversion)
  // private repository: AppointmentsRepository;

  // constructor(private repository: AppointmentsRepository) {}

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    date,
    provider_id,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Este horário já foi agendado.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
