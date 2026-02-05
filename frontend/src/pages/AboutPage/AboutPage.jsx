import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
    FaHeart, FaRocket, FaUsers, FaGraduationCap,
    FaLightbulb, FaTrophy, FaHandshake, FaGlobe,
    FaChartLine, FaStar, FaAward, FaMedal
} from 'react-icons/fa';
import './AboutPage.css';

const AboutPage = () => {
    const values = [
        {
            icon: <FaHeart />,
            title: 'Student-Centered',
            description: 'We put students first, creating a platform designed by students, for students.',
            color: '#ef4444'
        },
        {
            icon: <FaLightbulb />,
            title: 'Innovation',
            description: 'Constantly evolving with cutting-edge technology to enhance learning experiences.',
            color: '#f59e0b'
        },
        {
            icon: <FaHandshake />,
            title: 'Collaboration',
            description: 'Building a community where knowledge sharing drives collective growth.',
            color: '#10b981'
        },
        {
            icon: <FaGlobe />,
            title: 'Accessibility',
            description: 'Making quality education free and accessible to everyone, everywhere.',
            color: '#6366f1'
        }
    ];

    const achievements = [
        { icon: <FaUsers />, number: '1,250+', label: 'Active Students' },
        { icon: <FaGraduationCap />, number: '150+', label: 'Courses Created' },
        { icon: <FaTrophy />, number: '850+', label: 'Lessons Shared' },
        { icon: <FaStar />, number: '4.9', label: 'Average Rating' }
    ];

    const team = [
        {
            name: 'Sarah Johnson',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            bio: 'Passionate about democratizing education through peer-to-peer learning.'
        },
        {
            name: 'Michael Chen',
            role: 'Head of Technology',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            bio: 'Building scalable platforms that empower millions of learners worldwide.'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Community Manager',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            bio: 'Creating vibrant learning communities where everyone can thrive.'
        },
        {
            name: 'David Park',
            role: 'Lead Educator',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            bio: 'Designing innovative learning experiences that inspire and engage.'
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
                <title>About Us - EduShare School</title>
                <meta name="description" content="Learn about EduShare's mission to revolutionize education through peer-to-peer learning. Discover our values, team, and vision for the future of learning." />
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
                                <FaRocket /> Our Story
                            </motion.div>
                            <h1>Empowering Students to <span className="gradient-text">Teach & Learn</span></h1>
                            <p className="hero-description">
                                EduShare was born from a simple belief: the best way to learn is to teach.
                                We've created a platform where students become teachers, and knowledge flows freely.
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
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" alt="Students collaborating" />
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
                                <h2>Our Mission</h2>
                                <p className="mission-text">
                                    To revolutionize education by creating a community where every student
                                    is both a learner and a teacher. We believe that knowledge shared is
                                    knowledge multiplied, and we're building the platform to make it happen.
                                </p>
                                <div className="mission-stats">
                                    <div className="stat-item">
                                        <FaAward className="stat-icon" />
                                        <div>
                                            <div className="stat-value">100%</div>
                                            <div className="stat-label">Free Platform</div>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <FaMedal className="stat-icon" />
                                        <div>
                                            <div className="stat-value">24/7</div>
                                            <div className="stat-label">Learning Access</div>
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
                            <h2>Our Core Values</h2>
                            <p>The principles that guide everything we do</p>
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
                            <h2>Meet Our Team</h2>
                            <p>Passionate individuals dedicated to transforming education</p>
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
                                        <div className="team-overlay">
                                            <div className="team-social">
                                                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                                                <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                                            </div>
                                        </div>
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
                            <h2>Join Our Growing Community</h2>
                            <p>Be part of the future of education. Start learning or teaching today!</p>
                            <div className="cta-buttons">
                                <a href="/signup" className="btn btn-primary btn-lg">Get Started</a>
                                <a href="/courses" className="btn btn-outline btn-lg">Browse Courses</a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AboutPage;