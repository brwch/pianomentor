import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updateEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth';
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [tasks, setTasks] = useState([]);
    const [successMessage, setSuccessMessage] = useState({ message: '', icon: null });

    const createUser = async (email, password, username) => {
        try {
            const authResult = await createUserWithEmailAndPassword(auth, email, password);
            const userUid = authResult.user.uid;

            const tasksArray = Array.from({ length: 18 }, (_, index) => ({ id: index + 1, percentage: 0 }));

            // Dodanie nowego użytkownika do kolekcji 'users'
            await setDoc(doc(db, 'users', userUid), {
                email,
                username,
                timeStamp: new Date(),
                tasks: tasksArray,
            });

            setUser(authResult.user);
            return authResult;
        } catch (error) {
            console.error('Error creating user:', error.message);
            throw error;
        }
    };

    const updateUser = async (userId, updatedUserData) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, updatedUserData);
            console.log('User data updated successfully in the database.');
        } catch (error) {
            console.error('Error updating user data in the database:', error.message);
            throw error;
        }
    };

    const saveEditedUserName = async (editedUserId, editedUsername) => {
        try {
            setUser((prevUser) => ({
                ...prevUser,
                username: editedUsername,
            }));

            await updateUser(editedUserId, {
                username: editedUsername,
            });
            showSuccessMessage('Nazwa użytkownika została zmieniona!', faCheck, 'success');
            console.log('User profile updated successfully in Firebase Authentication.');
        } catch (error) {
            showSuccessMessage('Wystąpił błąd!', faXmarkCircle, 'error');
            console.error('Error saving edit in AuthContext:', error.message);
        }
    };

    const saveEditedUser = async (editedUserId, editedUsername, editedEmail, password) => {
        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, password);

            await reauthenticateWithCredential(user, credential);
            await updateEmail(user, editedEmail);

            await updateProfile(user, {
                displayName: editedUsername,
            });

            await updateUser(editedUserId, {
                username: editedUsername,
                email: editedEmail,
            });
            showSuccessMessage('Dane użytkownika zostały zmienione!', faCheck, 'success');
            console.log('User profile updated successfully in Firebase Authentication.');
        } catch (error) {
            showSuccessMessage('Niepoprawne dane!', faXmarkCircle, 'error');
            console.error('Error saving edit in AuthContext:', error.message);
        }
    };

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    };

    const logout = () => {
        return signOut(auth)
    };

    const updateExerciseProgress = async (exerciseId, newPercentage) => {
        try {
            if (!user) {
                console.error('User not logged in. Cannot update exercise progress.');
                return 0;
            }

            const userUid = user.uid;
            const userDocRef = doc(db, 'users', userUid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const tasks = userDocSnapshot.data().tasks;
                const existingPercentage = tasks.find(task => task.id === exerciseId)?.percentage || 0;

                // Aktualizuj tylko wtedy, gdy nowy wynik jest lepszy od poprzedniego
                if (newPercentage > existingPercentage) {
                    const updatedTasks = tasks.map(task =>
                        task.id === exerciseId ? { ...task, percentage: newPercentage } : task
                    );

                    await updateDoc(userDocRef, { tasks: updatedTasks });
                    console.log('Exercise progress updated successfully.');
                } else {
                    console.log('New percentage is not better than the existing one. Not updating.');
                }
            }
        } catch (error) {
            console.error('Error updating exercise progress:', error.message);
            throw error;
        }
    };

    const getTaskProgress = async (taskId, user) => {
        try {
            if (!user || !user.uid) {
                console.error('User not logged in or user UID is not available. Cannot update exercise progress.');
                return 0; // Domyślny postęp, jeśli użytkownik nie jest zalogowany lub brakuje UID
            }

            const userUid = user.uid;
            const userDocRef = doc(db, 'users', userUid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();

                if (userData && userData.tasks && Array.isArray(userData.tasks)) {
                    const task = userData.tasks.find((task) => task.id === taskId);

                    if (task && typeof task.percentage === 'number') {
                        return task.percentage;
                    }
                }
            }

            return 0;
        } catch (error) {
            console.error('Error getting task progress:', error.message);
            throw error;
        }
    };

    const showSuccessMessage = (message, icon, type = 'success') => {
        setSuccessMessage({ message, icon, type });
        setTimeout(() => setSuccessMessage({ message: '', icon: null, type: '' }), 3000);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            setUser(currentUser);
            if (currentUser) {
                const userUid = currentUser.uid;
                const userDocRef = doc(db, 'users', userUid);

                getDoc(userDocRef)
                    .then((userDocSnapshot) => {
                        if (userDocSnapshot.exists()) {
                            setTasks(userDocSnapshot.data().tasks);
                        }
                    })
                    .catch((error) => {
                        console.error('Error getting user document:', error.message);
                    });
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider
            value={{ createUser, user, logout, signIn, tasks, getTaskProgress, updateExerciseProgress, updateUser, saveEditedUserName, saveEditedUser, showSuccessMessage }}
        >
            {children}
            {successMessage.message && (
                <div className={` ${successMessage.type}-info`}>
                    {successMessage.icon && (<FontAwesomeIcon icon={successMessage.icon} className={`success-icon`} />)}
                    <span className={`success-text`}>{successMessage.message}</span>
                </div>
            )}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};
