import axios from 'axios';

const api = axios.create({
  baseURL: `https://www.superheroapi.com/api/${process.env.REACT_APP_API_KEY}`,
});

export default api;
