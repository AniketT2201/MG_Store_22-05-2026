import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  sessionId: string;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

const generateSessionId = () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items: [],
      isOpen: false,
      sessionId: generateSessionId(),
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.ProductId === product.ID);
          if (existingItem) {
            existingItem.Quantity += quantity;
          } else {
            state.items.push({
              ID: Date.now(),
              SessionId: state.sessionId,
              ProductId: product.ID,
              Quantity: quantity,
              SnapshotPrice: product.Price,
              Product: product,
            });
          }
        });
      },
      
      removeItem: (productId) => {
        set((state) => {
          state.items = state.items.filter(item => item.ProductId !== productId);
        });
      },
      
      updateQuantity: (productId, quantity) => {
        set((state) => {
          const item = state.items.find(item => item.ProductId === productId);
          if (item) {
            if (quantity <= 0) {
              state.items = state.items.filter(i => i.ProductId !== productId);
            } else {
              item.Quantity = quantity;
            }
          }
        });
      },
      
      clearCart: () => {
        set((state) => {
          state.items = [];
        });
      },
      
      openCart: () => set((state) => { state.isOpen = true; }),
      closeCart: () => set((state) => { state.isOpen = false; }),
      toggleCart: () => set((state) => { state.isOpen = !state.isOpen; }),
      
      totalItems: () => get().items.reduce((sum, item) => sum + item.Quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + (item.SnapshotPrice * item.Quantity), 0),
    })),
    {
      name: 'spfx-ecommerce-cart',
      partialize: (state) => ({ items: state.items, sessionId: state.sessionId }),
    }
  )
);
