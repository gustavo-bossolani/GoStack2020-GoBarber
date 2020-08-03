import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokensRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

// import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordServie {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('O Token de usuário não existe.');
    }
    const user = await this.usersRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppError('Usuário não existe.');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    // Verificando se já passou 2 horas
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token inspirado.');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordServie;
