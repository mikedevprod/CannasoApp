import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      nombre: null,
      rol: null,
      estaAutenticado: false,

      setUsuario: ({ nombre, rol }) => set({ nombre, rol, estaAutenticado: true }),
      limpiarUsuario: () => set({ nombre: null, rol: null, estaAutenticado: false }),
    }),
    {
      name: 'auth-storage', // Nombre para el localStorage
    }
  )
);

export default useAuthStore;
