import { Reducer } from "react";
import { db } from "../database/db";
import { CartItem, Guitar } from "../types/types";

export type CartActions =
  | {
      type: "add-to-card";
      payload: { item: Guitar };
    }
  | {
      type: "remove-from-card";
      payload: { id: Guitar["id"] };
    }
  | {
      type: "increase-quantity";
      payload: { id: Guitar["id"] };
    }
  | {
      type: "decrease-quantity";
      payload: { id: Guitar["id"] };
    }
  | {
      type: "clear-card";
    };

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};
export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

export const cartReducer: Reducer<CartState, CartActions> = (
  state: CartState,
  action: CartActions
) => {
  const MAX_QUANTITY = 5;
  const MIN_QUANTITY = 1;

  if (action.type === "add-to-card") {
    const itemExists = state.cart.find(
      (guitar: CartItem) => guitar.id === action.payload.item.id
    );
    let updatedCart: CartItem[] = [];
    if (itemExists) {
      updatedCart = state.cart.map((guitar: CartItem) => {
        if (guitar.id === action.payload.item.id) {
          if (guitar.quantity < MAX_QUANTITY) {
            return { ...guitar, quantity: guitar.quantity + 1 };
          } else {
            return guitar;
          }
        }
        return guitar;
      });
    } else {
      const newItem: CartItem = { ...action.payload.item, quantity: 1 };
      updatedCart = [...state.cart, newItem];
    }

    return {
      ...state,
      cart: updatedCart,
    };
  } else if (action.type === "remove-from-card") {
    const updatedCart = state.cart.filter(
      (guitar: CartItem) => guitar.id !== action.payload.id
    );
    return {
      ...state,
      cart: updatedCart,
    };
  } else if (action.type === "increase-quantity") {
    const updatedCart = state.cart.map((guitar: CartItem) => {
      if (guitar.id === action.payload.id && guitar.quantity < MAX_QUANTITY) {
        return { ...guitar, quantity: guitar.quantity + 1 };
      }
      return guitar;
    });
    return {
      ...state,
      cart: updatedCart,
    };
  } else if (action.type === "decrease-quantity") {
    const updatedCart = state.cart.map((guitar: CartItem) => {
      if (guitar.id === action.payload.id && guitar.quantity > MIN_QUANTITY) {
        return { ...guitar, quantity: guitar.quantity - 1 };
      }
      return guitar;
    });
    return {
      ...state,
      cart: updatedCart,
    };
  } else if (action.type === "clear-card") {
    return {
      ...state,
      cart: [],
    };
  }

  return state; // Retorna el estado original para cualquier acción no reconocida
};
