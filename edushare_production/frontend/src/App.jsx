import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage';
import AboutPage from './pages/AboutPage/AboutPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import MyLearningPage from './pages/MyLearningPage/MyLearningPage';
import CreateLessonPage from './pages/CreateLessonPage/CreateLessonPage';
import CertificatePage from './pages/CertificatePage/CertificatePage';
import apiClient, { API_ENDPOINTS } from './config/api';
import './App.css';

// Google OAuth callback handler component
function AuthCallbackHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('auth') === 'success') {
      // Google OAuth completed — Django session is active, fetch user profile
      apiClient.get(API_ENDPOINTS.PROFILE)
        .then(res => {
          if (res.data.status === 'success') {
            localStorage.setItem('authToken', 'session-active');
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // Remove ?auth=success from URL and reload to update Navbar
            navigate('/', { replace: true });
            window.location.reload();
          }
        })
        .catch(err => {
          console.error('Google auth callback - failed to fetch profile:', err);
          // Clean URL even on failure
          navigate('/', { replace: true });
        });
    }
  }, [location.search, navigate]);

  return null;
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthCallbackHandler />
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-learning" element={<MyLearningPage />} />
              <Route path="/create-lesson" element={<CreateLessonPage />} />
              <Route path="/certificate/:id" element={<CertificatePage />} />
              {/* Add more routes as needed */}
              <Route path="*" element={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;