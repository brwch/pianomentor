import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCircleNotch, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { UserAuth } from '../../authentication/AuthContext';
import './Login&Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [usernameResponse, setUsernameResponse] = useState('');
  const [emailResponse, setEmailResponse] = useState('');
  const [passwordResponse, setPasswordResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createUser, showSuccessMessage } = UserAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    validateUsername();
    validateEmail();
    validatePassword();

    try {
      setIsLoading(true);
      // Dodaj wywołanie funkcji createUser z nowym polem username
      await createUser(email, password, username);
      showSuccessMessage('Poprawnie zarejestrowano!', faCheckCircle, 'success');
      navigate('/account');
      console.log(`Zarejestrowano jako: ${username}, ${email}`);
    } catch (error) {
      console.error('Registration failed:', error.message);
      if (error.code === 'auth/email-already-in-use') {
        setEmailResponse('Adres email jest już zajęty');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = () => {
    if (username.length >= 3 && username.length <= 20) {
      setUsernameResponse('');
    } else {
      setUsernameResponse('Długość nazwy użytkownika jest nieodpowiednia');
    }
  };

  const validateEmail = () => {
    if (email.includes('@')) {
      setEmailResponse('');
    } else {
      setEmailResponse('Nieprawidłowy adres email');
    }
  };

  const validatePassword = () => {
    if (password.length >= 6) {
      setPasswordResponse('');
    } else {
      setPasswordResponse('Hasło powinno mieć co najmniej 6 znaków');
    }
  };

  const handleInputChange = (e, setter, setIsFocused, validateFunction, setResponse) => {
    const value = e.target.value;
    setter(value);
    setIsFocused(true);
    validateFunction();
    setResponse('');
    e.target.parentNode.classList.remove('error');
  };

  const handleInputClick = (setIsFocused) => {
    setIsFocused(true);
  };

  const handleInputBlur = (e, setIsFocused, validateFunction, setResponse) => {
    setIsFocused(false);
    validateFunction();
    if (!e.target.value) {
      e.target.parentNode.classList.add('error');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Rejestracja</h2>
      <form className="login-form">
        <div className={`input-container ${username ? 'filled' : ''} ${isUsernameFocused ? 'focused' : ''} ${usernameResponse ? 'error' : ''}`}>
          <input
            className='input-field'
            type="text"
            id="username"
            value={username}
            onChange={(e) => handleInputChange(e, setUsername, setIsUsernameFocused, validateUsername, setUsernameResponse)}
            onClick={() => handleInputClick(setIsUsernameFocused)}
            onBlur={(e) => handleInputBlur(e, setIsUsernameFocused, validateUsername, setUsernameResponse)}
          />
          <span className="placeholder">Nazwa użytkownika</span>
          <div className="live-response">{usernameResponse}</div>
        </div>

        <div className={`input-container ${email ? 'filled' : ''} ${isEmailFocused ? 'focused' : ''} ${emailResponse ? 'error' : ''}`}>
          <input
            className='input-field'
            type="text"
            id="email"
            value={email}
            onChange={(e) => handleInputChange(e, setEmail, setIsEmailFocused, validateEmail, setEmailResponse)}
            onClick={() => handleInputClick(setIsEmailFocused)}
            onBlur={(e) => handleInputBlur(e, setIsEmailFocused, validateEmail, setEmailResponse)}
          />
          <span className="placeholder">Email</span>
          <div className="live-response">{emailResponse}</div>
        </div>

        <div className={`input-container ${password ? 'filled' : ''} ${isPasswordFocused ? 'focused' : ''} ${passwordResponse ? 'error' : ''}`}>
          <input
            className="input-field password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword, setIsPasswordFocused, validatePassword, setPasswordResponse)}
            onClick={() => handleInputClick(setIsPasswordFocused)}
            onBlur={(e) => handleInputBlur(e, setIsPasswordFocused, validatePassword, setPasswordResponse)}
          />
          <span className="placeholder">Hasło</span>
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            className={`eye-icon ${showPassword ? '' : 'eye-icon-slash'}`}
            onClick={() => setShowPassword(!showPassword)}
          />
          <div className="live-response">{passwordResponse}</div>
        </div>
        <button className={`login-btn ${isLoading ? 'loading' : ''}`} onClick={handleRegister}>
          {isLoading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin className="loading-icon" />
          ) : (
            'Zarejestruj'
          )}
        </button>
      </form>

      <div className="register-link">
        Masz już konto? <a href="/login">Zaloguj się</a>
      </div>
    </div>
  );
};

export default Register;
