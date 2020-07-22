import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, password }: IRequestDTO): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email ou senha inválidos.', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Email ou senha inválidos.', 401);
    }

    // delete user.password; exemplo de deleção de atributo de um obj TS

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
