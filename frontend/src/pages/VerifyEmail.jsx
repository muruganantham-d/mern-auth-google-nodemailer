import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    if (!token) {
      setMessage('Invalid or missing token');
      return;
    }

    try {
      setIsVerifying(true);
      await axios.post('http://localhost:5000/api/auth/verify-email', { token });
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000); 
    } catch (err) {
      setMessage('Verification failed. Token may be invalid or expired.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Email Verification</h2>
      <p>Click the button below to verify your email.</p>
      <button onClick={handleVerify} disabled={isVerifying || !token}>
        {isVerifying ? 'Verifying...' : 'Verify Email'}
      </button>
      {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
    </div>
  );
}
