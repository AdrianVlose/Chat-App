const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const PORT = '3000';
const HOSTNAME = 'localhost';

const app = express();

app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let subscribers = [];

wss.on('connection', (user) => {
  subscribers.push(user);
  const userIndexOnConnection = subscribers.indexOf(user);
  console.log('User connected with index:', userIndexOnConnection);

  user.on('message', (message) => {
    console.log('Received:', message.toString());
    const returnMessage = incomingMessageHandler(message.toString());
    const encodedMessage = JSON.stringify(returnMessage);
    sendBroadcast(encodedMessage);
  });

  user.on('close', () => {
    const userIndexOnClose = subscribers.indexOf(user);
    if (userIndexOnClose !== -1) {
      subscribers.splice(userIndexOnClose, 1);
    }

    console.log('User disconnected with index:', userIndexOnClose);
  });

  user.on('error', (err) => {
    console.error('WebSocket error', err.message);
  });
});
server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

function incomingMessageHandler(message) {
  const messageDecoded = JSON.parse(message);

  return {
    type: 'Received',
    conversation: messageDecoded.conversationID,
    message: messageDecoded.message,
  };
}

function sendBroadcast(encodedMessage) {
  subscribers.forEach((subscriber) => subscriber.send(encodedMessage));
}
