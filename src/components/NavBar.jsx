import React from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const NavBar = ({ user, setUser }) => {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;

      await setDoc(doc(db, 'users', signedInUser.uid), {
        uid: signedInUser.uid,
        name: signedInUser.displayName,
        email: signedInUser.email,
        photoURL: signedInUser.photoURL,
        lastLogin: serverTimestamp(),
      }, { merge: true });

      setUser(signedInUser);
    } catch (error) {
      console.error('Google sign-in error:', error.message);
    }
  };

  

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Google sign-out error:', error.message);
    }
  };

  return (
    <nav>
      <h1>Chatterly🔤</h1>
      {user ? (
        <>
          <p className='u-name❤️'>Welcome, {user.displayName} ❤️</p>
          <button className='logout' onClick={handleSignOut}>Logout</button>
        </>
      ) : (
        <button className='s-g' onClick={handleGoogleSignIn}>Sign in with Google</button>
      )}
    </nav>
  );
};

export default NavBar;
