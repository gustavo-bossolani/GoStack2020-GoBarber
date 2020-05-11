import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

import AppError from '../errors/AppError';

/**
 * [X] Recebimento das informações
 * [X] Tratativa de erros/excessões
 * [X] Acesso ao repositorio
 */

// DRY: Don't repeat Yourself

interface RequestDTO {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    // Um service deve ter apenas um método.
    // Um service nunca deve ter acesso a requisição e reposta
    // Um service sempre retorna erros

    // Aqui está sendo implementato o D do SOLID (Dependency Inversion)
    // private repository: AppointmentsRepository;

    // constructor(repository: AppointmentsRepository) {
    //     this.repository = repository;
    // }

    public async execute({
        date,
        provider_id,
    }: RequestDTO): Promise<Appointment> {
        const appointmentRepository = getCustomRepository(
            AppointmentsRepository,
        );

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('Este horário já foi agendado.');
        }

        const appointment = appointmentRepository.create({
            provider_id,
            date: appointmentDate,
        });

        // Comitando as mudanças para o banco
        await appointmentRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
