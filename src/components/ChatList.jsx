import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const chatsCollection = collection(db, 'chats');
  
  useEffect(() => {
    const chatsCollection = collection(db, 'chats');
    const q = query(chatsCollection);  // Assuming you're querying all chats

    // Using onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsList = querySnapshot.docs.map(doc => doc.data());
      setChats(chatsList);
    });

    // Cleanup function to unsubscribe when the component is unmounted
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Chat List</h2>
      {chats.map((chat, index) => (
        <div key={index}>{chat.name}</div>  // Assuming each chat has a 'name' field
      ))}
    </div>
  );
};

export default ChatList;
