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
          sha: "42cf82a3950948fd0628e7faac3f3ff3ceeb835d",
          message: "Fix build",
          author: "Hacksore",
        },
        id: "2247433475",
        status: "queued",
        branch: "masster",
        createdAt: 1651518315,
        fullName: "Hacksore/test",
        org: "Hacksore",
        repo: "test",
        url: "https://github.com/Hacksore/test/actions/runs/2247433475",
        user: {
          sender: "Hacksore",
          avatarUrl: "https://avatars.githubusercontent.com/u/996134?v=4",
        },
      },
      {
        commit: {
          sha: "42cf82a3950948fd0628e7faac3f3ff3c123",
          message: "Fix build",
          author: "Hacksore",
        },
        id: "2247433475",
        status: "completed",
        branch: "masster",
        createdAt: 1651518315,
        fullName: "Hacksore/test",
        org: "Hacksore",
        repo: "test",
        url: "https://github.com/Hacksore/test/actions/runs/2247433475",
        user: {
          sender: "Hacksore",
          avatarUrl: "https://avatars.githubusercontent.com/u/996134?v=4",
        },
      },
      {
        commit: {
          sha: "42cf82a3950948fd0628e7faac3f3565eb835d",
          message: "Break build",
          author: "Hacksore",
        },
        id: "2247433475",
        status: "failed",
        branch: "masster",
        createdAt: 1651518315,
        fullName: "Hacksore/bluelink",
        org: "Hacksore",
        repo: "test",
        url: "https://github.com/Hacksore/test/actions/runs/2247433475",
        user: {
          sender: "Hacksore",
          avatarUrl: "https://avatars.githubusercontent.com/u/996134?v=4",
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

