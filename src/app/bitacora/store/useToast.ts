import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (message: string, variant?: ToastVariant, duration?: number) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],
  push: (message, variant = "info", duration = 4000) => {
    const id = ++counter;
    set((state) => ({ toasts: [...state.toasts, { id, message, variant, duration }] }));
    if (duration > 0) {
      setTimeout(() => get().dismiss(id), duration);
    }
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (msg: string, duration?: number) => useToast.getState().push(msg, "success", duration),
  error: (msg: string, duration?: number) => useToast.getState().push(msg, "error", duration),
  info: (msg: string, duration?: number) => useToast.getState().push(msg, "info", duration),
  warning: (msg: string, duration?: number) => useToast.getState().push(msg, "warning", duration),
};
