import { create } from "zustand";

interface BitacoraStore {
  temaSeleccionado: number | null;
  setTemaSeleccionado: (id: number | null) => void;
}

export const useBitacoraStore = create<BitacoraStore>((set) => ({
  temaSeleccionado: null,
  setTemaSeleccionado: (id) => set({ temaSeleccionado: id }),
}));
