import { API_BASE_URL } from './api';

/**
 * Base function for making HTTP requests to the API.
 * Automatically prepends base URL, sets headers, and handles errors.
 * 
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} [options={}] - Fetch request options
 * @returns {Promise<Object|Response>} JSON response or Response object
 * @throws {Error} Error with status and data fields on non-ok response
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.detail || `HTTP Error: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

export function apiGet(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'GET',
  });
}

export function apiPost(endpoint, data, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function apiPut(endpoint, data, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function apiPatch(endpoint, data, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function apiDelete(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'DELETE',
  });
}
