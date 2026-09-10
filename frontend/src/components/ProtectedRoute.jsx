import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const token = localStorage.getItem('token');

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch {
        user = null;
    }

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user.rol?.toLowerCase();

    const isAllowed = allowedRoles.some(
        role => role.toLowerCase() === userRole
    );

    if (!isAllowed) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;