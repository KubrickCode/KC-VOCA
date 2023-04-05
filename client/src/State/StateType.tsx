export type PersistStoreType = {
  theme: boolean;
  toggleTheme: () => void;
};

export type GlobalType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export interface StateType {
  snackBarOpen: boolean;
  folderState: number;
  fileState: number;
  dataState: number;
  setState: number;
  snackBar: {
    text: string;
    type: string;
  };
  postDialog: {
    isOpen: boolean;
    title: string;
    label: string;
    link: string;
    content: string;
  };
  checkDialog: {
    isOpen: boolean;
    title: string;
    text: string;
    link: string;
  };
  moveDialog: {
    isOpen: boolean;
    link: string;
  };
  setDialog: {
    isOpen: boolean;
  };
  selectedFolder: string;
  moveSelectedFolder: string;
  selectedFile: {
    id: null | number;
    fav: number;
    sha: number;
  };
  selectedData: {
    id: null | number;
    voca: string;
    voca_mean: string;
    exam: string;
    exam_mean: string;
  };
  user: {
    email: string;
    nickname: string;
  };
  setSnackBarOpen: (snackBarOpen: boolean) => void;
  setSetState: (setState: number) => void;
  setFolderState: (folderState: number) => void;
  setFileState: (fileState: number) => void;
  setDataState: (dataState: number) => void;
  setSnackBar: (snackBar: { text: string; type: string }) => void;
  setPostDialog: (postDialog: Partial<StateType["postDialog"]>) => void;
  setCheckDialog: (checkDialog: Partial<StateType["checkDialog"]>) => void;
  setMoveDialog: (moveDialog: Partial<StateType["moveDialog"]>) => void;
  setSetDialog: (setDialog: Partial<StateType["setDialog"]>) => void;
  setSelectedFolder: (selectedFolder: string) => void;
  setMoveSelectedFolder: (moveSelectedFolder: string) => void;
  setSelectedFile: (selectedFile: Partial<StateType["selectedFile"]>) => void;
  setSelectedData: (selectedData: Partial<StateType["selectedData"]>) => void;
  setUser: (user: Partial<StateType["user"]>) => void;
}
