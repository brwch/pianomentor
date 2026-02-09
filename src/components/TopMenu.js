import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOut, } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserAuth } from '../authentication/AuthContext';
import "./TopMenu.css";
import AppLogo from "./AppLogo.svg";

const TopMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = UserAuth();

  const handleLoginClick = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const handleAccountClick = () => {
    navigate("/account");
    setIsOpen(false);
  };

  const handleSignInClick = () => {
    navigate("/register");
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/home');
      setIsOpen(false);
      console.log('You are logged out');
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="TopMenu">
      <div className="logoContainer">
        <Link to="/home">
          <img src={AppLogo} alt="App Logo" className="logo" />
        </Link>
      </div>
      <div className={`menuItems ${isOpen && "open"}`}>
        <Link to="/home" onClick={handleMenuItemClick} className={location.pathname === '/home' ? 'active' : ''}>Strona Główna</Link>
        <Link to="/practise" onClick={handleMenuItemClick} className={location.pathname === '/practise' ? 'active' : ''}>Ćwiczenia</Link>
        <Link to="/learning" onClick={handleMenuItemClick} className={location.pathname === '/learning' ? 'active' : ''}>Nauka</Link>
        <Link to="/about" onClick={handleMenuItemClick} className={location.pathname === '/about' ? 'active' : ''}>O nas</Link>
      </div>  
      <div className="loginContainer">
        {user ? (
          <div className="accountButtons">
            <button onClick={handleAccountClick} className="loginButton">
              <FontAwesomeIcon icon={faUser} className="iconUser" /> Konto
            </button>
            <button onClick={handleLogout} className="loginButton">
              <FontAwesomeIcon icon={faSignOut} className="iconLogout" />
            </button>
          </div>
        ) : (
          <div className="accountButtons">
            <button onClick={handleLoginClick} className="loginButton">
              Zaloguj
            </button>
            <button onClick={handleSignInClick} className="signinButton">
              Załóż konto
            </button>
          </div>
        )}
      </div>
      <div
        className={`menuToggle ${isOpen && "open"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bar"></div>
      </div>
    </div>
  );
};

export default TopMenu;
