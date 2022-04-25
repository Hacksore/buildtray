import {
  ref,
  onValue,
  onChildChanged,
  DataSnapshot,
  onChildAdded,
  query,
  limitToLast,
  orderByChild,
  startAt,
  startAfter,
  serverTimestamp,
} from "firebase/database";
import { EventEmitter } from "events";
import { database } from "../main";

import { encodeRepo } from "shared/utils/naming";
declare interface FirebaseService {
  on(event: "build", listener: (data: any) => void): this;
}

class FirebaseService extends EventEmitter {
  /**
   * Subscribe to something like repos/<entity>/<repo>
   * and push an data on the emit for repoSnapshot
   * @param fullName An org/repo name that exists in the databse
   */
  subscribeToRepo(fullName: string) {
    const buildPath = `repos/${encodeRepo(fullName)}/builds`;
    const localRef = ref(database, buildPath);
    console.log("subscribing to changes for", buildPath);

    const time = Math.floor(+new Date() / 1000);
    const updatedRepo = query(localRef, orderByChild("createdAt"), startAfter(time), limitToLast(1));

    // when a build is added, emit the build
    onChildAdded(updatedRepo, (snapshot: DataSnapshot) => {
      this.emit("build", {
        ...snapshot.val(),
        fullName,
      });
    });

    // when a build is changed, emit the updated build
    onChildChanged(updatedRepo, (snapshot: DataSnapshot) => {
      this.emit("build", {
        ...snapshot.val(),
        fullName,
      });
    });
  }

  /**
   * Sorta don't know if this makes full sense to be a "service"
   * @param fullName An org/repo name that exists in the databse
   * @returns Promise<any[]>
   */
  getMostRecentBuilds(fullName: string) {
    return new Promise((resolve, reject) => {
      const buildPath = `repos/${encodeRepo(fullName)}/builds`;
      const localRef = ref(database, buildPath);
      const updatedRepo = query(localRef, orderByChild("createdAt"), limitToLast(10));

      onValue(updatedRepo, (snapshot: DataSnapshot) => {
        const val = snapshot.val();

        if (!val) {
          return resolve([]);
        }

        const fixed = Object.entries(val).map(([k, v]: [string, any]) => ({
          id: k,
          fullName,
          ...v,
        }));

        resolve(fixed);
      });
    });
  }
}

export default new FirebaseService();
