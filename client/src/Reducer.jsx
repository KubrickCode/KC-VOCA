export const initialState = {
  snackBar: {
    isOpen: false,
    text: "",
    type: "",
    folderState: 0,
    fileState: 0,
    dataState: 0,
    setState: 0,
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
    fav: null,
    sha: null,
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

export const reducer = (state, action) => {
  switch (action.type) {
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
    default:
      throw new Error("Invalid action type");
  }
};

export default reducer;
