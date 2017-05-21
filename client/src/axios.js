import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: { 'Authorization': 'JWT ' + window.localStorage.getItem('token') }
})
