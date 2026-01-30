export class ChatConversation {
  constructor(conversationElement) {
    this.conversationElement = conversationElement;
  }

  renderConversation(messages, username) {
    this.conversationElement.innerHTML = '';
    messages.forEach((message) => {
      const messageElement = this.renderMessage(message, username);
      this.conversationElement.insertAdjacentHTML('beforeend', messageElement);
    });
  }

  renderMessage(message, username) {
    const side = message.sender === username ? 'right' : 'left';

    return `
        <div id="${message.id}" class="message ${side}">
            <div class="text-wrapper ${side}">
                <h2>${message.sender}</h2>
                <h4>${message.content}</h4>
            </div>
        </div>
    `;
  }
}
