import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import BackgroundWrapper from './components/common/BackgroundWrapper'
import ScrollToTop from './components/common/ScrollToTop'

// Pages
import { Suspense, lazy } from 'react'

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Bookings = lazy(() => import('./pages/Bookings'))
const SevaListing = lazy(() => import('./pages/SevaListing'))
const SevaDetails = lazy(() => import('./pages/SevaDetails'))
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'))
const ContactTrust = lazy(() => import('./pages/ContactTrust'))

// Admin Lazy Load
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const AdminRoute = lazy(() => import('./components/common/AdminRoute'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const SankalpaList = lazy(() => import('./pages/admin/SankalpaList'))
const SevaManagement = lazy(() => import('./pages/admin/SevaManagement'))
const HeroManagement = lazy(() => import('./pages/admin/HeroManagement'))
const PhotoOrders = lazy(() => import('./pages/admin/PhotoOrders'))
const SettingsBoundary = lazy(() => import('./pages/admin/Settings'))

// Loading Component
const PageLoader = () => (
    <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
)

function App() {
    return (
        <>
            <Toaster position="top-center" />
            <Suspense fallback={<PageLoader />}>
                <ScrollToTop />
                <Routes>
                    {/* User Routes */}
                    <Route element={<BackgroundWrapper><Navbar /><div className="pt-4 min-h-[70vh]"><Outlet /></div><Footer /></BackgroundWrapper>}>
                        <Route path="/" element={<Home />} />
                        <Route path="/sevas" element={<SevaListing />} />
                        <Route path="/sevas/:id" element={<SevaDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/bookings" element={<Bookings />} />
                        <Route path="/booking-success" element={<BookingSuccess />} />
                        <Route path="/contact-trust" element={<ContactTrust />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Navigate to="sankalpa" replace />} />
                            <Route path="sankalpa" element={<SankalpaList />} />
                            <Route path="photo-orders" element={<PhotoOrders />} />
                            <Route path="sevas" element={<SevaManagement />} />
                            <Route path="hero" element={<HeroManagement />} />
                            <Route path="settings" element={<SettingsBoundary />} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </>
    )
}

export default App
