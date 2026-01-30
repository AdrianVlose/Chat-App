import { MessageHandler } from './messageHandler.js';
export class ServerConnection extends MessageHandler {
  constructor() {
    super();
    this.socket = new WebSocket('ws://localhost:3000');
  }

  sendMessageViaSocket(conversationID, username, content) {
    const message = this.messageFormatter(conversationID, username, content);
    const messageFormatted =
      typeof message === 'object' ? JSON.stringify(message) : message;
    this.socket.send(messageFormatted);
  }
}
