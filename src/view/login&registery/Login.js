import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCircleNotch, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { UserAuth } from '../../authentication/AuthContext';
import './Login&Register.css';

const Login = () => {
  const { signIn, showSuccessMessage } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isEmpty) {
      setError('Pola nie mogą być puste');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      console.log(`Zalogowano jako: ${email}`);
      showSuccessMessage('Poprawnie zalogowano!', faCheckCircle, 'success');
      navigate('/account');
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Nieprawidłowy email lub hasło');
    } finally {

      setIsLoading(false);
    }
  };

  const handleInputChange = (e, setter, setIsFocused, setIsEmpty) => {
    const value = e.target.value;
    setter(value);
    setIsFocused(true);
    setIsEmpty(value === '');
    setError('');
  };

  const handleInputClick = (setIsFocused) => {
    setIsFocused(true);
  };

  const handleInputBlur = (setIsFocused) => {
    setIsFocused(false);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Logowanie</h2>
      <form className="login-form">
        <div className={`input-container ${email ? 'filled' : ''} ${isEmailFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
          <input
            className="input-field"
            type="text"
            id="email"
            value={email}
            onChange={(e) => handleInputChange(e, setEmail, setIsEmailFocused, setIsEmpty)}
            onClick={() => handleInputClick(setIsEmailFocused)}
            onBlur={() => handleInputBlur(setIsEmailFocused)}
          />
          <span className="placeholder">Email</span>
        </div>

        <div className={`input-container ${password ? 'filled' : ''} ${isPasswordFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
          <input
            className="input-field"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword, setIsPasswordFocused, setIsEmpty)}
            onClick={() => handleInputClick(setIsPasswordFocused)}
            onBlur={() => handleInputBlur(setIsPasswordFocused)}
          />
          <span className="placeholder">Hasło</span>
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            className={`eye-icon ${showPassword ? '' : 'eye-icon-slash'}`}
            onClick={() => setShowPassword(!showPassword)}
          />

        </div>
        <button className={`login-btn ${isLoading ? 'loading' : ''}`} onClick={handleLogin}>
          {isLoading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin className="loading-icon" />
          ) : (
            'Zaloguj'
          )}
        </button>
        <div className="error-message ">{error}</div>
      </form>

      <div className="register-link">
        Nie masz konta? <a href="/register">Zarejestruj się</a>
      </div>
    </div>
  );
};

export default Login;