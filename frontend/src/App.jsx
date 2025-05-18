import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import VerifyEmail from './pages/VerifyEmail';
import HomePage from './pages/HomePage';
import GoogleSuccess from './pages/GoogleSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/home" element={<HomePage/>} />
      </Routes>
    </Router>
  );
}

export default App;
