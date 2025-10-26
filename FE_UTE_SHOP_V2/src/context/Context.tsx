import { allProducts } from "@/data/products";
import { openCartModal } from "@/utlis/openCartModal";
// import { openWistlistModal } from "@/utlis/openWishlist";

import React, {
  useEffect,
  useContext,
  useState,
  ReactNode,
} from "react";

interface Product {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  [key: string]: any; // imgSrc, title, etc.
}

interface ContextType {
  cartProducts: Product[];
  setCartProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  totalPrice: number;
  addProductToCart: (
    id: string | number,
    qty?: number,
    isModal?: boolean
  ) => void;
  isAddedToCartProducts: (id: string | number) => boolean;
  removeFromWishlist: (id: string | number) => void;
  addToWishlist: (id: string | number) => void;
  isAddedtoWishlist: (id: string | number) => boolean;
  quickViewItem: Product;
  wishList: (string | number)[];
  setQuickViewItem: React.Dispatch<React.SetStateAction<Product>>;
  quickAddItem: number;
  setQuickAddItem: React.Dispatch<React.SetStateAction<number>>;
  addToCompareItem: (id: string | number) => void;
  isAddedtoCompareItem: (id: string | number) => boolean;
  removeFromCompareItem: (id: string | number) => void;
  compareItem: (string | number)[];
  setCompareItem: React.Dispatch<
    React.SetStateAction<(string | number)[]>
  >;
  updateQuantity: (id: string | number, qty: number) => void;
}

const dataContext = React.createContext<ContextType | undefined>(
  undefined
);

export const useContextElement = (): ContextType => {
  const context = useContext(dataContext);
  if (context === undefined) {
    throw new Error(
      "useContextElement must be used within a Context provider"
    );
  }
  return context;
};

interface ContextProps {
  children: ReactNode;
}

// ❌ JSX.Element -> ❌ (gây lỗi 2503)
// ✅ bỏ type return, React hiểu được
export default function Context({ children }: ContextProps) {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [wishList, setWishList] = useState<(string | number)[]>([
    1, 2, 3,
  ]);
  const [compareItem, setCompareItem] = useState<
    (string | number)[]
  >([1, 2, 3]);

  // ✅ Khởi tạo quickViewItem với object chuẩn Product
  const [quickViewItem, setQuickViewItem] = useState<Product>({
    ...allProducts[0],
    name:
      (allProducts[0] as any).name ??
      (allProducts[0] as any).title ??
      "Unknown",
    quantity: 1,
  });

  const [quickAddItem, setQuickAddItem] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // totalPrice sync
  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (
    id: string | number
  ): boolean => {
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };

  const addProductToCart = (
    id: string | number,
    qty?: number,
    isModal: boolean = true
  ): void => {
    if (!isAddedToCartProducts(id)) {
      const baseItem = allProducts.filter((elm) => elm.id == id)[0];

      const item: Product = {
        ...baseItem,
        name:
          (baseItem as any).name ??
          (baseItem as any).title ??
          "Unknown",
        quantity: qty ? qty : 1,
      };

      setCartProducts((pre) => [...pre, item]);
      if (isModal) {
        openCartModal();
      }
    }
  };

  const updateQuantity = (
    id: string | number,
    qty: number
  ): void => {
    if (isAddedToCartProducts(id)) {
      let item = cartProducts.filter((elm) => elm.id == id)[0];
      let items = [...cartProducts];
      const itemIndex = items.indexOf(item);

      item.quantity = qty / 1;
      items[itemIndex] = item;
      setCartProducts(items);
    }
  };

  const addToWishlist = (id: string | number): void => {
    if (!wishList.includes(id)) {
      setWishList((pre) => [...pre, id]);
      // openWistlistModal();
    } else {
      setWishList((pre) => pre.filter((elm) => elm != id));
    }
  };

  const removeFromWishlist = (id: string | number): void => {
    if (wishList.includes(id)) {
      setWishList((pre) => [
        ...pre.filter((elm) => elm != id),
      ]);
    }
  };

  const addToCompareItem = (id: string | number): void => {
    if (!compareItem.includes(id)) {
      setCompareItem((pre) => [...pre, id]);
    }
  };

  const removeFromCompareItem = (
    id: string | number
  ): void => {
    if (compareItem.includes(id)) {
      setCompareItem((pre) => [
        ...pre.filter((elm) => elm != id),
      ]);
    }
  };

  const isAddedtoWishlist = (
    id: string | number
  ): boolean => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };

  const isAddedtoCompareItem = (
    id: string | number
  ): boolean => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };

  // load cart from localStorage
  useEffect(() => {
    const items = JSON.parse(
      localStorage.getItem("cartList") || "[]"
    );
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  // persist cart
  useEffect(() => {
    localStorage.setItem(
      "cartList",
      JSON.stringify(cartProducts)
    );
  }, [cartProducts]);

  // load wishlist
  useEffect(() => {
    const items = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  // persist wishlist
  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishList)
    );
  }, [wishList]);

  const contextElement: ContextType = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
  };

  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
