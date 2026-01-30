const HISTORY_CHAT_KEY = 'List_With_Chats_History_v1';

export class ChatState {
  constructor() {
    this.data = [];
  }

  initializeData() {
    const savedData = localStorage.getItem(HISTORY_CHAT_KEY);

    this.data = JSON.parse(savedData);
  }

  addMessageToChatList(receivedMessage) {
    this.data = this.data.map((conversation) => {
      if (conversation.conversationId === receivedMessage.conversation) {
        conversation.messages.unshift(receivedMessage.message);
      }
      return conversation;
    });
    this.updateLocalStorageField();
  }

  updateLocalStorageField() {
    localStorage.setItem(HISTORY_CHAT_KEY, JSON.stringify(this.data));
  }

  parseInformationForSidebar() {
    const sidebarList = this.data.map((user) => {
      const id = user.conversationId;
      const group = user.group;
      const lastMessage =
        user.messages.length > 0
          ? user.messages?.at(-1).content
          : 'This conversation is empty.';

      return {
        id,
        group,
        lastMessage,
        isLastMessageRead: true,
      };
    });

    return sidebarList;
  }

  parseConversationByID(conversationID) {
    const conversation = this.data.filter(
      (chat) => chat.conversationId === conversationID,
    );
    const messagesList = conversation?.at(0)?.messages || [];
    const parsedMessages = messagesList.map((message) => {
      return {
        id: message.id,
        content: message.content,
        sender: message.sender,
      };
    });

    return parsedMessages;
  }
}
