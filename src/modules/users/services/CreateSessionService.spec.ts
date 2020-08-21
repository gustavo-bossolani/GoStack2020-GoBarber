import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateSessionService from './CreateSessionService';

describe('CreateUserSession', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let createSession: CreateSessionService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createSession = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new session', async () => {
    const createdUser = await fakeUserRepository.create({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    const response = await createSession.execute({
      email: 'gustavo@email.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(createdUser);
  });

  it('should not be able to create a new session with non existing user', async () => {
    await expect(
      createSession.execute({
        email: 'gustavo@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new session with wrong password', async () => {
    await fakeUserRepository.create({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    await expect(
      createSession.execute({
        email: 'gustavo@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
