import EventEmitter from "eventemitter3";
import { router } from "expo-router";

class MessagingSystem extends EventEmitter {
  constructor() {
    super();
    this.on("unauthorized", this.handleUnauthorized);
  }

  handleUnauthorized = () => {
    router.replace("/login"); // Redirect to login page
  };

  emitUnauthorized() {
    console.log("Emitting unauthorized event");
    this.emit("unauthorized");
  }
}

const messagingSystem = new MessagingSystem();
export default messagingSystem;
