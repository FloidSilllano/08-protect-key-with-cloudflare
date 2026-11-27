document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");

  // Keep track of message history if your project requires context
  const messages = [
    {
      role: "system",
      content: "You are a helpful and knowledgeable L'Oréal Beauty Advisor. Only answer questions related to L'Oréal products, skincare, haircare, makeup, and beauty routines. Politely decline any off-topic questions."
    }
  ];

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stops the page from reloading and adding '?' to the URL

    const text = userInput.value.trim();
    if (!text) return;

    // Append user message to UI
    appendMessage("You", text);
    messages.push({ role: "user", content: text });
    userInput.value = "";

    try {
      // Send request to your Cloudflare Worker proxy
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: messages })
      });

      const data = await response.json();

      // Extract assistant reply from OpenAI's response structure returned by worker
      const botReply = data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : "Sorry, I am having trouble connecting right now.";

      messages.push({ role: "assistant", content: botReply });
      appendMessage("L'Oréal Assistant", botReply);
    } catch (error) {
      console.error("Error fetching response:", error);
      appendMessage("System", "Error: Unable to connect to the chatbot service.");
    }
  });

  function appendMessage(sender, text) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});