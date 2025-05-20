import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(querySnapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Emotionally engaging AI responses
  const responses = {
    greeting: [
      "Hi there! 😊 So glad to hear from you.",
      "Hello! Hope your day is as amazing as you are!",
      "Hey hey! What's on your heart today?",
    ],
    howareyou: [
      "I'm doing great, thanks for asking! How about you? 💛",
      "I'm just a bunch of code, but I'm feeling pretty good! 😄",
      "I'm always here and happy to chat with you! 💬",
    ],
    help: [
      "Of course! What do you need help with, friend? 🤗",
      "I'm here to support you, just let me know what's on your mind.",
      "Absolutely! Let's figure it out together. 💪",
    ],
    goodbye: [
      "Take care! You matter. 💖",
      "Goodbye for now! Can't wait to talk again. 😊",
      "Wishing you peace and happiness until next time! 🌈",
    ],
    default: [
      "That's really interesting! Tell me more. 🧠",
      "I'm here and listening—what's on your mind? 👂",
      "Let’s explore that together! 🤔",
      "I love that you're sharing with me. Keep going! 💬",
    ],
  };

  const getResponseCategory = (input) => {
    const lower = input.toLowerCase();
    if (["hi", "hello", "hey"].some(word => lower.includes(word))) return "greeting";
    if (["how are you", "how r u", "how you doing"].some(phrase => lower.includes(phrase))) return "howareyou";
    if (["help", "assist", "support", "need help"].some(word => lower.includes(word))) return "help";
    if (["bye", "goodbye", "see you", "later"].some(word => lower.includes(word))) return "goodbye";
    return "default";
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    const category = getResponseCategory(userInput);
    const aiResponse = responses[category][Math.floor(Math.random() * responses[category].length)];

    await addDoc(collection(db, "messages"), {
      text: userInput,
      user: "you@example.com",
      photoURL: "user.jpg",
      timestamp: serverTimestamp(),
      from: "user",
    });

    setTimeout(async () => {
      await addDoc(collection(db, "messages"), {
        text: aiResponse,
        user: "Chatterly AI",
        photoURL: "avatar-logo.png",
        timestamp: serverTimestamp(),
        from: "system",
      });
    }, 800);

    setInput("");
  };

  // 🧪 Seed messages (100 random user + AI message pairs)
  const seedMessages = async (count = 100) => {
    const userInputs = [
      "Hi", "Hello", "Hey there!", "How are you?",
      "Can you help me?", "I need support", "Goodbye", "Thanks",
      "Tell me something nice", "What's your name?",
      "What can you do?", "How's your day?", "Are you real?",
      "I'm feeling down", "You're amazing", "I appreciate you"
    ];

    for (let i = 0; i < count; i++) {
      const input = userInputs[Math.floor(Math.random() * userInputs.length)];
      const category = getResponseCategory(input);
      const aiText = responses[category][Math.floor(Math.random() * responses[category].length)];

      await addDoc(collection(db, "messages"), {
        text: input,
        user: "you@example.com",
        photoURL: "user.jpg",
        timestamp: serverTimestamp(),
        from: "user",
      });

      await addDoc(collection(db, "messages"), {
        text: aiText,
        user: "Chatterly AI",
        photoURL: "avatar-logo.png",
        timestamp: serverTimestamp(),
        from: "system",
      });

      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    console.log(`Seeded ${count} random messages.`);
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.from === "system" ? "bot" : "self"}`}
          >
            <img
              src={message.photoURL}
              alt={message.user}
              className="avatar"
              title={message.user}
            />
            <p>{message.text}</p>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
