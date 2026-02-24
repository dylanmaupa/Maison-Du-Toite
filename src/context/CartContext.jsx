import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, quantity = 1, color = null) => {
    setItems(prev => {
      const key = `${product.id}-${color}`;
      const existing = prev.find(i => `${i.id}-${i.color}` === key);
      if (existing) {
        return prev.map(i =>
          `${i.id}-${i.color}` === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity, color }];
    });
  };

  const removeItem = (id, color) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.color === color)));
  };

  const updateQuantity = (id, color, quantity) => {
    if (quantity < 1) { removeItem(id, color); return; }
    setItems(prev =>
      prev.map(i => (i.id === id && i.color === color) ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
