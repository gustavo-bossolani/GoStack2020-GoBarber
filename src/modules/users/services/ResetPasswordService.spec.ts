// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

describe('ResetPasswordService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeUserTokenRepository: FakeUserTokenRepository;
  let resetPasswordService: ResetPasswordService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
    );
  });

  it('should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'gustavo@email.com',
      name: 'Gustavo',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    await resetPasswordService.execute({
      password: '123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);
    expect(updatedUser?.password).toBe('123');
  });

  // TODO
  // Hash
  // 2h de expiração
  // user token inexistente
  // user inexistente
});
