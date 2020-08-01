import { uuid } from 'uuidv4';

import IUserTokenRepository from '../IUserTokenRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class FakeUserRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findedToken => findedToken.token === token,
    );

    return userToken;
  }
}

export default FakeUserRepository;
