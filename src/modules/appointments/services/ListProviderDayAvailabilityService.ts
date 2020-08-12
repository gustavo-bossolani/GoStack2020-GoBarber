import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}
type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequestDTO): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      },
    );

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },

      // Aqui estamos começando a popular o array de horas a partir do numero 8
      (_, index) => index + hourStart,
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointmentsInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const currentDate = new Date(Date.now());

      // Ex: 2020-05-20 08:00:00
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        // Caso o agendamento não exista o horário está disponível
        // Caso o agendamento exista o horário não está disponível
        // No isAfter estamos verificando se o horário do agendamento é após o horário atual
        // Não é possível criar agendamentos em horários que já passaram
        available: !hasAppointmentsInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}
