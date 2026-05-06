import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import Dashboard from './pages/Dashboard';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import Messages from './pages/Messages';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;