import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { GlobalType, PersistStoreType } from "./StateType";

const persistStore: StateCreator<PersistStoreType> = (set) => ({
  theme: true,
  toggleTheme: () => set((state) => ({ theme: !state.theme })),
});

const globalStore: StateCreator<GlobalType> = (set) => ({
  isLoading: true,
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
});

export const usePersistStore = create<PersistStoreType>(
  import.meta.env.VITE_NODE_ENV === "development"
    ? (devtools(
        persist(persistStore, {
          name: "persistStore",
        })
      ) as unknown as StateCreator<PersistStoreType>)
    : persistStore
);

export const useGlobalStore = create<GlobalType>(
  devtools(globalStore) as unknown as StateCreator<GlobalType>
);
