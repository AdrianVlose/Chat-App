export class MessageHandler {
  constructor() {
    this.id = 100;
  }

  messageFormatter(conversationID, username, content) {
    const message = {
      id: `msg_${this.id}`,
      content,
      sender: username,
    };
    this.id++;
    return {
      conversationID,
      message,
    };
  }
}
