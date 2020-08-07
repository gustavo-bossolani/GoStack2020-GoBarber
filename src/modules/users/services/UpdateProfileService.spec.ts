import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

describe('UpdateProfile', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let updateProfileService: UpdateProfileService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-user-id',
        name: 'Gustavo',
        email: 'gustavo@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a user profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Gustavo Bossolani',
      email: 'gustavo.bossolani@email.com',
    });

    expect(updatedUser.id).toBeTruthy();
    expect(updatedUser.name).toBe('Gustavo Bossolani');
    expect(updatedUser.email).toBe('gustavo.bossolani@email.com');
  });

  it('should not be able to change to another user email', async () => {
    const user = await fakeUserRepository.create({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    await fakeUserRepository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Gustavo Bossolani',
        email: 'teste@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Gustavo Bossolani',
      email: 'gustavo.bossolani@email.com',
      old_password: '123456',
      password: '123-123',
    });

    expect(updatedUser.password).toBe('123-123');
  });

  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Gustavo Bossolani',
        email: 'gustavo.bossolani@email.com',
        password: '123-123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Gustavo Bossolani',
        email: 'gustavo.bossolani@email.com',
        old_password: 'wrong-old-password',
        password: '123-123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
