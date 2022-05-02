import { EventEmitter } from "events";
import IBuildInfo from "shared/types/IBuildInfo";

declare interface FirebaseService {
  on(event: "build", listener: (data: IBuildInfo) => void): this;
}

class FirebaseService extends EventEmitter {
  constructor() {
    super();
    console.log("loadded firebase mock");
  }

  subscribeToRepo(fullName: string) {
    // do nothing
    console.log("Mocked subscribeToRepo", fullName);
  }

  getMostRecentBuilds(fullName: string): Promise<IBuildInfo[]> {
    console.log("Mocked getMostRecentBuilds", fullName);

    return Promise.resolve([
      {
        commit: {
          sha: "test",
          message: "test",
          author: "test",
        },
        id: "test",
        status: "queued",
        branch: "test",
        createdAt: 123,
        fullName: "test",
        org: "test",
        repo: "test",
        url: "test",
        user: {
          sender: "test",
          avatarUrl: "test",
        },
      },
    ] as IBuildInfo[]);
  }

  clearAllListeners(): void {
    // do nothing
  }
}

export default new FirebaseService();

export function firebaseDecorator(story: any, { parameters }: { parameters: any }) {

  return story();
}
