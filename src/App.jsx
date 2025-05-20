import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import ChatBox from "./components/ChatBox";
import NavBar from "./components/NavBar";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setMessages([]); // Clear chat history on login
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setMessages([]); // Clear chat history on login
    } catch (error) {
      console.error("Error during Google login: ", error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <div>
      <NavBar user={user} setUser={setUser} handleLogout={handleLogout} />
        {user ? (
          <>
            <div className="user-info">
            </div>
            <ChatBox user={user} messages={messages} setMessages={setMessages} />
          </>
        ) : (
        <div className="center">
          <h2>Welcome 🧑‍💻 to ❤️ ChatBox</h2>
          <button onClick={handleLogin}>Login with Google</button>
        </div>
      )}
    </div>
  );
};

export default App;
