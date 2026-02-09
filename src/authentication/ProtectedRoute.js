import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = UserAuth();

    if (!user) {
        return <Navigate to='/home' />;
    }
    return children;
};

export default ProtectedRoute;