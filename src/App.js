// src/App.js

import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import Navbar from './components/Navbar';
import WelcomePage from './components/AuthenTech/WelcomePage';
import LoginPage from './components/AuthenTech/LoginPage';
import RegistrationPage from './components/AuthenTech/RegistrationPage';
import DashboardPage from './components/AuthenTech/DashboardPage';
import EmailVerification from './components/AuthenTech/EmailVerification';
import CreateQuantablePage from './components/Quantable/CreateQuantablePage';
import QuantableListPage from './components/Quantable/QuantableListPage';
import QuantableDetailPage from './components/Quantable/QuantableDetailPage';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';

library.add(faBars);

function App() {
  return (
    <AuthProvider>
        <UserProvider>
          <Router>
              <Navbar />
              <Routes>
                  <Route path="/" element={<WelcomePage/>} exact/>
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/register" element={<RegistrationPage/>}/>
                  <Route path="/dashboard" element={<DashboardPage/>}/>
                  <Route path="/verify-email/:token" element={<EmailVerification/>}/>
                  <Route path="/create-quantable" element={<CreateQuantablePage/>}/>
                  <Route path="/quantables" element={<QuantableListPage/>}/>
                  <Route path="/quantables/:quantableId" element={<QuantableDetailPage />} />
              </Routes>
          </Router>
        </UserProvider>
    </AuthProvider>
  );
}

export default App;


