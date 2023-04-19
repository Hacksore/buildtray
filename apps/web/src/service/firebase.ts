import {
  ref,
  onValue,
  onChildChanged,
  DataSnapshot,
  onChildAdded,
  query,
  limitToLast,
  orderByChild,
  startAfter,
} from "firebase/database";
import { EventEmitter } from "events";
import { database } from "../firebase";

import { encodeRepo } from "shared/utils/naming";
import IBuildInfo from "shared/types/IBuildInfo";
declare interface FirebaseService {
  on(event: "build", listener: (data: IBuildInfo) => void): this;
}

class FirebaseService extends EventEmitter {
  public listeners: any = [];

  /**
   * Subscribe to something like repos/<entity>/<repo>
   * and push an data on the emit for repoSnapshot
   * @param fullName An org/repo name that exists in the databse
   */
  subscribeToRepo(fullName: string) {
    const buildPath = `repos/${encodeRepo(fullName)}/builds`;
    const localRef = ref(database, buildPath);

    const time = Math.floor(+new Date() / 1000);
    const updatedRepo = query(localRef, orderByChild("createdAt"), startAfter(time), limitToLast(1));

    // find by run id
    // TODO: might be useful later on
    // const findBuildBuildId = query(localRef, orderByChild("id"), equalTo(2223461950), limitToLast(1));

    // when a build is added, emit the build
    const onChildAddedListener = onChildAdded(updatedRepo, (snapshot: DataSnapshot) => {
      this.emit("build", {
        ...snapshot.val(),
        fullName,
      });
    });

    // when a build is changed, emit the updated build
    const onChildChangedListener = onChildChanged(localRef, (snapshot: DataSnapshot) => {
      this.emit("build", {
        ...snapshot.val(),
        fullName,
      });
    });

    this.listeners.push(onChildAddedListener);
    this.listeners.push(onChildChangedListener);
  }

  /**
   * Sorta don't know if this makes full sense to be a "service"
   * @param fullName An org/repo name that exists in the databse
   * @returns Promise<any[]>
   */
  getMostRecentBuilds(fullName: string): Promise<IBuildInfo[]> {
    return new Promise(resolve => {
      const buildPath = `repos/${encodeRepo(fullName)}/builds`;
      const localRef = ref(database, buildPath);
      const updatedRepo = query(localRef, orderByChild("createdAt"), limitToLast(5));

      const listener = onValue(updatedRepo, (snapshot: DataSnapshot) => {
        const val = snapshot.val();

        if (!val) {
          return resolve([]);
        }

        const fixed = Object.entries(val).map(([k, v]: [string, unknown]) => ({
          id: k,
          fullName,
          ...(v as Record<string, unknown>),
        }));

        resolve(fixed.reverse() as IBuildInfo[]);
      });

      this.listeners.push(listener);
    });
  }

  clearAllListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
    // reset all listers list
    this.listeners = [];
  }
}

export default new FirebaseService();
