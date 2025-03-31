import axios from 'axios';

export const trackPageView = (path) => {
  axios.post('http://localhost:3002/tracking/track', { path })
    .catch(error => console.error('Tracking error:', error));
};
