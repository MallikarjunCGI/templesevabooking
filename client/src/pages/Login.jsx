import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/authSlice';
import { toast } from 'react-hot-toast';
import { Search, MapPin, ArrowLeft, Loader2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [isAuthenticated, error, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
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
                <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">{t('nav.login')}</h2>

                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            placeholder={t('auth.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="new-email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            placeholder={t('auth.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : t('auth.submit_login')}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Login;
