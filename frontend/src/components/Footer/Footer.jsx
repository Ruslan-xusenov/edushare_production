import { Link } from 'react-router-dom';
import {
    FaGraduationCap, FaFacebook, FaTwitter, FaInstagram, FaYoutube,
    FaHeart, FaGithub, FaLinkedin
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <div className="footer-brand">
                            <FaGraduationCap className="footer-brand-icon" />
                            <h3>EduShare School</h3>
                        </div>
                        <p className="footer-description">
                            Where students teach students. Learn from your peers and share your knowledge with others.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className="social-link" aria-label="YouTube">
                                <FaYoutube />
                            </a>
                            <a href="#" className="social-link" aria-label="GitHub">
                                <FaGithub />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/courses">Browse Courses</Link></li>
                            <li><Link to="/leaderboard">Leaderboard</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="footer-section">
                        <h4>Categories</h4>
                        <ul className="footer-links">
                            <li><Link to="/courses?category=programming">Programming</Link></li>
                            <li><Link to="/courses?category=mathematics">Mathematics</Link></li>
                            <li><Link to="/courses?category=science">Science</Link></li>
                            <li><Link to="/courses?category=languages">Languages</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-section">
                        <h4>Support</h4>
                        <ul className="footer-links">
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p className="copyright">
                        © {currentYear} EduShare School. All rights reserved.
                    </p>
                    <p className="made-with">
                        Made with <FaHeart className="heart-icon" /> in Uzbekistan 🇺🇿
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
