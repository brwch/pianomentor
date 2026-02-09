import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { UserAuth } from '../authentication/AuthContext';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = UserAuth();

  useEffect(() => {
    const fetchAdminStatus = async () => {
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const editorValue = userDoc.data().editor;
                    setIsAdmin(editorValue === true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    };

    fetchAdminStatus();
}, [user]);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
