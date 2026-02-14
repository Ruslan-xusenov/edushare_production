import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaGraduationCap, FaHome, FaBook, FaTrophy, FaInfoCircle,
    FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt,
    FaChalkboardTeacher, FaBookReader, FaPlusCircle, FaBars, FaTimes
} from 'react-icons/fa';
import apiClient, { API_ENDPOINTS } from '../../config/api';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
        if (token) {
            apiClient.get(API_ENDPOINTS.PROFILE)
                .then(res => {
                    if (res.data.status === 'success') {
                        setUser(res.data.user);
                        // Keep localStorage in sync with latest profile data
                        localStorage.setItem('user', JSON.stringify(res.data.user));
                    }
                })
                .catch(() => { });
        }
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [navigate]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileOpen]);

    const handleLogout = async () => {
        try {
            await apiClient.post(API_ENDPOINTS.LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setUser(null);
            setShowDropdown(false);
            navigate('/');
        }
    };

    const navLinks = [
        { to: '/', icon: <FaHome />, label: 'Bosh Sahifa' },
        { to: '/courses', icon: <FaBook />, label: 'Kurslar' },
        { to: '/leaderboard', icon: <FaTrophy />, label: 'Reyting' },
        { to: '/about', icon: <FaInfoCircle />, label: 'Biz Haqimizda' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                {/* Logo */}
                <Link to="/" className="navbar-logo" onClick={() => setIsMobileOpen(false)}>
                    <div className="logo-icon">
                        <FaGraduationCap />
                    </div>
                    <div className="logo-text">
                        <span className="logo-name">EduShare</span>
                        <span className="logo-subtitle">School</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-nav">
                    {navLinks.map((link) => (
                        <Link key={link.to} to={link.to} className="nav-link">
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className="navbar-right">
                    {isLoggedIn ? (
                        <>
                            {user?.is_staff && (
                                <Link to="/create-lesson" className="nav-create-btn" title="Dars Yaratish">
                                    <FaPlusCircle />
                                    <span>Dars Yaratish</span>
                                </Link>
                            )}

                            <div className="user-menu-wrapper">
                                <button
                                    className="user-menu-btn"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <img
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.full_name || 'U'}&background=6366f1&color=fff&size=36`}
                                        alt={user?.full_name}
                                        className="user-avatar"
                                    />
                                    <span className="user-name">{user?.full_name?.split(' ')[0] || 'Profil'}</span>
                                </button>

                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            className="dropdown-menu"
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="dropdown-header">
                                                <img
                                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.full_name || 'U'}&background=6366f1&color=fff&size=48`}
                                                    alt={user?.full_name}
                                                />
                                                <div>
                                                    <strong>{user?.full_name}</strong>
                                                    <span>{user?.email}</span>
                                                </div>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                                <FaUser /> Profilim
                                            </Link>
                                            <Link to="/my-learning" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                                <FaBookReader /> O'rganishlarim
                                            </Link>
                                            {user?.is_staff && (
                                                <Link to="/create-lesson" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                                    <FaChalkboardTeacher /> Dars Yaratish
                                                </Link>
                                            )}
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item logout" onClick={handleLogout}>
                                                <FaSignOutAlt /> Chiqish
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-nav-login">
                                <FaSignInAlt /> Kirish
                            </Link>
                            <Link to="/signup" className="btn-nav-signup">
                                <FaUserPlus /> Ro'yxatdan O'tish
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        aria-label="Menyu"
                    >
                        {isMobileOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            className="mobile-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.div
                            className="mobile-menu"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="mobile-menu-header">
                                <Link to="/" className="navbar-logo" onClick={() => setIsMobileOpen(false)}>
                                    <div className="logo-icon">
                                        <FaGraduationCap />
                                    </div>
                                    <span className="logo-name">EduShare</span>
                                </Link>
                                <button className="mobile-close" onClick={() => setIsMobileOpen(false)}>
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="mobile-menu-body">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.to}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                    >
                                        <Link
                                            to={link.to}
                                            className="mobile-link"
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}

                                {isLoggedIn && (
                                    <>
                                        <div className="mobile-divider"></div>
                                        <Link to="/profile" className="mobile-link" onClick={() => setIsMobileOpen(false)}>
                                            <FaUser /> <span>Profilim</span>
                                        </Link>
                                        <Link to="/my-learning" className="mobile-link" onClick={() => setIsMobileOpen(false)}>
                                            <FaBookReader /> <span>O'rganishlarim</span>
                                        </Link>
                                        {user?.is_staff && (
                                            <Link to="/create-lesson" className="mobile-link" onClick={() => setIsMobileOpen(false)}>
                                                <FaPlusCircle /> <span>Dars Yaratish</span>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="mobile-menu-footer">
                                {isLoggedIn ? (
                                    <button className="btn btn-outline mobile-logout" onClick={handleLogout}>
                                        <FaSignOutAlt /> Chiqish
                                    </button>
                                ) : (
                                    <div className="mobile-auth">
                                        <Link to="/login" className="btn btn-outline mobile-auth-btn" onClick={() => setIsMobileOpen(false)}>
                                            <FaSignInAlt /> Kirish
                                        </Link>
                                        <Link to="/signup" className="btn btn-primary mobile-auth-btn" onClick={() => setIsMobileOpen(false)}>
                                            <FaUserPlus /> Ro'yxatdan O'tish
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;