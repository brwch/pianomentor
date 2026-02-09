import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../authentication/AuthContext';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import UserInfoTable from './UserInfoTable';
import './Account.css';
import { useAdminContext } from '../../authentication/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faSignOutAlt, faEdit, faCircleNotch, faCheck, faTimes, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';

const Account = () => {
  const { user, saveEditedUser, logout } = UserAuth();
  const [userData, setUserData] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editedUsername, setEditedUsername] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const navigate = useNavigate();

  const { isAdmin } = useAdminContext();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/home');
      console.log('You are logged out');
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    setForceUpdate((prev) => prev + 1);
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;

    if (field === 'username') {
      setEditedUsername(value);
    } else if (field === 'email') {
      setEditedEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);

      if (!editedUsername || !editedEmail || !password) {
        setIsLoading(false);
        return;
      }

      await saveEditedUser(user.uid, editedUsername, editedEmail, password);

      setForceUpdate((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving edit in Account:', error.message);
      setPassword('');
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setPassword('');
    }
  };

  const handleCancelEdit = () => {
    setEditedUsername(userData.username);
    setEditedEmail(userData.email);
    setPassword('');
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
            setEditedUsername(userDoc.data().username);
            setEditedEmail(userDoc.data().email);
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    const fetchAllUsersData = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersDataArray = [];

        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          usersDataArray.push({
            uid: doc.id,
            ...userData,
          });
        });

        setUsersData(usersDataArray);
      } catch (error) {
        console.error('Error fetching users data:', error.message);
      }
    };

    fetchUserData();
    fetchAllUsersData();
  }, [user, forceUpdate]);

  useEffect(() => {
    if (sortConfig.key) {
      const sortedUsers = [...usersData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });

      setUsersData(sortedUsers);
    }
  }, [sortConfig, usersData]);

  useEffect(() => {
    if (userData) {
      setEditedUsername(userData.username);
      setEditedEmail(userData.email);
    }
  }, [userData]);

  return (
    <div>
      <div className='current-user'>
        {userData && (
          <div>
            <h2>Moje konto</h2>
            <table className="LoggedInfoTable">
              <tbody>
                <tr>
                  <td>
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    Nazwa
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUsername}
                        onChange={(e) => handleInputChange(e, 'username')}
                        className="change-input"
                        placeholder='Wprowadź nową nazwę'
                      />
                    ) : (
                      userData.username
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <FontAwesomeIcon icon={faEnvelope} className="icon" />
                    Email
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedEmail}
                        onChange={(e) => handleInputChange(e, 'email')}
                        className="change-input"
                        placeholder='Wprowadź nowy email'
                      />
                    ) : (
                      user && user.email
                    )}
                  </td>
                </tr>
                {isEditing && (
                  <tr>
                    <td>
                      <FontAwesomeIcon icon={faUnlockKeyhole} className="icon" />
                      Hasło
                    </td>
                    <td>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => handleInputChange(e, 'password')}
                        className="change-input"
                        placeholder='Potwierdź hasło'
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isEditing && (
        <div className='changing-container'>
          <button
            className='confirm-btn'
            onClick={handleSaveEdit}
            disabled={isLoading || !editedUsername || !editedEmail || !password}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon className='edit-icon' icon={faCircleNotch} spin /> Zapisz
              </>
            ) : (
              <>
                <FontAwesomeIcon className='edit-icon' icon={faCheck} /> Zapisz
              </>
            )}
          </button>
          <button className='cancel-btn' onClick={handleCancelEdit}>
            <FontAwesomeIcon className='edit-icon' icon={faTimes} /> Odrzuć
          </button>
        </div>
      )}

      {!isEditing && (
        <div>
          <button className='edit-btn big' onClick={() => setIsEditing(true)}>
            <FontAwesomeIcon className="icon" icon={faEdit} /> Edytuj konto
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon className="icon" icon={faSignOutAlt} /> Wyloguj
          </button>
        </div>
      )}

      {isAdmin && usersData.length > 0 && (
        <div>
          <h2>Lista użytkowników</h2>
          <UserInfoTable users={usersData} onSort={handleSort} forceUpdate={setForceUpdate} />
        </div>
      )}
    </div>
  );
};

export default Account;
