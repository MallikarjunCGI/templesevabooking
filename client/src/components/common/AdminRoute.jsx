import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const AdminRoute = () => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (isAuthenticated && user && (user.role === 'admin' || user.role === 'counter')) {
        if (user.role === 'counter') {
            const allowed = ['/admin', '/admin/counter-bookings'];
            if (!allowed.includes(location.pathname)) {
                toast.error('Access Denied: Counter users can only view their bookings');
                return <Navigate to="/admin/counter-bookings" replace />;
            }
        }
        return <Outlet />;
    } else {
        if (!isAuthenticated) {
            toast.error('Please login to access admin area');
            return <Navigate to="/login" replace />;
        } else {
            toast.error('Access Denied');
            return <Navigate to="/" replace />;
        }
    }
};

export default AdminRoute;
