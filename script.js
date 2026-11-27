// L'Oréal Chatbot script.js - Connected to Cloudflare Worker

document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');

  // Your deployed Cloudflare Worker endpoint URL
  const WORKER_URL = 'https://gentle-hill-2b63.floidsillano7.workers.dev/';

  // Initial system prompt to keep your chatbot focused on L'Oréal products and beauty advice
  let messages = [
    {
      role: 'system',
      content: 'You are a helpful and polite assistant for L’Oréal. You only answer questions related to L’Oréal products, makeup, skincare, haircare, fragrances, routines, and recommendations. Politely refuse any questions unrelated to L’Oréal or beauty topics.'
    }
  ];

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const promptText = userInput.value.trim();
    if (!promptText) return;

    // Append user message to history and UI
    messages.push({ role: 'user', content: promptText });
    appendMessage('User', promptText);
    userInput.value = '';

    try {
      // Send request to your Cloudflare Worker proxy instead of OpenAI directly
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: messages })
      });

      const data = await response.json();
      
      // Extract the assistant's reply from OpenAI's response structure returned by the worker
      const botReply = data.choices && data.choices[0] && data.choices[0].message 
        ? data.choices[0].message.content 
        : 'Sorry, I am having trouble connecting right now.';

      messages.push({ role: 'assistant', content: botReply });
      appendMessage('L\'Oréal Assistant', botReply);

    } catch (error) {
      console.error('Error fetching response:', error);
      appendMessage('System', 'Error: Unable to connect to the chatbot service.');
    }
  });

  function appendMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});