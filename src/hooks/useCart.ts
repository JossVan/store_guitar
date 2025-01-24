import { useState, useEffect, useMemo } from "react";
import { db } from "../database/db";
import type { CardItem, Guitar } from "../types/types";
const useCart = () => {
  const initialCart = (): CardItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  const MAX_QUANTITY = 5;
  const MIN_QUANTITY = 1;
  function addToCart(item: Guitar) {
    const itemExists = cart.findIndex(
      (guitar: CardItem) => guitar.id === item.id
    );
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_QUANTITY) return;
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      const newItem: CardItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id: Guitar["id"]) {
    const updatedCart = cart.filter((guitar: CardItem) => guitar.id !== id);
    setCart(updatedCart);
  }

  function increaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((guitar: CardItem) => {
      if (guitar.id === id && guitar.quantity <= MAX_QUANTITY) {
        guitar.quantity++;
      }
      return guitar;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((guitar) => {
      if (guitar.id === id && guitar.quantity > MIN_QUANTITY) {
        guitar.quantity--;
      }
      return guitar;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  const cartTotal = useMemo(
    () =>
      cart.reduce((total, guitar) => total + guitar.price * guitar.quantity, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
};

export default useCart;
