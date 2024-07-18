import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import AccountSettings from './components/AccountSettings';
import ResetPassword from './components/ResetPassword';
import Welcome from './components/Welcome';
import Signin from './components/Signup';
import ProductDetail from './components/ProductDetail';
import SupportForm from './components/SupportForm';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route element={<Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}>
          <Route path="/" element={isLoggedIn ? <Home /> : <Welcome />} />
          <Route path="/:productId" element={isLoggedIn ? <ProductDetail /> : <Navigate to="/login" />} />
          <Route path="/account-settings" element={isLoggedIn ? <AccountSettings /> : <Navigate to="/login" />} />
          <Route path="/SupportForm" element={isLoggedIn ? <SupportForm /> : <Navigate to="/login" />} />
          <Route
          path="/sifre-sifirla"
          element={isLoggedIn ? <Navigate to="/" /> : <ResetPassword />}
        />
          <Route path="/signup" element={<Signin />} />
        </Route>
        <Route path="/login" element={<ProtectedLogin isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </Router>
  );
};

const Layout = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();

  return (
    <>
      {isLoggedIn && location.pathname !== '/login' && <Header onLogout={onLogout} />}
      <Outlet />
    </>
  );
};

const ProtectedLogin = ({ isLoggedIn, onLogin }) => {
  return isLoggedIn ? <Navigate to="/" /> : <Login onLogin={onLogin} />;
};

export default App;
