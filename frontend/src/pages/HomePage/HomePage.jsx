import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaRocket, FaBook, FaUsers, FaTrophy, FaStar, FaChartLine,
    FaCode, FaCalculator, FaFlask, FaLanguage, FaArrowRight, FaPlay
} from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import apiClient, { API_ENDPOINTS } from '../../config/api';
import './HomePage.css';

const HomePage = () => {
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        lessons: 0,
        instructors: 0
    });
    const [categories, setCategories] = useState([]);
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats (Mock for now if no endpoint, or fetch from lessons count)
                const [lessonsRes, catsRes] = await Promise.all([
                    apiClient.get(API_ENDPOINTS.LESSONS + 'featured/'),
                    apiClient.get(API_ENDPOINTS.COURSES.replace('/courses/', '/categories/'))
                ]);

                setFeaturedCourses(lessonsRes.data);

                // Map categories with icons
                const iconMap = {
                    'programming': <FaCode />,
                    'mathematics': <FaCalculator />,
                    'science': <FaFlask />,
                    'languages': <FaLanguage />,
                };

                const mappedCats = catsRes.data.results.map(cat => ({
                    ...cat,
                    icon: iconMap[cat.name.toLowerCase()] || <FaBook />,
                    color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color if not set
                }));
                setCategories(mappedCats.slice(0, 4));

                // Set some dummy stats until real stats endpoint is ready
                setStats({
                    students: 1250,
                    courses: catsRes.data.count || 0,
                    lessons: 850,
                    instructors: 45
                });

            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <>
            <Helmet>
                <title>EduShare School - Students Teaching Students</title>
                <meta name="description" content="Join EduShare School, a peer-to-peer learning platform where students teach and learn from each other. Free courses in programming, mathematics, science, and more." />
                <meta name="keywords" content="education, online learning, peer learning, free courses, student teaching" />
            </Helmet>

            <div className="home-page">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-bg"></div>
                    <div className="container">
                        <motion.div
                            className="hero-content"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.h1
                                className="hero-title"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Learn From Your <span className="gradient-text">Peers</span>
                            </motion.h1>
                            <motion.p
                                className="hero-subtitle"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Join thousands of students teaching and learning together.
                                Share knowledge, earn points, and grow your skills.
                            </motion.p>
                            <motion.div
                                className="hero-actions"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link to="/courses" className="btn btn-primary btn-lg">
                                    <FaRocket /> Start Learning
                                </Link>
                                <Link to="/about" className="btn btn-outline btn-lg">
                                    <FaPlay /> Watch Demo
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Floating Stats */}
                        <motion.div
                            className="hero-stats"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div className="stat-card" variants={itemVariants}>
                                <FaUsers className="stat-icon" />
                                <div className="stat-number">{stats.students.toLocaleString()}+</div>
                                <div className="stat-label">Students</div>
                            </motion.div>
                            <motion.div className="stat-card" variants={itemVariants}>
                                <FaBook className="stat-icon" />
                                <div className="stat-number">{stats.courses}+</div>
                                <div className="stat-label">Courses</div>
                            </motion.div>
                            <motion.div className="stat-card" variants={itemVariants}>
                                <FaChartLine className="stat-icon" />
                                <div className="stat-number">{stats.lessons}+</div>
                                <div className="stat-label">Lessons</div>
                            </motion.div>
                            <motion.div className="stat-card" variants={itemVariants}>
                                <FaTrophy className="stat-icon" />
                                <div className="stat-number">{stats.instructors}+</div>
                                <div className="stat-label">Instructors</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="categories-section">
                    <div className="container">
                        <motion.div
                            className="section-header"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2>Explore Categories</h2>
                            <p>Choose from our wide range of subjects</p>
                        </motion.div>

                        <motion.div
                            className="categories-grid"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {!loading && categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    className="category-card"
                                    variants={itemVariants}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    style={{ '--category-color': category.color }}
                                >
                                    <div className="category-icon">{category.icon}</div>
                                    <h3>{category.display_name}</h3>
                                    <p>{category.lessons_count} courses available</p>
                                    <Link to={`/courses?category=${category.slug}`} className="category-link">
                                        Explore <FaArrowRight />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Featured Courses */}
                <section className="featured-section">
                    <div className="container">
                        <motion.div
                            className="section-header"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2>Featured Courses</h2>
                            <p>Popular courses from our community</p>
                        </motion.div>

                        <motion.div
                            className="courses-grid"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {!loading && featuredCourses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    className="course-card"
                                    variants={itemVariants}
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="course-image">
                                        <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'} alt={course.title} />
                                        <span className="course-badge">{course.level}</span>
                                    </div>
                                    <div className="course-content">
                                        <h3>{course.title}</h3>
                                        <div className="course-meta">
                                            <span className="course-instructor">{course.author?.full_name}</span>
                                            <span className="course-rating">
                                                <FaStar /> {parseFloat(4.5 + Math.random() * 0.5).toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="course-footer">
                                            <span className="course-students">
                                                <FaUsers /> {course.views} views
                                            </span>
                                            <span className="course-price">Free</span>
                                        </div>
                                        <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                                            View Course <FaArrowRight />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="section-footer">
                            <Link to="/courses" className="btn btn-outline">
                                View All Courses <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="container">
                        <motion.div
                            className="cta-content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2>Ready to Start Your Learning Journey?</h2>
                            <p>Join our community today and unlock your potential</p>
                            <Link to="/signup" className="btn btn-secondary btn-lg">
                                Sign Up Now <FaArrowRight />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;
