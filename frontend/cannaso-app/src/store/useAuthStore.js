import { create } from 'zustand';

const useAuthStore = create((set) => ({
  nombre: null,
  rol: null,
  estaAutenticado: false,
  
  setUsuario: ({ nombre, rol }) => set({ nombre, rol, estaAutenticado: true }),
  limpiarUsuario: () => set({ nombre: null, rol: null, estaAutenticado: false }),
}));

export default useAuthStore;
