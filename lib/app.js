import { UI } from './ui.js';

export const App = () => {
  const chatListElement = document.querySelector('#chats');
  const chatElement = document.querySelector('#chat');
  const inputFieldElement = document.querySelector('#message-field');
  const buttonElement = document.querySelector('#send-button');
  const nameFieldElement = document.querySelector('#name-field');
  const iconForUpdateNameElement = document.querySelector('#save-icon');

  const ui = new UI(
    chatListElement,
    chatElement,
    inputFieldElement,
    buttonElement,
    nameFieldElement,
    iconForUpdateNameElement,
  );

  ui.initializeApplication();
  console.log;
};
