// API Configuration cho Frontend
interface ApiConfig {
  BASE_URL: string;
  TIMEOUT: number;
  DEFAULT_HEADERS: Record<string, string>;
}

const API_CONFIG: ApiConfig = {
  // Base URL của API
  BASE_URL: 'http://localhost:5000/api',
  
  // Timeout cho requests (ms)
  TIMEOUT: 10000,
  
  // Headers mặc định
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
  },
  
  // Product endpoints
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string | number) => `/products/${id}`,
    RELATED: (id: string | number) => `/products/${id}/related`,
    FEATURED: '/products/featured',
    BESTSELLER: '/products/bestseller',
  },
  
  // Category endpoints
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string | number) => `/categories/${id}`,
    BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
  },
  
  // Brand endpoints
  BRANDS: {
    LIST: '/brands',
    DETAIL: (id: string | number) => `/brands/${id}`,
    BY_SLUG: (slug: string) => `/brands/slug/${slug}`,
  },
  
  // Health check
  HEALTH: '/health',
};

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// API Helper Functions
export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Tạo headers với token
  getHeaders(token: string | null = null): Record<string, string> {
    const headers = { ...API_CONFIG.DEFAULT_HEADERS };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Xử lý response
  async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  }

  // GET request
  async get<T>(endpoint: string, token: string | null = null, params: Record<string, any> = {}): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Thêm query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    return this.handleResponse<T>(response);
  }

  // POST request
  async post<T>(endpoint: string, data: any = {}, token: string | null = null): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  // PUT request
  async put<T>(endpoint: string, data: any = {}, token: string | null = null): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  // DELETE request
  async delete<T>(endpoint: string, token: string | null = null): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    return this.handleResponse<T>(response);
  }
}

// Tạo instance
export const apiClient = new ApiClient();

// Auth API Functions
export const authAPI = {
  // Đăng ký
  register: (userData: any) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  
  // Đăng nhập
  login: (credentials: any) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  
  // Đăng xuất
  logout: (token: string) => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, token),
  
  // Lấy profile
  getProfile: (token: string) => apiClient.get(API_ENDPOINTS.AUTH.PROFILE, token),
  
  // Xác thực OTP
  verifyOTP: (data: any) => apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data),
  
  // Gửi lại OTP
  resendOTP: (email: string) => apiClient.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email }),
};

// Product API Functions
export const productAPI = {
  // Lấy danh sách sản phẩm
  getProducts: (params: Record<string, any> = {}, token: string | null = null) => 
    apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, token, params),
  
  // Lấy chi tiết sản phẩm
  getProduct: (id: string | number, token: string | null = null) => 
    apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(id), token),
  
  // Lấy sản phẩm liên quan
  getRelatedProducts: (id: string | number, params: Record<string, any> = {}, token: string | null = null) => 
    apiClient.get(API_ENDPOINTS.PRODUCTS.RELATED(id), token, params),
  
  // Lấy sản phẩm nổi bật
  getFeaturedProducts: (params: Record<string, any> = {}, token: string | null = null) => 
    apiClient.get(API_ENDPOINTS.PRODUCTS.FEATURED, token, params),
  
  // Lấy sản phẩm bán chạy
  getBestSellerProducts: (params: Record<string, any> = {}, token: string | null = null) => 
    apiClient.get(API_ENDPOINTS.PRODUCTS.BESTSELLER, token, params),
};

// Category API Functions
export const categoryAPI = {
  // Lấy danh sách danh mục
  getCategories: (params: Record<string, any> = {}) => 
    apiClient.get(API_ENDPOINTS.CATEGORIES.LIST, null, params),
  
  // Lấy chi tiết danh mục
  getCategory: (id: string | number) => 
    apiClient.get(API_ENDPOINTS.CATEGORIES.DETAIL(id)),
  
  // Lấy danh mục theo slug
  getCategoryBySlug: (slug: string) => 
    apiClient.get(API_ENDPOINTS.CATEGORIES.BY_SLUG(slug)),
};

// Brand API Functions
export const brandAPI = {
  // Lấy danh sách thương hiệu
  getBrands: (params: Record<string, any> = {}) => 
    apiClient.get(API_ENDPOINTS.BRANDS.LIST, null, params),
  
  // Lấy chi tiết thương hiệu
  getBrand: (id: string | number) => 
    apiClient.get(API_ENDPOINTS.BRANDS.DETAIL(id)),
  
  // Lấy thương hiệu theo slug
  getBrandBySlug: (slug: string) => 
    apiClient.get(API_ENDPOINTS.BRANDS.BY_SLUG(slug)),
};

// Health check
export const healthAPI = {
  check: () => apiClient.get(API_ENDPOINTS.HEALTH),
};

// Export tất cả
export default {
  API_CONFIG,
  API_ENDPOINTS,
  ApiClient,
  apiClient,
  authAPI,
  productAPI,
  categoryAPI,
  brandAPI,
  healthAPI,
};
