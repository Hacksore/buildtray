import { ref, onValue } from "firebase/database";
import { EventEmitter } from "stream";

declare interface FirebaseService {
  on(event: 'hello', listener: (name: string) => void): this;
}

class FirebaseService extends EventEmitter {

  /**
   * Subscribe to something like repos/<entity>/<repo>
   * and push an data on the emit for repoSnapshot
   * @param {string} path 
   */
  subscribeRepo(path) {
    const localRef = ref(path);
    onValue(localRef, (snapshot) => {
      this.emit("repoSnapshot", snapshot.val());
    });
  }
  
}

export default new FirebaseService();