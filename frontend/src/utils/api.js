import axios from 'axios';

const api = axios.create({
    // 🚀 Purana localhost hatao, naya Render URL lagao
    baseURL: 'https://mini-project-ii-1-y1lt.onrender.com', 
});

// Har request ke sath automatically Token bhejne ka jadu
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;