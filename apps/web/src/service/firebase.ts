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

    const time = Math.floor(+new Date()/1000);
    console.log("Starting search from timestamp", time);
    const updatedRepo = query(localRef, orderByChild("createdAt"), startAfter(time), limitToLast(1));

    onChildAdded(updatedRepo, (snapshot: DataSnapshot) => {
      this.emit("build", snapshot.val());
      console.log("add");
    });

    onChildChanged(updatedRepo, (snapshot: DataSnapshot) => {
      this.emit("build", snapshot.val());
      console.log("Change")
    });
  }
}

export default new FirebaseService();
