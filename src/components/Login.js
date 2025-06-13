import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setShowModal(true);
    setError('');
    setEmail('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
    setEmail('');
  };

const handleSignIn = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
  // ✅ Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address');
    return;
  }


    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/check',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      localStorage.setItem('userEmail', email);

      if (response.ok && result.exists) {
        navigate('/home');
      } else {
        navigate('/groupchat');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
    
  };


  return (
    <div className='Login'>
      <div className="SignIn">
        <button
          type='button'
          className='btn-signin'
          onClick={handleOpenModal}
        >
          <img src="./images/logos_google-icon.png" alt="Google Icon" />
          Sign In with Google
        </button>
      </div>

      {/* popup form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <div className="model-title">
              <img style={{width: '24px',height: '24px'}} src="./images/logos_google-icon1.png" alt="Google Icon" />
              <h3>Sign in to Group chat app</h3>
            </div>
             <h3 id="h3">Enter your Email</h3>
            <input
              type='email'
              id='email'
              name='email'
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;       