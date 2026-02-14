import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
    FaHeart, FaRocket, FaUsers, FaGraduationCap,
    FaLightbulb, FaTrophy, FaHandshake, FaGlobe,
    FaChartLine, FaAward, FaMedal
} from 'react-icons/fa';
import apiClient, { API_ENDPOINTS } from '../../config/api';
import './AboutPage.css';

const AboutPage = () => {
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        lessons: 0,
        certificates: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get(API_ENDPOINTS.STATS);
                if (res.data.status === 'success') {
                    setStats(res.data.stats);
                }
            } catch (error) {
                console.error("Error fetching about stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const values = [
        {
            icon: <FaHeart />,
            title: "O'quvchilarga Yo'naltirilgan",
            description: "O'quvchilar uchun o'quvchilar tomonidan yaratilgan platforma.",
            color: '#ef4444'
        },
        {
            icon: <FaLightbulb />,
            title: 'Innovatsiya',
            description: "Ta'lim tajribasini oshirish uchun ilg'or texnologiyalar bilan doimo rivojlanmoqdamiz.",
            color: '#f59e0b'
        },
        {
            icon: <FaHandshake />,
            title: 'Hamkorlik',
            description: "Bilim almashish orqali jamoaviy o'sishni ta'minlaydigan hamjamiyat quramiz.",
            color: '#10b981'
        },
        {
            icon: <FaGlobe />,
            title: 'Ochiqlik',
            description: "Sifatli ta'limni bepul va hammaga ochiq qilish - bizning asosiy maqsadimiz.",
            color: '#6366f1'
        }
    ];

    const achievements = [
        { icon: <FaUsers />, number: `${stats.students.toLocaleString()}+`, label: "Faol O'quvchilar" },
        { icon: <FaGraduationCap />, number: `${stats.courses.toLocaleString()}+`, label: 'Yaratilgan Kurslar' },
        { icon: <FaTrophy />, number: `${stats.lessons.toLocaleString()}+`, label: 'Ulashilgan Darslar' },
        { icon: <FaAward />, number: `${stats.certificates.toLocaleString()}+`, label: 'Sertifikatlar' }
    ];

    const team = [
        {
            name: 'Ruslan Xusenov',
            role: 'Asoschisi & Bosh Dasturchi',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            bio: "EduShare platformasining asoschisi. Ta'limni demokratlashtirish va O'zbekiston yoshlariga sifatli ta'lim berish — uning asosiy maqsadi."
        },
        {
            name: 'Amir Karimov',
            role: 'Texnologiya Bo\'limi Boshlig\'i',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
            bio: "Millionlab o'quvchilarga xizmat qiladigan miqyosli platformalar yaratish bo'yicha mutaxassis."
        },
        {
            name: 'Dilnoza Rahimova',
            role: 'Hamjamiyat Menejeri',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            bio: "Har bir o'quvchi o'sib-rivojlana oladigan jonli o'quv hamjamiyatlarini yaratish bo'yicha faol."
        },
        {
            name: 'Jasur Toshmatov',
            role: "Bosh O'qituvchi",
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
            bio: "Ilhomlantiruvchi va jalb qiluvchi innovatsion ta'lim tajribalarini loyihalash bo'yicha mutaxassis."
        }
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
        visible: { opacity: 1, y: 0 }
    };

    return (
        <>
            <Helmet>
                <title>Biz Haqimizda - EduShare School | Ruslan Xusenov</title>
                <meta name="description" content="EduShare School haqida - peer-to-peer ta'lim orqali ta'limni inqilob qilish missiyamiz. Ruslan Xusenov tomonidan asos solingan. Qadriyatlarimiz, jamoamiz va kelajak ta'lim haqidagi tasavvurimiz." />
                <meta name="keywords" content="EduShare haqida, Ruslan Xusenov, ta'lim platformasi, peer-to-peer ta'lim, O'zbekiston ta'lim" />
                <meta name="author" content="Ruslan Xusenov" />
            </Helmet>

            <div className="about-page">
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="about-hero-bg"></div>
                    <div className="container">
                        <motion.div
                            className="about-hero-content"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="about-badge"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <FaRocket /> Bizning Tariximiz
                            </motion.div>
                            <h1>O'quvchilarni <span className="gradient-text">O'qitish & O'rganishga</span> Ilhomlantirish</h1>
                            <p className="hero-description">
                                EduShare oddiy bir e'tiqoddan tug'ilgan: o'rganishning eng yaxshi yo'li - bu o'qitish.
                                Biz o'quvchilar o'qituvchiga aylanadigan va bilim erkin tarqaladigan platforma yaratdik.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="mission-section">
                    <div className="container">
                        <div className="mission-grid">
                            <motion.div
                                className="mission-image"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" alt="O'quvchilar hamkorlik qilmoqda" />
                                <div className="image-overlay">
                                    <FaGraduationCap className="overlay-icon" />
                                </div>
                            </motion.div>
                            <motion.div
                                className="mission-content"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2>Bizning Missiyamiz</h2>
                                <p className="mission-text">
                                    Har bir o'quvchi ham o'rganuvchi, ham o'qituvchi bo'ladigan hamjamiyat yaratish orqali
                                    ta'limni inqilob qilish. Biz ulashilgan bilim — ko'payadigan bilim, deb ishonamiz,
                                    va buni amalga oshirish uchun platforma qurayapmiz.
                                </p>
                                <div className="mission-stats">
                                    <div className="stat-item">
                                        <FaAward className="stat-icon" />
                                        <div>
                                            <div className="stat-value">100%</div>
                                            <div className="stat-label">Bepul Platforma</div>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <FaMedal className="stat-icon" />
                                        <div>
                                            <div className="stat-value">24/7</div>
                                            <div className="stat-label">Doimiy Kirish</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="values-section">
                    <div className="container">
                        <motion.div
                            className="section-header"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2>Asosiy Qadriyatlarimiz</h2>
                            <p>Biz qiladigan hamma narsaga yo'l-yo'riq beradigan tamoyillar</p>
                        </motion.div>

                        <motion.div
                            className="values-grid"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    className="value-card"
                                    variants={itemVariants}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    style={{ '--value-color': value.color }}
                                >
                                    <div className="value-icon">{value.icon}</div>
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Achievements Section */}
                <section className="achievements-section">
                    <div className="container">
                        <motion.div
                            className="achievements-grid"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement.label}
                                    className="achievement-card"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="achievement-icon">{achievement.icon}</div>
                                    <div className="achievement-number">{achievement.number}</div>
                                    <div className="achievement-label">{achievement.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="team-section">
                    <div className="container">
                        <motion.div
                            className="section-header"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2>Jamoamiz Bilan Tanishing</h2>
                            <p>Ta'limni o'zgartirishga bag'ishlangan fidoyi insonlar</p>
                        </motion.div>

                        <motion.div
                            className="team-grid"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {team.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    className="team-card"
                                    variants={itemVariants}
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="team-image">
                                        <img src={member.image} alt={member.name} />
                                    </div>
                                    <div className="team-content">
                                        <h3>{member.name}</h3>
                                        <div className="team-role">{member.role}</div>
                                        <p>{member.bio}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="about-cta">
                    <div className="container">
                        <motion.div
                            className="cta-content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <FaChartLine className="cta-icon" />
                            <h2>O'sib Borayotgan Hamjamiyatimizga Qo'shiling</h2>
                            <p>Ta'lim kelajagining bir qismi bo'ling. Bugundan o'rganishni yoki o'qitishni boshlang!</p>
                            <div className="cta-buttons">
                                <a href="/signup" className="btn btn-primary btn-lg">Boshlash</a>
                                <a href="/courses" className="btn btn-outline btn-lg">Kurslarni Ko'rish</a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AboutPage;