// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import InvoiceForm from './components/InvoiceForm';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('invoiceData');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/invoice" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} 
          />
          <Route 
            path="/invoice" 
            element={isLoggedIn ? <InvoiceForm onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isLoggedIn ? "/invoice" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;