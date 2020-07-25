import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeRepository);

    const user = await createUserService.execute({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeRepository);

    await createUserService.execute({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    expect(
      createUserService.execute({
        name: 'Gustavo',
        email: 'gustavo@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
