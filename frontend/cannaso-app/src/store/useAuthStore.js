import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      nombre: null,
      numeroSocio: null,
      rol: null,
      estaAutenticado: false,

      setUsuario: ({ nombre, numeroSocio, rol }) =>
        set({ nombre, numeroSocio, rol, estaAutenticado: true }),

      limpiarUsuario: () => {
        set({ nombre: null, numeroSocio: null, rol: null, estaAutenticado: false });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
