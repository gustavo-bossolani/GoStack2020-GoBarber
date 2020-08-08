import { getRepository, Repository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDto from '@modules/users/dtos/ICreateUserDto';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async create(userData: ICreateUserDto): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findAllProviders({
    exceptedUserId,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (exceptedUserId) {
      users = await this.ormRepository.find({
        where: {
          id: Not(exceptedUserId),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }
}

export default UsersRepository;
