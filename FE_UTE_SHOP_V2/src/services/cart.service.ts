import { apiClient } from "../config/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

const CART_ENDPOINTS = {
  BASE: "/cart",
  ITEM: (id: string | number) => `/cart/${id}`,
};

export interface CartItem {
  id: string | number;
  product_id: string | number;
  quantity: number;
  [key: string]: any;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data?: CartItem[];
}

export const cartService = {
  // Lấy giỏ hàng
  getCart: async (token: string): Promise<CartResponse> => {
    try {
      const response = (await apiClient.get(
        CART_ENDPOINTS.BASE,
        token
      )) as ApiResponse<CartItem[]>;

      return {
        success: response.success,
        message: response.message,
        data: response.data ?? [],
      };
    } catch (error) {
      console.error("Get cart error:", error);
      throw error;
    }
  },

  // Thêm vào giỏ hàng
  addToCart: async (
    data: { product_id: string | number; quantity: number },
    token: string
  ): Promise<CartResponse> => {
    try {
      const response = (await apiClient.post(
        CART_ENDPOINTS.BASE,
        data,
        token
      )) as ApiResponse<CartItem[]>;

      return {
        success: response.success,
        message: response.message,
        data: response.data ?? [],
      };
    } catch (error) {
      console.error("Add to cart error:", error);
      throw error;
    }
  },

  // Cập nhật số lượng
  updateCartItem: async (
    id: string | number,
    quantity: number,
    token: string
  ): Promise<CartResponse> => {
    try {
      const response = (await apiClient.put(
        CART_ENDPOINTS.ITEM(id),
        { quantity },
        token
      )) as ApiResponse<CartItem[]>;

      return {
        success: response.success,
        message: response.message,
        data: response.data ?? [],
      };
    } catch (error) {
      console.error("Update cart item error:", error);
      throw error;
    }
  },

  // Xóa sản phẩm
  removeFromCart: async (
    id: string | number,
    token: string
  ): Promise<CartResponse> => {
    try {
      const response = (await apiClient.delete(
        CART_ENDPOINTS.ITEM(id),
        token
      )) as ApiResponse<CartItem[]>;

      return {
        success: response.success,
        message: response.message,
        data: response.data ?? [],
      };
    } catch (error) {
      console.error("Remove from cart error:", error);
      throw error;
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (token: string): Promise<CartResponse> => {
    try {
      const response = (await apiClient.delete(
        CART_ENDPOINTS.BASE,
        token
      )) as ApiResponse<CartItem[]>;

      return {
        success: response.success,
        message: response.message,
        data: response.data ?? [],
      };
    } catch (error) {
      console.error("Clear cart error:", error);
      throw error;
    }
  },
};

export default cartService;
