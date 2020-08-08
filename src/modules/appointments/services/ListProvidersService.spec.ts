import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

describe('ListProvidersService', () => {
  let fakeUserRepository: FakeUsersRepository;
  let listProvidersService: ListProvidersService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();

    listProvidersService = new ListProvidersService(fakeUserRepository);
  });

  it('should be able to list the providers', async () => {
    const loggedUser = await fakeUserRepository.create({
      name: 'Gustavo - Usuário Logado',
      email: 'gustavo@email.com',
      password: '123456',
    });

    const provider01 = await fakeUserRepository.create({
      name: 'Provider 1',
      email: 'provider_01@email.com',
      password: '123456',
    });

    const provider02 = await fakeUserRepository.create({
      name: 'Provider 2',
      email: 'provider_02@email.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([provider01, provider02]);
  });
});
