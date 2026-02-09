import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import TopMenu from './components/TopMenu';
import ProtectedRoute from './authentication/ProtectedRoute';
import Home from './view/home/Home';
import Practise from './view/practise/Practise';
import Learning from './view/about&learning/Learning';
import About from './view/about&learning/About';
import NoteRecognition from './exercises/NoteRecognition';
import MelodyRecognition from './exercises/MelodyRecognition';
import Login from './view/login&registery/Login';
import Register from './view/login&registery/Register';
import Account from './view/account/Account';
import Footer from './components/Footer';
import ChordRecognition from './exercises/ChordRecognition';
import { AuthContextProvider } from './authentication/AuthContext';
import { AdminProvider } from './authentication/AdminContext';


function App() {
  return (
    <div className="App">
      <TopMenu />
      <AuthContextProvider>
        <AdminProvider>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/practise" element={<Practise />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<ProtectedRoute> <Account /></ProtectedRoute>} />
            <Route path="/practise/:id/" element={<Exercises />} />
            <Route path="*" element={<NavigateToHome />} />
          </Routes>
        </AdminProvider>
      </AuthContextProvider>
      <Footer />
    </div>
  );
}

function Exercises() {
  const { id } = useParams();
  const exerciseId = parseInt(id, 10);
  const navigate = useNavigate();

  useEffect(() => {
    if (!(exerciseId >= 1 && exerciseId <= 18)) {
      navigate('/practise');
    }
  }, [exerciseId, navigate]);

  if (exerciseId >= 7 && exerciseId <= 12) {
    return <MelodyRecognition />;
  } else if ((exerciseId >= 1 && exerciseId <= 6) || (exerciseId >= 13 && exerciseId <= 15)) {
    return <NoteRecognition />;
  } else if (exerciseId >= 16 && exerciseId <= 18)
    return <ChordRecognition />;
}

function NavigateToHome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/home');
  }, [navigate]);

  return null;
}

export default App; 
