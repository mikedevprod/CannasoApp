import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      nombre: null,
      numeroSocio: null,
      rol: null,
      estaAutenticado: false,

      setUsuario: ({ nombre, numeroSocio, rol }) => set({ nombre, numeroSocio, rol, estaAutenticado: true }),
      limpiarUsuario: () => set({ nombre: null, rol: null, numeroSocio: null, estaAutenticado: false }),
    }),
    {
      name: 'auth-storage', // Nombre para el localStorage
    }
  )
);

export default useAuthStore;
