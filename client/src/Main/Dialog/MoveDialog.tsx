import { MainContext, GlobalContext } from "../../Context";
import FolderArea from "../FolderArea";
import { useContext } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useAxios } from "../../Module";

const MoveDial = () => {
  const { state, dispatch } = useContext(MainContext);
  const { setLoad } = useContext(GlobalContext);

  const handleOpen = () => {
    dispatch({ type: "setMoveDialog", payload: { isOpen: false } });
  };

  const submitForm = async () => {
    const data = await useAxios(
      "post",
      state.moveDialog.link,
      {
        folder_id: state.selectedFolder,
        file_id: state.selectedFile.id,
        parent_folder: state.moveSelectedFolder,
      },
      setLoad
    );
    handleOpen();
    const stateType = data[2] + "State";
    let payload;
    if (data[2] === "folder") {
      payload = state.folderState + 1;
    } else if (data[2] === "file") {
      payload = state.fileState + 1;
    } else {
      payload = state.dataState + 1;
    }

    dispatch({
      type: "setSnackBar",
      payload: {
        text: data[0],
        type: data[1],
      },
    });
    dispatch({
      type: stateType,
      payload,
    });
    dispatch({
      type: "setSnackBarOpen",
      payload: true,
    });
  };

  return (
    <Dialog onClose={handleOpen} open={state.moveDialog.isOpen}>
      <DialogTitle>선택하신 폴더 내로 이동합니다</DialogTitle>
      <FolderArea />
      <DialogActions>
        <Button onClick={handleOpen}>닫기</Button>
        <Button onClick={submitForm} autoFocus>
          선택
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveDial;
