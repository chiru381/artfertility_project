import axios from 'axios';

export function setAuthHeader(token: string | null = null, clinicId: string | null = null) {
  axios.defaults.headers.common['Authorization'] = '';
  axios.defaults.headers.common['clinicId'] = '';
  delete axios.defaults.headers.common['Authorization'];
  delete axios.defaults.headers.common['clinicId'];

  if (token && clinicId) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.common['clinicId'] = `${clinicId}`;
  }
}