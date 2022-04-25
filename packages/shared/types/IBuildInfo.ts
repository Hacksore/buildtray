interface IBuildInfo {
  commit: {
    sha: string;
    message: string;
    author: string;
  };
  id: string;
  state: string;
  status: "queued" | "failure" | "completed";
  branch: string;
  createdAt: number;
  fullName: string;
  org: string;
  repo: string;
  url: string;
  user: {
    sender: string;
    avatarUrl: string;
  };
}

export default IBuildInfo;
