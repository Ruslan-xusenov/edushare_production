import axios from 'axios';

// API Base URL - Django backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !['/login', '/signup'].includes(window.location.pathname)) {
            // Redirect to login if unauthorized
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/accounts/login/',
    SIGNUP: '/accounts/signup/',
    LOGOUT: '/accounts/logout/',
    PROFILE: '/accounts/profile/',

    // Courses
    COURSES: '/courses/',
    COURSE_DETAIL: (id) => `/courses/${id}/`,
    COURSE_ENROLL: (id) => `/courses/${id}/enroll/`,

    // Lessons
    LESSONS: '/lessons/',
    LESSON_DETAIL: (id) => `/lessons/${id}/`,
    LESSON_COMPLETE: (id) => `/lessons/${id}/complete/`,

    // Assignments
    ASSIGNMENTS: '/assignments/',
    ASSIGNMENT_SUBMIT: (id) => `/assignments/${id}/submit/`,

    // Reviews & Comments
    REVIEWS: '/reviews/',
    COMMENTS: '/comments/',

    // Leaderboard
    LEADERBOARD: '/leaderboard/',

    // Stats
    STATS: '/stats/',
};
