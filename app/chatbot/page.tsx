'use client'; // 👈 **CRITICAL:** This makes it a Client Component

import { useState, useCallback, useRef, useEffect } from 'react';

// Define the structure for your chat messages
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'soulcare';
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi, I'm SoulCare 💜 I'm here for you. How are you feeling today?", sender: 'soulcare' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for auto-scrolling the chat window
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    // 🛑 Prevent sending empty messages or while loading
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    const newUserMessage: Message = { id: Date.now(), text: userMessage, sender: 'user' };

    // 1. Add user message to state and clear input
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 2. **CRITICAL STEP: Making the POST request**
      // The relative path '/api/chat' correctly targets your backend route.
      const response = await fetch('/api/chat', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        // If the server returns a 500 status (your backend error), throw an error
        throw new Error(`Chat API failed with status ${response.status}`);
      }

      // 3. Parse the JSON response
      const data = await response.json();
      const soulcareReply = data.reply || "I didn't get a clear response, but I'm still here.";

      // 4. Add the SoulCare reply to state
      const soulcareMessage: Message = { id: Date.now() + 1, text: soulcareReply, sender: 'soulcare' };
      setMessages(prev => [...prev, soulcareMessage]);

    } catch (error) {
      console.error('Frontend Fetch Error:', error);
      // Display a fail message to the user
      const failMessage: Message = { 
        id: Date.now() + 1, 
        text: "I'm sorry, I'm having trouble connecting right now. Please check the server logs.", 
        sender: 'soulcare' 
      };
      setMessages(prev => [...prev, failMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>SoulCare 💜 Companion</h1>
      
      {/* Message List */}
      <div style={styles.messageList}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={msg.sender === 'user' ? styles.userMessage : styles.soulcareMessage}
          >
            {msg.text}
          </div>
        ))}
        {/* Loading Indicator */}
        {isLoading && <div style={styles.loading}>SoulCare is thinking...</div>}
        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isLoading ? "Please wait..." : "To me... I'm listening 💜"}
          disabled={isLoading}
          style={styles.input}
        />
        <button onClick={sendMessage} disabled={isLoading} style={styles.button}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

// Basic inline styles for a functional chat interface
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#6a0dad', // Purple tone
  },
  messageList: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '10px',
    borderBottom: '1px solid #eee',
    marginBottom: '10px',
  },
  userMessage: {
    textAlign: 'right',
    backgroundColor: '#dcebff',
    borderRadius: '15px 15px 0 15px',
    padding: '8px 12px',
    margin: '8px 0',
    marginLeft: 'auto',
    maxWidth: '80%',
    color: '#000',
  },
  soulcareMessage: {
    textAlign: 'left',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px 15px 15px 0',
    padding: '8px 12px',
    margin: '8px 0',
    marginRight: 'auto',
    maxWidth: '80%',
    color: '#000',
  },
  loading: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    padding: '5px 0',
  },
  inputArea: {
    display: 'flex',
    paddingTop: '10px',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    marginRight: '10px',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    backgroundColor: '#6a0dad',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};
