import axios from 'axios'

export const network = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:8000',
})
