import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDto from '../dtos/ICreateUserDto';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDto): Promise<User>;
  save(user: User): Promise<User>;
  findAllProviders(data: IFindAllProvidersDTO): Promise<Array<User>>;
}
