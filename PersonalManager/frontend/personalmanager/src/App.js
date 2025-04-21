import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import TaskPage from './components/Tasks';
import NotesPage from './components/Notes';
import HomePage from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
