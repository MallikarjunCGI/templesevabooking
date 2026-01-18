import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const AdminRoute = () => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (isAuthenticated && user && user.role === 'admin') {
        return <Outlet />;
    } else {
        if (!isAuthenticated) {
            toast.error('Please login to access admin area');
            return <Navigate to="/login" replace />;
        } else {
            toast.error('Access Denied: Admins only');
            return <Navigate to="/" replace />;
        }
    }
};

export default AdminRoute;
