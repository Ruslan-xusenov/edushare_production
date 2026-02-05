import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaLock, FaEnvelope, FaGraduationCap, FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import './AuthPage.css';

import apiClient, { API_ENDPOINTS } from '../../config/api';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false
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
            const res = await apiClient.post(API_ENDPOINTS.SIGNUP, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            if (res.data.status === 'success') {
                localStorage.setItem('authToken', 'session-active');
                localStorage.setItem('user', JSON.stringify(res.data.user));
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert(error.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
        }
    };

    return (
        <>
            <Helmet>
                <title>Sign Up - EduShare School</title>
                <meta name="description" content="Create your free EduShare account and start learning from peers today." />
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
                            <h1>Join EduShare</h1>
                            <p>Create your account and start learning today</p>
                        </div>

                        <div className="social-login">
                            <button
                                onClick={() => window.location.href = 'http://localhost:8000/accounts/google/login/'}
                                className="social-btn google"
                                style={{ width: '100%', justifyContent: 'center', gap: '15px', fontSize: '1.2rem', padding: '15px' }}
                            >
                                <FaGoogle /> Sign up with Google
                            </button>
                        </div>

                        <div className="divider">
                            <span>or sign up with email</span>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="username">
                                    <FaUser /> Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>

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
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg btn-block">
                                Create Account
                            </button>
                        </form>

                        <div className="auth-footer" style={{ marginTop: '20px' }}>
                            <p>
                                Already have an account? <Link to="/login" className="auth-link">Log in</Link>
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
                            <h2>Why Join EduShare?</h2>
                            <p>Join a vibrant community of learners and teachers who are passionate about education.</p>
                            <div className="side-features">
                                <div className="feature-item">
                                    <div className="feature-icon">🎓</div>
                                    <span>Free access to all courses</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">👥</div>
                                    <span>Learn from your peers</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">🏆</div>
                                    <span>Earn badges and rewards</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">📚</div>
                                    <span>Create your own courses</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">⚡</div>
                                    <span>Track your progress</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default SignupPage;
