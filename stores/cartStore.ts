import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  inventory: number;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create < CartStore > ()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,
      
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === newItem.id);
        
        if (existingItem) {
          const updatedItems = items.map(item =>
            item.id === newItem.id ?
            { ...item, quantity: item.quantity + newItem.quantity } :
            item
          );
          set({
            items: updatedItems,
            totalItems: updatedItems.reduce((acc, item) => acc + item.quantity, 0),
            subtotal: updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
          });
        } else {
          const updatedItems = [...items, newItem];
          set({
            items: updatedItems,
            totalItems: updatedItems.reduce((acc, item) => acc + item.quantity, 0),
            subtotal: updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
          });
        }
      },
      
      removeItem: (id) => {
        const updatedItems = get().items.filter(item => item.id !== id);
        set({
          items: updatedItems,
          totalItems: updatedItems.reduce((acc, item) => acc + item.quantity, 0),
          subtotal: updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        });
      },
      
      updateQuantity: (id, quantity) => {
        const updatedItems = get().items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        set({
          items: updatedItems,
          totalItems: updatedItems.reduce((acc, item) => acc + item.quantity, 0),
          subtotal: updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        });
      },
      
      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 })
    }),
    {
      name: 'cart-storage'
    }
  )
);