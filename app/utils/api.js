import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.101.99:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
