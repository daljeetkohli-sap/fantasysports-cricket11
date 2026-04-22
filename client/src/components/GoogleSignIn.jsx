import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignIn() {
  const buttonRef = useRef(null);
  const { currentUser, authStatus, signInWithGoogle, signOut } = useApp();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || currentUser) return;

    const renderButton = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => signInWithGoogle(response.credential)
      });

      buttonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'medium',
        shape: 'pill',
        text: 'signin_with'
      });
    };

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      renderButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    document.head.appendChild(script);
  }, [currentUser, signInWithGoogle]);

  if (currentUser) {
    return (
      <div className="auth-panel">
        {currentUser.picture && <img src={currentUser.picture} alt="" className="avatar" />}
        <span>{currentUser.name}</span>
        <button className="btn small" onClick={signOut}>Sign out</button>
      </div>
    );
  }

  if (!GOOGLE_CLIENT_ID) {
    return <div className="auth-note">Set VITE_GOOGLE_CLIENT_ID for Google login</div>;
  }

  return (
    <div className="auth-panel">
      <div ref={buttonRef} />
      {authStatus && <span className="auth-note">{authStatus}</span>}
    </div>
  );
}
