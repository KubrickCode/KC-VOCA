// reducerStore.ts
import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { StateType } from "./StateType";

const initialMainStore = {
  snackBarOpen: false,
  folderState: 0,
  fileState: 0,
  dataState: 0,
  setState: 0,
  snackBar: {
    text: "",
    type: "",
  },
  postDialog: {
    isOpen: false,
    title: "",
    label: "",
    link: "",
    content: "",
  },
  checkDialog: {
    isOpen: false,
    title: "",
    text: "",
    link: "",
  },
  moveDialog: {
    isOpen: false,
    link: "",
  },
  setDialog: {
    isOpen: false,
  },
  selectedFolder: "get_recent_file",
  moveSelectedFolder: "",
  selectedFile: {
    id: null,
    fav: 0,
    sha: 0,
  },
  selectedData: {
    id: null,
    voca: "",
    voca_mean: "",
    exam: "",
    exam_mean: "",
  },
  user: {
    email: "",
    nickname: "",
  },
};

const mainStore: StateCreator<StateType> = (set) => ({
  ...initialMainStore,
  setSnackBarOpen: (snackBarOpen: boolean) =>
    set((state) => ({ ...state, snackBarOpen })),
  setFolderState: (folderState: number) =>
    set((state) => ({ ...state, folderState })),
  setFileState: (fileState: number) =>
    set((state) => ({ ...state, fileState })),
  setDataState: (dataState: number) =>
    set((state) => ({ ...state, dataState })),
  setSnackBar: (snackBar: { text: string; type: string }) =>
    set((state) => ({ ...state, snackBar })),
  setPostDialog: (postDialog: Partial<StateType["postDialog"]>) =>
    set((state) => ({
      ...state,
      postDialog: { ...state.postDialog, ...postDialog },
    })),
  setCheckDialog: (checkDialog: Partial<StateType["checkDialog"]>) =>
    set((state) => ({
      ...state,
      checkDialog: { ...state.checkDialog, ...checkDialog },
    })),
  setMoveDialog: (moveDialog: Partial<StateType["moveDialog"]>) =>
    set((state) => ({
      ...state,
      moveDialog: { ...state.moveDialog, ...moveDialog },
    })),
  setSetDialog: (setDialog: Partial<StateType["setDialog"]>) =>
    set((state) => ({
      ...state,
      setDialog: { ...state.setDialog, ...setDialog },
    })),
  setSelectedFolder: (selectedFolder: string) =>
    set((state) => ({ ...state, selectedFolder })),
  setMoveSelectedFolder: (moveSelectedFolder: string) =>
    set((state) => ({ ...state, moveSelectedFolder })),
  setSelectedFile: (selectedFile: Partial<StateType["selectedFile"]>) =>
    set((state) => ({
      ...state,
      selectedFile: { ...state.selectedFile, ...selectedFile },
    })),
  setSelectedData: (selectedData: Partial<StateType["selectedData"]>) =>
    set((state) => ({
      ...state,
      selectedData: { ...state.selectedData, ...selectedData },
    })),
  setUser: (user: Partial<StateType["user"]>) =>
    set((state) => ({ ...state, user: { ...state.user, ...user } })),
});

export const useMainStore = create<StateType>(
  devtools(mainStore) as unknown as StateCreator<StateType>
);
