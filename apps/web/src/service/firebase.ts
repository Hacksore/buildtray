import {
  ref,
  onValue,
  onChildChanged,
  DataSnapshot,
  onChildAdded,
  equalTo,
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
import IBuildInfo from "shared/types/IBuildInfo";
declare interface FirebaseService {
  on(event: "build", listener: (data: any) => void): this;
}

class FirebaseService extends EventEmitter {

  public _l: any[] = [];

  /**
   * Subscribe to something like repos/<entity>/<repo>
   * and push an data on the emit for repoSnapshot
   * @param fullName An org/repo name that exists in the databse
   */
  subscribeToRepo(fullName: string) {
    const buildPath = `repos/${encodeRepo(fullName)}/builds`;
    const localRef = ref(database, buildPath);
    console.log("subscribing to changes for", encodeRepo(fullName));

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

    this._l.push(onChildAddedListener);
    this._l.push(onChildChangedListener);
  }

  /**
   * Sorta don't know if this makes full sense to be a "service"
   * @param fullName An org/repo name that exists in the databse
   * @returns Promise<any[]>
   */
  getMostRecentBuilds(fullName: string): Promise<IBuildInfo[]> {
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

        resolve(fixed.reverse());
      });
    });
  }
}

export default new FirebaseService();
