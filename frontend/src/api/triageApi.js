import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Normalize all error shapes to { message, code }
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected error occurred.';
    const code =
      error.response?.data?.error?.code ||
      (error.code === 'ECONNABORTED' ? 'TIMEOUT' : 'NETWORK_ERROR');

    return Promise.reject({ message, code, status: error.response?.status });
  }
);

/**
 * Analyze a single customer support message.
 * @param {string} message
 * @param {object} metadata  - { channel, language, customerId }
 * @returns {Promise<object>} triage result data
 */
export async function analyzeTriage(message, metadata = {}) {
  const { data } = await api.post('/analyze', { message, metadata });
  return data.data;
}

/**
 * Analyze multiple customer support messages in bulk.
 * @param {Array<{message: string, metadata?: object}>} messages
 * @returns {Promise<object>} { summary, results }
 */
export async function analyzeBulkTriage(messages) {
  const { data } = await api.post('/analyze/bulk', { messages });
  return data;
}

/**
 * Fetch the triage JSON schema (for display/debug).
 */
export async function fetchSchema() {
  const { data } = await api.get('/analyze/schema');
  return data.schema;
}

/**
 * Health check.
 */
export async function checkHealth() {
  const { data } = await api.get('/health');
  return data;
}

export default api;
