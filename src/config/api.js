const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1337';

export default {
  baseURL: API_URL,
  endpoints: {
    events: '/api/eventis',
    categories: '/api/categories',
    users: '/api/users',
  }
};
