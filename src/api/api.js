export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8042/dev/api/v1';

const TOKEN_STORAGE_KEY = 'auth_token';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = this.loadToken();
  }

  loadToken() {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Ошибка при загрузке токена из localStorage:', error);
      return null;
    }
  }

  setToken(token) {
    this.token = token;
    if (token) {
      try {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } catch (error) {
        console.error('Ошибка при сохранении токена в localStorage:', error);
      }
    } else {
      this.removeToken();
    }
  }

  removeToken() {
    this.token = null;
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Ошибка при удалении токена из localStorage:', error);
    }
  }

  getToken() {
    return this.token;
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  buildUrl(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    return url.toString();
  }

  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let data;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP Error: ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  }

  async request(endpoint, options = {}) {
    const { params, headers, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: this.getHeaders(headers),
      });

      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Обработка сетевых ошибок
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new ApiError('Ошибка сети. Проверьте подключение к интернету.', 0, null);
      }
      
      throw new ApiError(error.message || 'Неизвестная ошибка', 0, null);
    }
  }

  async get(endpoint, params = {}, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      params,
      ...options,
    });
  }

  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  async delete(endpoint, params = {}, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      params,
      ...options,
    });
  }

  async postFormData(endpoint, formData, options = {}) {
    const { headers = {}, ...restOptions } = options;
    
    const formDataHeaders = { ...headers };
    delete formDataHeaders['Content-Type'];

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: formDataHeaders,
      ...restOptions,
    });
  }
}

const api = new ApiClient();

export { api, ApiClient, ApiError };
export default api;
