import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

describe('CreateUserSession', () => {
  it('should be able to create a new session', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const createSession = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const createdUser = await createUser.execute({
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
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createSession = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );

    expect(
      createSession.execute({
        email: 'gustavo@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new session with wrong password', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const createSession = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    expect(
      createSession.execute({
        email: 'gustavo@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
