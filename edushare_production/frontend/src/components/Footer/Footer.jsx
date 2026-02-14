import { Link } from 'react-router-dom';
import {
    FaGraduationCap, FaFacebook, FaInstagram, FaYoutube,
    FaHeart, FaGithub, FaTelegram, FaEnvelope,
    FaMapMarkerAlt
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-glow"></div>
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-brand-section">
                        <Link to="/" className="footer-brand">
                            <div className="footer-logo-icon">
                                <FaGraduationCap />
                            </div>
                            <div>
                                <span className="footer-logo-name">EduShare</span>
                                <span className="footer-logo-sub">School</span>
                            </div>
                        </Link>
                        <p className="footer-description">
                            O'quvchilar bir-birlariga o'rgatadigan va o'rganadigan
                            inqilobiy ta'lim platformasi. Bilim ulashish — kelajak yaratish!
                        </p>
                        <div className="footer-socials">
                            <a href="https://t.me/edushare" className="social-link" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
                                <FaTelegram />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className="social-link" aria-label="YouTube">
                                <FaYoutube />
                            </a>
                            <a href="#" className="social-link" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#" className="social-link" aria-label="GitHub">
                                <FaGithub />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links-section">
                        <h4 className="footer-heading">Tezkor Havolalar</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Bosh Sahifa</Link></li>
                            <li><Link to="/courses">Kurslar</Link></li>
                            <li><Link to="/leaderboard">Reyting</Link></li>
                            <li><Link to="/about">Biz Haqimizda</Link></li>
                            <li><Link to="/create-lesson">Dars Yaratish</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="footer-links-section">
                        <h4 className="footer-heading">Kategoriyalar</h4>
                        <ul className="footer-links">
                            <li><Link to="/courses?category=programming">Dasturlash</Link></li>
                            <li><Link to="/courses?category=math">Matematika</Link></li>
                            <li><Link to="/courses?category=science">Fan</Link></li>
                            <li><Link to="/courses?category=languages">Tillar</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-links-section">
                        <h4 className="footer-heading">Bog'lanish</h4>
                        <ul className="footer-contact">
                            <li>
                                <FaEnvelope className="contact-icon" />
                                <span>support@edushare.uz</span>
                            </li>
                            <li>
                                <FaTelegram className="contact-icon" />
                                <span>@edushare_support</span>
                            </li>
                            <li>
                                <FaMapMarkerAlt className="contact-icon" />
                                <span>O'zbekiston</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="footer-bottom">
                    <p>
                        © {currentYear} EduShare School. Barcha huquqlar himoyalangan.
                    </p>
                    <p className="footer-credit">
                        <FaHeart className="heart-icon" /> bilan <strong>Ruslan Xusenov</strong> tomonidan yaratilgan
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;