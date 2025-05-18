// src/pages/GoogleSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleSuccess() {
    const navigate = useNavigate();

useEffect(() => {
  const timer = setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      alert('Google Sign-in Successful!');
      navigate('/home');
    } else {
      alert('Token missing in URL');
      navigate('/');
    }
  }, 100);

  return () => clearTimeout(timer);
}, []);


    return <div>Signing you in...</div>;
}
