import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHasProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHasProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('Usuário não encontrado');

    const userWithThisEmail = await this.usersRepository.findByEmail(email);

    if (userWithThisEmail && userWithThisEmail.id !== user_id)
      throw new AppError('E-mail já está sendo usado.');

    Object.assign(user, {
      name,
      email,
    });

    if (password && !old_password)
      throw new AppError(
        'Você precisa informar a senha antiga para criar uma nova.',
      );

    if (password && old_password) {
      // Comparando se a senha antiga está correta
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword)
        throw new AppError('Senha antiga não está correta.');

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}
export default UpdateProfileService;
