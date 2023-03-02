export const initialState = {
  snackBar: {
    isOpen: false,
    text: "",
    type: "",
    folderState: 0,
    fileState: 0,
  },
  postDialog: {
    isOpen: false,
    title: "",
    label: "",
    link: "",
  },
  checkDialog: {
    isOpen: false,
    title: "",
    text: "",
    link: "",
  },
  selectedFolder: "get_recent_file",
  selectedFile: {
    id: null,
    fav: null,
    sha: null,
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
    default:
      throw new Error("Invalid action type");
  }
};

export default reducer;
