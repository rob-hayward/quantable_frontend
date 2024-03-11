import axios from 'axios';

// Function to retrieve the token from localStorage
const getToken = () => {
  // Assuming the token is stored with the key 'token' in localStorage
  return localStorage.getItem('token'); // Adjust if stored under a different key
};

function getCSRFToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true, // Necessary for cookies to be sent along with requests if using sessions
});

// Interceptor to attach CSRF token and Authorization token to requests
axiosInstance.interceptors.request.use(config => {
  const csrfToken = getCSRFToken();
  const authToken = getToken(); // Retrieve the auth token from localStorage

  // Attach CSRF token if it exists
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  // Attach Authorization token if it exists
  if (authToken) {
    config.headers['Authorization'] = `Token ${authToken}`; // Use 'Bearer' instead of 'Token' if your backend expects Bearer tokens
  }

  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

export default axiosInstance;
