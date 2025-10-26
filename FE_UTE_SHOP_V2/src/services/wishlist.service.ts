import { apiClient } from "../config/api";

// chuẩn hóa kiểu phản hồi chung từ apiClient (tương tự auth.ts)
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

const WISHLIST_ENDPOINTS = {
  BASE: "/wishlist",
  ITEM: (id: string | number) => `/wishlist/${id}`,
  CHECK: (productId: string | number) => `/wishlist/check/${productId}`,
};

export interface WishlistItem {
  id: string | number;
  product_id: string | number;
  [key: string]: any;
}

export interface WishlistResponse {
  success: boolean;
  message?: string;
  data?: WishlistItem[];
}

export interface CheckWishlistResponse {
  success: boolean;
  message?: string;
  data?: {
    isInWishlist: boolean;
  };
}

export const wishlistService = {
  // Lấy wishlist
  getWishlist: async (token: string): Promise<WishlistResponse> => {
    try {
      const response = (await apiClient.get(
        WISHLIST_ENDPOINTS.BASE,
        token
      )) as ApiResponse<WishlistItem[]>;

      return {
        success: response.success,
        message: response.message,
        data: response.data ?? [],
      };
    } catch (error) {
      console.error("Get wishlist error:", error);
      throw error;
    }
  },

  // Thêm vào wishlist
  addToWishlist: async (
    productId: string | number,
    token: string
  ): Promise<WishlistResponse> => {
    try {
      const response = (await apiClient.post(
        WISHLIST_ENDPOINTS.BASE,
        { product_id: productId },
        token
      )) as ApiResponse<WishlistItem[]>;

      return {
        success: response.success,
        message: response.message,
        data: response.data ?? [],
      };
    } catch (error) {
      console.error("Add to wishlist error:", error);
      throw error;
    }
  },

  // Kiểm tra sản phẩm trong wishlist
  checkWishlist: async (
    productId: string | number,
    token: string
  ): Promise<CheckWishlistResponse> => {
    try {
      const response = (await apiClient.get(
        WISHLIST_ENDPOINTS.CHECK(productId),
        token
      )) as ApiResponse<{ isInWishlist: boolean }>;

      return {
        success: response.success,
        message: response.message,
        data: {
          isInWishlist: response.data
            ? response.data.isInWishlist
            : false,
        },
      };
    } catch (error) {
      console.error("Check wishlist error:", error);
      throw error;
    }
  },

  // Xóa khỏi wishlist
  removeFromWishlist: async (
    id: string | number,
    token: string
  ): Promise<WishlistResponse> => {
    try {
      const response = (await apiClient.delete(
        WISHLIST_ENDPOINTS.ITEM(id),
        token
      )) as ApiResponse<WishlistItem[]>;

      return {
        success: response.success,
        message: response.message,
        data: response.data ?? [],
      };
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      throw error;
    }
  },

  // Xóa toàn bộ wishlist
  clearWishlist: async (token: string): Promise<WishlistResponse> => {
    try {
      const response = (await apiClient.delete(
        WISHLIST_ENDPOINTS.BASE,
        token
      )) as ApiResponse<WishlistItem[]>;

      return {
        success: response.success,
        message: response.message,
        data: response.data ?? [],
      };
    } catch (error) {
      console.error("Clear wishlist error:", error);
      throw error;
    }
  },
};

export default wishlistService;
