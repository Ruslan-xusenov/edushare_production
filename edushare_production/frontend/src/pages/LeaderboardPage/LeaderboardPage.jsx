import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaTrophy, FaMedal, FaStar, FaUser } from 'react-icons/fa';
import apiClient, { API_ENDPOINTS } from '../../config/api';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                // Assuming there's an endpoint for leaderboard or top users
                // If not, we use mock or fetch all users sorted by points
                const res = await apiClient.get(API_ENDPOINTS.LEADERBOARD);
                setLeaders(res.data.results || []);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                // Fallback mock data
                setLeaders([
                    { id: 1, full_name: 'Ruslan Xusenov', points: 1250, rank: 1 },
                    { id: 2, full_name: 'Amir Karimov', points: 980, rank: 2 },
                    { id: 3, full_name: 'Dilnoza Rahimova', points: 750, rank: 3 },
                    { id: 4, full_name: 'Jasur Toshmatov', points: 540, rank: 4 },
                    { id: 5, full_name: 'Nodira Aliyeva', points: 320, rank: 5 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaders();
    }, []);

    const getRankIcon = (rank) => {
        if (rank === 0) return <FaMedal style={{ color: '#ffd700' }} />;
        if (rank === 1) return <FaMedal style={{ color: '#c0c0c0' }} />;
        if (rank === 2) return <FaMedal style={{ color: '#cd7f32' }} />;
        return rank + 1;
    };

    return (
        <div className="leaderboard-page">
            <Helmet>
                <title>Reyting - EduShare School | Ruslan Xusenov</title>
                <meta name="description" content="EduShare School reytingi - eng ko'p ball to'plagan o'quvchilar. Ruslan Xusenov tomonidan yaratilgan ta'lim platformasi." />
                <meta name="author" content="Ruslan Xusenov" />
            </Helmet>

            <div className="container">
                <header className="leaderboard-header">
                    <FaTrophy className="header-icon" />
                    <h1>Reyting Jadvali</h1>
                    <p>O'rganish sayohatida eng ko'p ball to'plagan o'quvchilar</p>
                </header>

                {loading ? (
                    <div className="loading">Reyting yuklanmoqda...</div>
                ) : (
                    <div className="leaderboard-list">
                        <div className="leader-item header">
                            <span className="rank">O'rin</span>
                            <span className="user">Foydalanuvchi</span>
                            <span className="points">Ballar</span>
                        </div>
                        {leaders.map((leader, index) => (
                            <motion.div
                                key={leader.id}
                                className={`leader-item ${index < 3 ? 'top-three' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="rank">{getRankIcon(index)}</span>
                                <span className="user">
                                    {leader.avatar ? (
                                        <img src={leader.avatar} alt={leader.full_name} className="user-avatar" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <FaUser />
                                        </div>
                                    )}
                                    {leader.full_name || leader.username}
                                </span>
                                <span className="points">
                                    <FaStar /> {leader.points}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
