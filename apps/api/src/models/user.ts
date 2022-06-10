import { Collection, SubCollection, ISubCollection, getRepository } from 'fireorm';

class UserRepos {
  id: string;
}

@Collection()
export class User {
  id: string;
  test: string;
  
  @SubCollection(User)
  repos?: ISubCollection<UserRepos>;
}

export const userRepository = getRepository(User);
