import { method } from "../ReactQuery/UseQuery";

export type PersistStoreType = {
  theme: boolean;
  toggleTheme: () => void;
};

export type GlobalType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export interface StateType {
  isHome: boolean;
  snackBarOpen: boolean;
  snackBar: {
    text: string;
    type: string;
  };
  postDialog: {
    isOpen: boolean;
    title: string;
    label: string;
    content: string;
  };
  checkDialog: {
    isOpen: boolean;
    title: string;
    text: string;
  };
  moveDialog: {
    isOpen: boolean;
    type: string;
  };
  setDialog: {
    isOpen: boolean;
  };
  selectedFolder: string;
  moveSelectedFolder: string;
  selectedFile: {
    id: null | number;
    is_favorite: number;
    is_shared: number;
  };
  selectedData: {
    id: null | number;
    word: string;
    meaning: string;
    example_sentence: string;
    example_sentence_meaning: string;
  };
  setSnackBarOpen: (snackBarOpen: boolean) => void;
  setIsHome: (isHome: boolean) => void;
  setSnackBar: (snackBar: { text: string; type: string }) => void;
  setPostDialog: (postDialog: Partial<StateType["postDialog"]>) => void;
  setCheckDialog: (checkDialog: Partial<StateType["checkDialog"]>) => void;
  setMoveDialog: (moveDialog: Partial<StateType["moveDialog"]>) => void;
  setSetDialog: (setDialog: Partial<StateType["setDialog"]>) => void;
  setSelectedFolder: (selectedFolder: string) => void;
  setMoveSelectedFolder: (moveSelectedFolder: string) => void;
  setSelectedFile: (selectedFile: Partial<StateType["selectedFile"]>) => void;
  setSelectedData: (selectedData: Partial<StateType["selectedData"]>) => void;
}
