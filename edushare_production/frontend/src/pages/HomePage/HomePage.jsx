import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaRocket, FaBook, FaUsers, FaTrophy, FaStar, FaChartLine,
    FaCode, FaCalculator, FaFlask, FaLanguage, FaArrowRight, FaPlay,
    FaGraduationCap, FaLightbulb, FaGlobe
} from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import apiClient, { API_ENDPOINTS } from '../../config/api';
import './HomePage.css';

const HomePage = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        totalTeachers: 0,
    });
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiClient.get(API_ENDPOINTS.LESSONS);
                const courses = res.data.results || [];
                setFeaturedCourses(courses.slice(0, 6));
                setStats({
                    totalStudents: res.data.count * 5 || 250,
                    totalCourses: res.data.count || 50,
                    totalTeachers: Math.ceil((res.data.count || 10) / 2),
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const particles = useMemo(() => {
        return [...Array(20)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${3 + Math.random() * 4}s`
        }));
    }, []);

    const categories = [
        { icon: <FaCode />, name: "Dasturlash", color: "#6366f1", count: "30+ kurslar" },
        { icon: <FaCalculator />, name: "Matematika", color: "#f59e0b", count: "25+ kurslar" },
        { icon: <FaFlask />, name: "Fan", color: "#10b981", count: "40+ kurslar" },
        { icon: <FaLanguage />, name: "Tillar", color: "#ec4899", count: "35+ kurslar" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <>
            <Helmet>
                <title>EduShare School - O'quvchilar O'quvchilarga O'rgatadi | Ruslan Xusenov</title>
                <meta name="description" content="EduShare School - O'zbekistonning eng yaxshi bepul onlayn ta'lim platformasi. Dasturlash, matematika, fan va tillar bo'yicha kurslar. Ruslan Xusenov tomonidan yaratilgan." />
                <meta name="keywords" content="EduShare, Ruslan Xusenov, onlayn ta'lim, bepul kurslar, dasturlash, O'zbekiston ta'lim" />
                <meta name="author" content="Ruslan Xusenov" />
                <link rel="canonical" href="https://edushare.uz/" />
            </Helmet>

            {/* Hero Section - Enhanced */}
            <section className="hero-section">
                <div className="hero-bg">
                    <div className="hero-orb hero-orb-1"></div>
                    <div className="hero-orb hero-orb-2"></div>
                    <div className="hero-orb hero-orb-3"></div>
                    <div className="hero-orb hero-orb-4"></div>
                    <div className="hero-particles">
                        {particles.map((p) => (
                            <div key={p.id} className="particle" style={{
                                left: p.left,
                                top: p.top,
                                animationDelay: p.delay,
                                animationDuration: p.duration
                            }}></div>
                        ))}
                    </div>
                </div>

                <div className="container hero-container">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            className="hero-badge"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                        >
                            <FaRocket className="badge-icon" />
                            <span>🇺🇿 O'zbekistondagi #1 Ta'lim Platformasi</span>
                        </motion.div>

                        <h1 className="hero-title">
                            O'rganishning
                            <span className="hero-gradient-text"> yangi davri</span>
                            <br />shu yerdan boshlanadi
                        </h1>

                        <p className="hero-description">
                            O'quvchilar bir-birlariga o'rgatadigan inqilobiy platforma.
                            Bepul kurslar, interaktiv darslar va jonli hamjamiyat bilan
                            o'z salohiyatingizni ro'yobga chiqaring.
                        </p>

                        <div className="hero-actions">
                            <Link to="/courses" className="btn btn-primary btn-lg hero-btn-main">
                                <FaPlay /> Bepul Boshlash
                            </Link>
                            <Link to="/about" className="btn btn-outline btn-lg hero-btn-secondary">
                                Batafsil Ma'lumot <FaArrowRight />
                            </Link>
                        </div>

                        <div className="hero-trust">
                            <div className="trust-avatars">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="trust-avatar" style={{
                                        background: `hsl(${i * 60}, 70%, 60%)`
                                    }}>
                                        {String.fromCodePoint(0x1F464 + i)}
                                    </div>
                                ))}
                            </div>
                            <p className="trust-text">
                                <strong>{stats.totalStudents}+</strong> o'quvchilar bizga ishonadi
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="hero-float-card card-1">
                            <FaGraduationCap />
                            <span>Sertifikat oling</span>
                        </div>
                        <div className="hero-float-card card-2">
                            <FaTrophy />
                            <span>Reyting yutib oling</span>
                        </div>
                        <div className="hero-float-card card-3">
                            <FaLightbulb />
                            <span>Ko'nikmalar oshiring</span>
                        </div>
                        <div className="hero-illustration">
                            <div className="illustration-blob"></div>
                            <FaGlobe className="illustration-icon" />
                        </div>
                    </motion.div>
                </div>

                <div className="hero-wave">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill="var(--gray-50)" />
                    </svg>
                </div>
            </section>

            {/* Stats Section - Enhanced */}
            <motion.section
                className="stats-section"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="container">
                    <div className="stats-grid">
                        {[
                            { number: `${stats.totalStudents}+`, label: "Faol O'quvchilar", icon: <FaUsers />, color: "#6366f1" },
                            { number: `${stats.totalCourses}+`, label: "Bepul Kurslar", icon: <FaBook />, color: "#f59e0b" },
                            { number: `${stats.totalTeachers}+`, label: "Tajribali O'qituvchilar", icon: <FaStar />, color: "#10b981" },
                            { number: "98%", label: "Qoniqish Darajasi", icon: <FaChartLine />, color: "#ec4899" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="stat-card glass"
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                                <div className="stat-glow" style={{ background: stat.color }}></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="section-badge">Kategoriyalar</span>
                        <h2>O'zingizga Mos <span className="gradient-text">Yo'nalishni</span> Tanlang</h2>
                        <p>Turli xil kurslar orasidan o'zingizga keragini toping</p>
                    </motion.div>

                    <motion.div
                        className="categories-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {categories.map((cat, index) => (
                            <motion.div
                                key={index}
                                className="category-card"
                                variants={itemVariants}
                                whileHover={{ y: -10, scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="category-icon" style={{
                                    background: `${cat.color}12`,
                                    color: cat.color,
                                    boxShadow: `0 8px 30px ${cat.color}20`
                                }}>
                                    {cat.icon}
                                </div>
                                <h3>{cat.name}</h3>
                                <p>{cat.count}</p>
                                <div className="category-hover-line" style={{ background: cat.color }}></div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section >

            {/* Featured Courses */}
            < section className="courses-section" >
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="section-badge">Mashhur Kurslar</span>
                        <h2><span className="gradient-text">Trendagi</span> Kurslarni Ko'ring</h2>
                        <p>Eng ko'p o'rganilayotgan va baholangan darslar</p>
                    </motion.div>

                    {loading ? (
                        <div className="courses-grid">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="course-skeleton">
                                    <div className="skeleton skeleton-image"></div>
                                    <div className="skeleton skeleton-text"></div>
                                    <div className="skeleton skeleton-text-short"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="courses-grid"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {featuredCourses.map((course, index) => (
                                <motion.div key={course.id} variants={itemVariants}>
                                    <Link to={`/courses/${course.id}`} className="course-card">
                                        <div className="course-image-wrapper">
                                            <img
                                                src={course.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop'}
                                                alt={course.title}
                                                className="course-image"
                                                loading="lazy"
                                            />
                                            <div className="course-overlay">
                                                <FaPlay className="play-icon" />
                                            </div>
                                            <div className="course-level-badge">
                                                {course.level === 'beginner' ? "Boshlang'ich" :
                                                    course.level === 'intermediate' ? "O'rta" : "Yuqori"}
                                            </div>
                                        </div>
                                        <div className="course-info">
                                            <div className="course-category-tag">
                                                {course.category?.display_name || 'Umumiy'}
                                            </div>
                                            <h3 className="course-title">{course.title}</h3>
                                            <p className="course-description">
                                                {course.description?.substring(0, 80)}...
                                            </p>
                                            <div className="course-footer">
                                                <div className="course-author">
                                                    <img
                                                        src={course.author?.avatar_url || `https://ui-avatars.com/api/?name=${course.author?.full_name || 'E'}&background=6366f1&color=fff&size=32`}
                                                        alt={course.author?.full_name}
                                                        className="author-avatar"
                                                    />
                                                    <span>{course.author?.full_name || "O'qituvchi"}</span>
                                                </div>
                                                <div className="course-rating">
                                                    <FaStar className="star-icon" />
                                                    <span>{course.rating || '4.5'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <motion.div
                        className="see-all"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/courses" className="btn btn-outline btn-lg">
                            Barcha Kurslarni Ko'rish <FaArrowRight />
                        </Link>
                    </motion.div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="cta-section" >
                <div className="cta-bg">
                    <div className="cta-orb cta-orb-1"></div>
                    <div className="cta-orb cta-orb-2"></div>
                </div>
                <div className="container">
                    <motion.div
                        className="cta-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>O'z Darslingizni Yarating va <br /><span className="cta-highlight">Bilimingizni Ulashing</span></h2>
                        <p>Siz ham o'qituvchi bo'ling! O'z bilimingizni boshqalar bilan ulashing va EduShare jamoasiga qo'shiling.</p>
                        <div className="cta-actions">
                            <Link to="/create-lesson" className="btn btn-primary btn-lg cta-btn">
                                <FaRocket /> Dars Yaratish
                            </Link>
                            <Link to="/signup" className="btn btn-outline btn-lg cta-btn-secondary">
                                Ro'yxatdan O'tish
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section >
        </>
    );
};

export default HomePage;
