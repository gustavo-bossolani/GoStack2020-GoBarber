import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

describe('ResetPasswordService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeUserTokenRepository: FakeUserTokenRepository;
  let fakeHashProvider: FakeHashProvider;
  let resetPasswordService: ResetPasswordService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'gustavo@email.com',
      name: 'Gustavo',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123');
    expect(updatedUser?.password).toBe('123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate(
      'non-existing-user-id',
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if past more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      email: 'gustavo@email.com',
      name: 'Gustavo',
      password: '123456',
    });

    // Estamos gerando o token neste momento
    const { token } = await fakeUserTokenRepository.generate(user.id);

    // Criando um mock com o valor de 2h no 'futuro'
    // Os métodos de mock só são monitorados após a criação do mesmo
    // mockImplementationOnce: a função custom é executada apenas uma vez
    // mockImplementation: a função custom é executada sempre dentro do contexto de teste
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      // Vamos sempre estar 1 hora na frente da hora de inspiração do token
      return customDate.setDate(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // TODO
  // Hash                   - Done
  // 2h de expiração        - Done
  // user token inexistente - Done
  // user inexistente       - Done
});
