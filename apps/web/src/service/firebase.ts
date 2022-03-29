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

declare interface FirebaseService {
  on(event: "build", listener: (data: any) => void): this;
}

class FirebaseService extends EventEmitter {
  /**
   * Subscribe to something like repos/<entity>/<repo>
   * and push an data on the emit for repoSnapshot
   * @param {string} path
   */
  subscribeRepo(path: string) {
    const buildPath = `repos/${path}/builds`;
    const localRef = ref(database, buildPath);
    console.log("subscribing to changes for", buildPath);

    const time = Math.floor(+new Date() / 1000);
    const updatedRepo = query(localRef, orderByChild("createdAt"), startAfter(time), limitToLast(1));

    onChildAdded(updatedRepo, (snapshot: DataSnapshot) => {
      this.emit("build", {
        ...snapshot.val(),
        fullName: path,
      });
    });

    onChildChanged(updatedRepo, (snapshot: DataSnapshot) => {
      this.emit("build", {
        ...snapshot.val(),
        fullName: path,
      });
    });
  }

  /**
   * Sorta don't know if this makes full sense to be a "service"
   * @param path a path to the item in the database
   * @returns Promise<any[]>
   */
  getMostRecentBuilds(path: string) {
    return new Promise((resolve, reject) => {
      const buildPath = `repos/${path}/builds`;
      const localRef = ref(database, buildPath);
      const updatedRepo = query(localRef, orderByChild("createdAt"), limitToLast(10));

      onValue(updatedRepo, (snapshot: DataSnapshot) => {
        const val = snapshot.val();

        if (!val) {
          return resolve([]);
        }

        const fixed = Object.entries(val).map(([k, v]: [string, any]) => ({
          id: k,
          fullName: path,
          ...v,
        }));

        resolve(fixed);
      });
    });
  }
}

export default new FirebaseService();