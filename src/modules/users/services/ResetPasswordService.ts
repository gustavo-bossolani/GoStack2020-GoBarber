import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

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

    user.password = password;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordServie;
