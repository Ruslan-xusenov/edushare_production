import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaGraduationCap, FaHome, FaBook, FaTrophy, FaInfoCircle,
    FaBell, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt,
    FaChalkboardTeacher, FaBookReader, FaPlusCircle, FaBars, FaTimes, FaSearch
} from 'react-icons/fa';
import apiClient, { API_ENDPOINTS } from '../../config/api';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await apiClient.get(API_ENDPOINTS.PROFILE);
                if (res.data.status === 'success') {
                    setIsAuthenticated(true);
                    setUser(res.data.user);
                    localStorage.setItem('authToken', 'session-active');
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }
            } catch (error) {
                console.log('Not logged in');
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await apiClient.post(API_ENDPOINTS.LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?q=${searchQuery}`);
            setSearchQuery('');
        }
    };

    return (
        <motion.nav
            className={`navbar ${isScrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="navbar-brand">
                        <FaGraduationCap className="brand-icon" />
                        <span className="brand-text">EduShare</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="navbar-links desktop-only">
                        <Link to="/" className="nav-link">
                            <FaHome /> <span>Home</span>
                        </Link>
                        <Link to="/courses" className="nav-link">
                            <FaBook /> <span>Courses</span>
                        </Link>
                        <Link to="/leaderboard" className="nav-link">
                            <FaTrophy /> <span>Leaderboard</span>
                        </Link>
                        <Link to="/about" className="nav-link">
                            <FaInfoCircle /> <span>About</span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <form className="navbar-search desktop-only" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            <FaSearch />
                        </button>
                    </form>

                    {/* Right Side - Auth/Profile */}
                    <div className="navbar-actions desktop-only">
                        {isAuthenticated ? (
                            <>
                                <button className="notification-btn">
                                    <FaBell />
                                    <span className="notification-badge">3</span>
                                </button>

                                <div className="user-menu">
                                    <button className="user-btn">
                                        <FaUser />
                                        <span>{user?.full_name || user?.username}</span>
                                        <span className="user-points">{user?.points || 0}</span>
                                    </button>

                                    <div className="dropdown-menu">
                                        <Link to="/profile" className="dropdown-item">
                                            <FaUser /> Profile
                                        </Link>
                                        <Link to="/my-learning" className="dropdown-item">
                                            <FaBookReader /> My Learning
                                        </Link>
                                        {user?.is_staff && (
                                            <>
                                                <Link to="/my-lessons" className="dropdown-item">
                                                    <FaChalkboardTeacher /> My Lessons
                                                </Link>
                                                <Link to="/create-lesson" className="dropdown-item">
                                                    <FaPlusCircle /> Create Lesson
                                                </Link>
                                            </>
                                        )}
                                        <hr />
                                        <button onClick={handleLogout} className="dropdown-item">
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline btn-sm">
                                    <FaSignInAlt /> Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary btn-sm">
                                    <FaUserPlus /> Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn mobile-only"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <form className="mobile-search" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit"><FaSearch /></button>
                        </form>

                        <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                            <FaHome /> Home
                        </Link>
                        <Link to="/courses" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                            <FaBook /> Courses
                        </Link>
                        <Link to="/leaderboard" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                            <FaTrophy /> Leaderboard
                        </Link>
                        <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                            <FaInfoCircle /> About
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <hr />
                                <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaUser /> Profile
                                </Link>
                                <Link to="/my-learning" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaBookReader /> My Learning
                                </Link>
                                {user?.is_staff && (
                                    <>
                                        <Link to="/my-lessons" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                            <FaChalkboardTeacher /> My Lessons
                                        </Link>
                                        <Link to="/create-lesson" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                            <FaPlusCircle /> Create Lesson
                                        </Link>
                                    </>
                                )}
                                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="mobile-nav-link danger">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <hr />
                                <Link to="/login" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaSignInAlt /> Login
                                </Link>
                                <Link to="/signup" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaUserPlus /> Sign Up
                                </Link>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
