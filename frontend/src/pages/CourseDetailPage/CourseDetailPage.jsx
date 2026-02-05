import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
    FaStar, FaUsers, FaClock, FaChartLine, FaBookOpen,
    FaPlayCircle, FaTrophy, FaHeart, FaShare, FaArrowRight,
    FaCheckCircle, FaLock, FaChevronDown, FaChevronUp, FaYoutube, FaFileVideo
} from 'react-icons/fa';
import apiClient, { API_ENDPOINTS } from '../../config/api';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedSection, setExpandedSection] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState(null);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const res = await apiClient.get(API_ENDPOINTS.LESSON_DETAIL(id));
                setCourse(res.data);
                if (res.data) {
                    setSelectedLesson(res.data); // Primary lesson is the course itself in this simplified model or first in list
                }
            } catch (error) {
                console.error("Error fetching course detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetail();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading course information...</div>;
    }

    if (!course) {
        return <div className="error">Course not found.</div>;
    }

    const renderVideo = (lesson) => {
        if (lesson.video_file_url) {
            return (
                <div className="video-player">
                    <video controls width="100%" poster={lesson.thumbnail_url}>
                        <source src={lesson.video_file_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        } else if (lesson.youtube_link) {
            const videoId = lesson.youtube_link.split('v=')[1] || lesson.youtube_link.split('/').pop();
            return (
                <div className="video-player-youtube">
                    <iframe
                        width="100%"
                        height="450"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }
        return <div className="no-video">No video available for this lesson.</div>;
    };

    if (!course) {
        return <div className="loading">Loading...</div>;
    }

    const toggleSection = (sectionId) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    return (
        <>
            <Helmet>
                <title>{course.title} - EduShare School</title>
                <meta name="description" content={course.description} />
            </Helmet>

            <div className="course-detail-page">
                {/* Hero Section */}
                <section className="course-hero">
                    <div className="course-hero-bg" style={{ backgroundImage: `url(${course.thumbnail_url})` }}></div>
                    <div className="course-hero-overlay"></div>
                    <div className="container">
                        <div className="course-hero-content">
                            <motion.div
                                className="hero-main"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="course-breadcrumb">
                                    <Link to="/">Home</Link> / <Link to="/courses">Courses</Link> / <span>{course.category?.display_name || 'General'}</span>
                                </div>
                                <h1>{course.title}</h1>
                                <p className="course-subtitle">{course.description}</p>

                                <div className="course-meta">
                                    <div className="meta-item">
                                        <FaStar className="icon-star" />
                                        <span className="rating">{(4.5 + Math.random() * 0.5).toFixed(1)}</span>
                                        <span className="text-muted">(Best rated)</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaUsers />
                                        <span>{course.views.toLocaleString()} views</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaClock />
                                        <span>{course.duration || 'N/A'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaChartLine />
                                        <span>{course.level}</span>
                                    </div>
                                </div>

                                <div className="course-actions">
                                    <button className="btn btn-primary btn-lg">
                                        <FaPlayCircle /> Enroll Now - It's Free!
                                    </button>
                                    <button className="btn btn-outline btn-lg">
                                        <FaHeart /> Add to Wishlist
                                    </button>
                                    <button className="btn btn-icon btn-lg">
                                        <FaShare />
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                className="hero-sidebar"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="course-card">
                                    <div className="card-image">
                                        {renderVideo(course)}
                                    </div>
                                    <div className="card-content">
                                        <div className="price-tag">Free</div>
                                        <button className="btn btn-primary btn-block btn-lg">
                                            Enroll Now
                                        </button>
                                        <div className="course-includes">
                                            <h4>This lesson includes:</h4>
                                            <ul>
                                                <li><FaClock /> {course.duration || 'Video content'}</li>
                                                <li><FaBookOpen /> {course.has_assignment ? 'Includes Assignment' : 'Theory only'}</li>
                                                <li><FaTrophy /> Certificate of completion</li>
                                                <li><FaPlayCircle /> Lifetime access</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="course-content">
                    <div className="container">
                        <div className="content-layout">
                            <div className="content-main">
                                {/* Tabs */}
                                <div className="content-tabs">
                                    <button
                                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('overview')}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        className={`tab ${activeTab === 'assignment' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('assignment')}
                                    >
                                        Assignment
                                    </button>
                                    <button
                                        className={`tab ${activeTab === 'curriculum' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('curriculum')}
                                    >
                                        Curriculum
                                    </button>
                                    <button
                                        className={`tab ${activeTab === 'instructor' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('instructor')}
                                    >
                                        Instructor
                                    </button>
                                    <button
                                        className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('comments')}
                                    >
                                        Comments
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="tab-content">
                                    {activeTab === 'overview' && (
                                        <div className="overview-content">
                                            <h2>Course Description</h2>
                                            <p className="description-text">
                                                {course.description}
                                            </p>
                                        </div>
                                    )}

                                    {activeTab === 'assignment' && (
                                        <div className="assignment-content">
                                            <h2>Assignment</h2>
                                            {course.has_assignment ? (
                                                <div className="assignment-box">
                                                    <p>This lesson has an assignment. Complete it to earn points!</p>
                                                    <Link to={`/assignments/${course.id}`} className="btn btn-primary">
                                                        Go to Assignment
                                                    </Link>
                                                </div>
                                            ) : (
                                                <p>No assignment for this lesson.</p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'curriculum' && (
                                        <div className="curriculum-content">
                                            <h2>Course Curriculum</h2>
                                            <p className="curriculum-intro">
                                                {course.sections.length} sections • {course.lessons} lectures • {course.duration} total length
                                            </p>

                                            <div className="curriculum-sections">
                                                {course.sections.map((section, index) => (
                                                    <div key={section.id} className="curriculum-section">
                                                        <button
                                                            className="section-header"
                                                            onClick={() => toggleSection(section.id)}
                                                        >
                                                            <div className="section-title">
                                                                {expandedSection === section.id ? <FaChevronUp /> : <FaChevronDown />}
                                                                <span>Section {index + 1}: {section.title}</span>
                                                            </div>
                                                            <span className="section-info">
                                                                {section.lessons.length} lessons
                                                            </span>
                                                        </button>

                                                        {expandedSection === section.id && (
                                                            <motion.div
                                                                className="section-lessons"
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                            >
                                                                {section.lessons.map((lesson) => (
                                                                    <div key={lesson.id} className="lesson-item">
                                                                        <div className="lesson-info">
                                                                            {lesson.isCompleted ? (
                                                                                <FaCheckCircle className="icon-completed" />
                                                                            ) : lesson.isFree ? (
                                                                                <FaPlayCircle className="icon-play" />
                                                                            ) : (
                                                                                <FaLock className="icon-locked" />
                                                                            )}
                                                                            <span>{lesson.title}</span>
                                                                            {lesson.isFree && (
                                                                                <span className="free-badge">Free Preview</span>
                                                                            )}
                                                                        </div>
                                                                        <span className="lesson-duration">{lesson.duration}</span>
                                                                    </div>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'instructor' && (
                                        <div className="instructor-content">
                                            <h2>Your Instructor</h2>
                                            <div className="instructor-card">
                                                <img src={course.instructor.avatar} alt={course.instructor.name} />
                                                <div className="instructor-info">
                                                    <h3>{course.instructor.name}</h3>
                                                    <p className="instructor-title">{course.instructor.title}</p>
                                                    <div className="instructor-stats">
                                                        <div className="stat">
                                                            <FaStar className="icon-star" />
                                                            <span>{course.instructor.rating} Instructor Rating</span>
                                                        </div>
                                                        <div className="stat">
                                                            <FaUsers />
                                                            <span>{course.instructor.students.toLocaleString()} Students</span>
                                                        </div>
                                                        <div className="stat">
                                                            <FaBookOpen />
                                                            <span>{course.instructor.courses} Courses</span>
                                                        </div>
                                                    </div>
                                                    <p className="instructor-bio">
                                                        John is a passionate educator with over 10 years of experience in web development.
                                                        He has helped thousands of students launch successful careers in tech.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <div className="reviews-content">
                                            <h2>Student Feedback</h2>
                                            <div className="reviews-summary">
                                                <div className="rating-big">
                                                    <div className="rating-number">{course.rating}</div>
                                                    <div className="rating-stars">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <FaStar key={star} className="star-filled" />
                                                        ))}
                                                    </div>
                                                    <div className="rating-text">Course Rating</div>
                                                </div>
                                            </div>
                                            <div className="reviews-list">
                                                <p className="text-muted">Reviews coming soon...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar - Desktop Only */}
                            <div className="content-sidebar desktop-only">
                                <div className="sidebar-instructor">
                                    <h4>About the Instructor</h4>
                                    <div className="instructor-mini">
                                        <img src={course.instructor.avatar} alt={course.instructor.name} />
                                        <div>
                                            <h5>{course.instructor.name}</h5>
                                            <p>{course.instructor.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default CourseDetailPage;
