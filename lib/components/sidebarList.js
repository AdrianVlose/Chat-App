export class SidebarList {
  constructor(chatListElement) {
    this.chatListElement = chatListElement;
  }

  renderChatList(chats) {
    chats.forEach((chat) => {
      const chatElement = this.createChatElementForList(chat);
      this.chatListElement.insertAdjacentHTML('beforeend', chatElement);
    });
  }

  createChatElementForList(chat) {
    const theme = !chat.isLastMessageRead ? 'unread' : 'read';

    return `
        <div id=${chat.id} class="user-chat ${theme}">
            <h2>${chat.group}</h2>
            <h4>${chat.lastMessage}</h4>
        </div>
    `;
  }

  renderChatListForIncomingMessage(lastMessage, conversationID, currentChatID) {
    const isMessageRead = conversationID === currentChatID ? 'read' : 'unread';
    const chatFromSidebarElement = document.getElementById(conversationID);

    if (chatFromSidebarElement.classList.contains('read')) {
      chatFromSidebarElement.classList.remove('read');
    } else {
      chatFromSidebarElement.classList.remove('unread');
    }

    chatFromSidebarElement.classList.add(isMessageRead);

    const lastMessageElement = document.querySelector(`#${conversationID} h4`);
    lastMessageElement.textContent = lastMessage;
  }
}
