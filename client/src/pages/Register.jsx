import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/authSlice';
import { toast } from 'react-hot-toast';
import { Search, MapPin, ArrowLeft, Loader2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const { name, email, password, confirmPassword, phone } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        // Redirect regular users away from registration as login flow is removed for devotees
        if (isAuthenticated) {
            navigate('/');
        } else {
            // For unauthenticated users, also redirect to home since registration is now closed for devotees
            // Note: Admins are usually already registered or handled separately.
            navigate('/');
        }
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [isAuthenticated, error, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        dispatch(register({ name, email, password, phone }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
            <div className="w-full max-w-md mb-4 px-4">
                <Link
                    to="/"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-bold group transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    {t('common.back_home')}
                </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-orange-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">{t('nav.register')}</h2>

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.name')}</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            value={name}
                            onChange={onChange}
                            autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            value={email}
                            onChange={onChange}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phone')}</label>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            value={phone}
                            onChange={onChange}
                            autoComplete="tel"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            value={password}
                            onChange={onChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirm_password')}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            value={confirmPassword}
                            onChange={onChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex justify-center items-center mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : t('auth.submit_register')}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {t('auth.have_account')}{' '}
                    <Link to="/login" className="text-orange-600 font-medium hover:underline">
                        {t('auth.submit_login')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
