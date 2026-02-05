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
                const res = await apiClient.get('/accounts/users/?ordering=-points&limit=10');
                setLeaders(res.data.results || []);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                // Fallback mock data
                setLeaders([
                    { id: 1, full_name: 'Ruslan Khusenov', points: 1250, rank: 1 },
                    { id: 2, full_name: 'John Doe', points: 980, rank: 2 },
                    { id: 3, full_name: 'Jane Smith', points: 750, rank: 3 },
                    { id: 4, full_name: 'Bob Johnson', points: 540, rank: 4 },
                    { id: 5, full_name: 'Alice Brown', points: 320, rank: 5 },
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
                <title>Leaderboard - EduShare School</title>
            </Helmet>

            <div className="container">
                <header className="leaderboard-header">
                    <FaTrophy className="header-icon" />
                    <h1>Leaderboard</h1>
                    <p>Top students earning points through their learning journey</p>
                </header>

                {loading ? (
                    <div className="loading">Loading leaderboard...</div>
                ) : (
                    <div className="leaderboard-list">
                        <div className="leader-item header">
                            <span className="rank">Rank</span>
                            <span className="user">User</span>
                            <span className="points">Points</span>
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
                                    <div className="avatar-placeholder">
                                        <FaUser />
                                    </div>
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
