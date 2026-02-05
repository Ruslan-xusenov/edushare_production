import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaLock, FaEnvelope, FaGraduationCap, FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import './AuthPage.css';

import apiClient, { API_ENDPOINTS } from '../../config/api';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiClient.post(API_ENDPOINTS.LOGIN, {
                email: formData.email,
                password: formData.password
            });
            if (res.data.status === 'success') {
                // In a real app, you'd store a JWT token. 
                // Here we'll just set a flag or use the user ID as a mock token since we use sessions.
                localStorage.setItem('authToken', 'session-active');
                localStorage.setItem('user', JSON.stringify(res.data.user));
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.message || 'Login muvaffaqiyatsiz tugadi. Iltimos, ma\'lumotlarni tekshiring.');
        }
    };

    return (
        <>
            <Helmet>
                <title>Login - EduShare School</title>
                <meta name="description" content="Log in to your EduShare account to access courses, lessons, and learn from your peers." />
            </Helmet>

            <div className="auth-page">
                <div className="auth-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                <div className="auth-container">
                    <motion.div
                        className="auth-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="auth-header">
                            <div className="auth-logo">
                                <FaGraduationCap />
                            </div>
                            <h1>Welcome Back!</h1>
                            <p>Log in to continue your learning journey</p>
                        </div>

                        <div className="social-login">
                            <button
                                onClick={() => window.location.href = 'http://localhost:8000/accounts/google/login/'}
                                className="social-btn google"
                                style={{ width: '100%', justifyContent: 'center', gap: '15px', fontSize: '1.2rem', padding: '15px' }}
                            >
                                <FaGoogle /> Continue with Google
                            </button>
                        </div>

                        <div className="divider">
                            <span>or login with email</span>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">
                                    <FaEnvelope /> Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">
                                    <FaLock /> Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg btn-block">
                                Log In
                            </button>
                        </form>

                        <div className="auth-footer" style={{ marginTop: '20px' }}>
                            <p>
                                Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="auth-side"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="side-content">
                            <h2>Start Learning Today</h2>
                            <p>Join thousands of students who are already learning and teaching on EduShare.</p>
                            <div className="side-features">
                                <div className="feature-item">
                                    <div className="feature-icon">✓</div>
                                    <span>Access to 150+ free courses</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">✓</div>
                                    <span>Learn from peer students</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">✓</div>
                                    <span>Earn points and badges</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">✓</div>
                                    <span>24/7 learning access</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
