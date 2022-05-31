/**
 * This is the interfact for installed repo to the global table
 */
interface IAppRepo {
  [entity: string]: {
    [repo: string]: {
      metadata: {
        fullName: string;
        private: false;
      };
    };
  };
}


export default IAppRepo;