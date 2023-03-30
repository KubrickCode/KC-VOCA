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
}

export const initialState: StateType = {
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

export interface ActionType {
  type: string;
  payload: any;
}

export const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "setSnackBarOpen":
      return { ...state, snackBarOpen: action.payload };
    case "setSnackBar":
      return { ...state, snackBar: action.payload };
    case "setPostDialog":
      return { ...state, postDialog: action.payload };
    case "setCheckDialog":
      return { ...state, checkDialog: action.payload };
    case "setSelectedFolder":
      return { ...state, selectedFolder: action.payload };
    case "setSelectedFile":
      return { ...state, selectedFile: action.payload };
    case "setMoveDialog":
      return { ...state, moveDialog: action.payload };
    case "setMoveSelectedFolder":
      return { ...state, moveSelectedFolder: action.payload };
    case "setSelectedData":
      return { ...state, selectedData: action.payload };
    case "setSetDialog":
      return { ...state, setDialog: action.payload };
    case "setUser":
      return { ...state, user: action.payload };
    case "folderState":
      return { ...state, folderState: action.payload };
    case "fileState":
      return { ...state, fileState: action.payload };
    case "dataState":
      return { ...state, dataState: action.payload };
    case "setState":
      return { ...state, setState: action.payload };
    default:
      throw new Error("Invalid action type");
  }
};

export default reducer;
