import { ServerConnection } from './socket/serverConnection.js';
import { ChatState } from './utils/chatState.js';
import { SidebarList } from './components/sidebarList.js';
import { ChatConversation } from './components/chatConversation.js';

export class UI {
  constructor(
    chatListElement,
    chatElement,
    inputFieldElement,
    buttonElement,
    nameFieldElement,
    iconForUpdateNameElement,
  ) {
    this.conversationUI = new ChatConversation(chatElement);
    this.chatListUI = new SidebarList(chatListElement);
    this.chatState = new ChatState();
    this.serverConnection = new ServerConnection();
    this.currentChatID = -1;
    this.username = 'Anonymous';
    this.inputFieldElement = inputFieldElement;
    this.buttonElement = buttonElement;
    this.nameFieldElement = nameFieldElement;
    this.iconForUpdateNameElement = iconForUpdateNameElement;
    this.isSocketOpen = false;
  }

  initializeApplication() {
    this.chatState.initializeData();
    this.bindListeners();
    this.initializeSidebar();
    this.bindEvents();
  }

  initializeSidebar() {
    const chatList = this.chatState.parseInformationForSidebar();
    this.chatListUI.renderChatList(chatList);
  }

  bindEvents() {
    const sidebarChats = document.querySelectorAll('.user-chat');

    sidebarChats.forEach((chat) => {
      const nextActiveChatID = chat.id;

      chat.addEventListener('click', () => {
        this.clickChatFromSidebarHandler(chat, nextActiveChatID);
        const messages = this.chatState.parseConversationByID(nextActiveChatID);
        this.conversationUI.renderConversation(messages, this.username);
      });
    });

    this.buttonElement.addEventListener('click', this.sendMessage.bind(this));
    this.iconForUpdateNameElement.addEventListener(
      'click',
      this.updateName.bind(this),
    );
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  bindListeners() {
    this.serverConnection.socket.onopen = this.messageHandler.bind(this);
    this.serverConnection.socket.onerror = this.messageHandler.bind(this);
    this.serverConnection.socket.onclose = this.messageHandler.bind(this);
    this.serverConnection.socket.onmessage = this.receiveMessage.bind(this);
  }

  clickChatFromSidebarHandler(chatElement, nextActiveChatID) {
    if (this.currentChatID !== -1) {
      const lastActiveChatElement = document.getElementById(this.currentChatID);
      lastActiveChatElement.classList.remove('active');
    }

    if (!chatElement.classList.contains('active')) {
      chatElement.classList.add('active');
      this.currentChatID = nextActiveChatID;
    }
    this.inputFieldElement.disabled = false;
    this.buttonElement.disabled = false;
    if (chatElement.classList.contains('unread')) {
      chatElement.classList.remove('unread');
    }
  }

  updateName() {
    const name = this.nameFieldElement.value;
    this.username = name;
    this.iconForUpdateNameElement.disabled = true;
    this.nameFieldElement.disabled = true;
  }

  messageHandler(event) {
    console.log(event);
    if (event.type === 'open') {
      this.isSocketOpen = true;
    }
    if (event.type === 'close') {
      this.isSocketOpen = false;
    }
  }

  receiveMessage(event) {
    const data = JSON.parse(event.data);
    this.chatState.addMessageToChatList(data);

    const lastMessage = data?.message?.content || 'Empty message';
    const conversationID = data?.conversation || '';
    this.chatListUI.renderChatListForIncomingMessage(
      lastMessage,
      conversationID,
      this.currentChatID,
    );

    if (conversationID === this.currentChatID) {
      const messages = this.chatState.parseConversationByID(conversationID);
      this.conversationUI.renderConversation(messages, this.username);
    }
  }

  sendMessage() {
    const value = this.inputFieldElement.value;
    if (this.isSocketOpen) {
      this.serverConnection.sendMessageViaSocket(
        this.currentChatID,
        this.username,
        value,
      );
    }

    console.log(this.username);
    this.inputFieldElement.value = '';
  }
}
