import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

/**
 * [X] Recebimento das informações
 * [X] Tratativa de erros/excessões
 * [X] Acesso ao repositorio
 */

// DRY: Don't repeat Yourself

interface IRequestDTO {
  provider_id: string;
  user_id: string;
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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError(
        'Não é possível criar um agendamento em horários passados.',
      );
    }

    if (user_id === provider_id) {
      throw new AppError('Não é possível criar um agendamento com você mesmo.');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'Agendamentos devem estar entre 8h da manhã e 17h da tarde.',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Este horário já foi agendado.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormated = format(appointment.date, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormated}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
