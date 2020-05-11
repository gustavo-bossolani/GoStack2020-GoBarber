import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

interface RequestDTO {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class CreateSessionService {
    public async execute({ email, password }: RequestDTO): Promise<Response> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new AppError('Email ou senha inválidos.', 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Email ou senha inválidos.', 401);
        }

        delete user.password;

        /**
         * O primeiro parâmetro é o payload
         * dentro do payload são armazenadas informações que são
         * facilmente descriptografadas, geralmente usamos o payload
         * para salvar informações que iremos usar no front-end.
         *
         * segundo parâmetro é a palavra usada para descriptografar o JWT.
         *
         * segredo usado: gostack_gobarber.
         *
         * O terceiro parâmetro são configuraões do próprio token.
         */
        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id, // Sempre será o ID do usuário
            expiresIn, // Tempo de expiração do token
        });

        return { user, token };
    }
}

export default CreateSessionService;
