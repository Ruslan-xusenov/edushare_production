import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
    FaSearch, FaFilter, FaStar, FaUsers, FaClock,
    FaCode, FaCalculator, FaFlask, FaLanguage, FaBook
} from 'react-icons/fa';
import apiClient, { API_ENDPOINTS } from '../../config/api';
import './CoursesPage.css';

const CoursesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [sortBy, setSortBy] = useState('popular');
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([
        { id: 'all', name: 'Barcha Kurslar', icon: <FaFilter /> }
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiClient.get(API_ENDPOINTS.CATEGORIES);
                const iconMap = {
                    'programming': <FaCode />,
                    'mathematics': <FaCalculator />,
                    'science': <FaFlask />,
                    'languages': <FaLanguage />,
                };
                const results = res.data.results || [];
                const mappedCats = results.map(cat => ({
                    id: cat.slug,
                    name: cat.display_name,
                    icon: iconMap[cat.name.toLowerCase()] || <FaBook />
                }));
                setCategories([{ id: 'all', name: 'Barcha Kurslar', icon: <FaFilter /> }, ...mappedCats]);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                let url = API_ENDPOINTS.LESSONS;
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (selectedCategory !== 'all') params.append('category__slug', selectedCategory);
                if (sortBy === 'newest') params.append('ordering', '-created_at');
                else if (sortBy === 'popular') params.append('ordering', '-views');

                const queryString = params.toString();
                const res = await apiClient.get(`${url}${queryString ? '?' + queryString : ''}`);
                setCourses(res.data.results || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchCourses, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory, sortBy]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: searchQuery, category: selectedCategory });
    };

    return (
        <>
            <Helmet>
                <title>Barcha Kurslar - EduShare School | Ruslan Xusenov</title>
                <meta name="description" content="Dasturlash, matematika, fan va tillar bo'yicha bepul onlayn kurslarning keng tanlovini ko'rib chiqing. Tengdosh o'qituvchilardan o'rganing. Ruslan Xusenov tomonidan yaratilgan." />
                <meta name="author" content="Ruslan Xusenov" />
            </Helmet>

            <div className="courses-page">
                {/* Header Section */}
                <section className="courses-header">
                    <div className="container">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Kurslarni Ko'ring
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            Tengdosh o'quvchilar tomonidan o'qitiladigan ajoyib kurslarni kashf eting
                        </motion.p>
                    </div>
                </section>

                <div className="container">
                    {/* Search and Filter */}
                    <div className="courses-controls">
                        <form className="search-form" onSubmit={handleSearch}>
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Kurslarni qidiring..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">Qidirish</button>
                            </div>
                        </form>

                        <div className="filter-sort">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="popular">Eng Mashhur</option>
                                <option value="rating">Eng Yuqori Baholangan</option>
                                <option value="newest">Eng Yangi</option>
                            </select>
                        </div>
                    </div>

                    {/* Categories Filter */}
                    <div className="categories-filter">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.icon}
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <div className="results-info">
                        <p>{courses.length} ta kurs topildi</p>
                    </div>

                    {/* Courses Grid */}
                    <motion.div
                        className="courses-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {!loading && courses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                className="course-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="course-image">
                                    <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'} alt={course.title} />
                                    <span className="level-badge">{course.level}</span>
                                </div>

                                <div className="course-content">
                                    <div className="course-category-tag">{course.category?.display_name}</div>
                                    <h3>{course.title}</h3>
                                    <p className="course-description">{course.description?.substring(0, 100)}...</p>

                                    <div className="course-meta">
                                        <div className="meta-item">
                                            <FaStar className="icon" />
                                            <span>{parseFloat(4.5 + Math.random() * 0.5).toFixed(1)}</span>
                                        </div>
                                        <div className="meta-item">
                                            <FaUsers className="icon" />
                                            <span>{course.views}</span>
                                        </div>
                                        <div className="meta-item">
                                            <FaClock className="icon" />
                                            <span>{course.duration || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="course-footer">
                                        <div className="instructor">{course.author?.full_name || course.author?.username}</div>
                                        <div className="price">Bepul</div>
                                    </div>

                                    <Link to={`/courses/${course.id}`} className="btn btn-primary btn-block">
                                        Kursni Ko'rish
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {!loading && courses.length === 0 && (
                        <div className="no-results">
                            <h3>Kurslar topilmadi</h3>
                            <p>Qidiruv yoki filtrlarni o'zgartiring</p>
                        </div>
                    )}

                    {loading && (
                        <div className="loading-state">
                            <p>Kurslar yuklanmoqda...</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CoursesPage;
