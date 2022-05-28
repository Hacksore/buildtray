interface IBuildInfo {
  commit: {
    sha: string;
    message: string;
    author: string;
  };
  /**
   * workflow run id
   */
  id: string;
  /**
   * state of the job (e.g. 'queued', 'failure', 'completed')
   */
  status: "queued" | "failure" | "completed";
  /**
   * result state of the build (e.g. 'failure', 'success')
   */
  conclusion: "failure" | "success";
  /**
   * branch name the build ran on
   */
  branch: string;
  /**
   * unix timestamp of when the build was queued
   */
  createdAt: number;
  /**
   * full name of the entity/repo, (e.g. hacksore/test)
   */
  fullName: string;
  org: string;
  repo: string;
  /**
   * url that takes you to the build in github
   */
  url: string;
  user: {
    sender: string;
    avatarUrl: string;
  };
}

export default IBuildInfo;
