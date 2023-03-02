import { MyContext } from "../../Context";
import { useHandleOpen } from "./../../CustomHook";
import FolderArea from "../FolderArea";
import { useContext } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import axios from "axios";

const MoveDial = () => {
  const { state, dispatch } = useContext(MyContext);

  const [, handleOpen] = useHandleOpen(false, () => {
    dispatch({ type: "setMoveDialog", payload: { isOpen: false } });
  });

  const submitForm = () => {
    axios
      .post(
        state.moveDialog.link,
        {
          folder_id: state.selectedFolder,
          file_id: state.selectedFile.id,
          parent_folder: state.moveSelectedFolder,
        },
        { withCredentials: true }
      )
      .then((res) => {
        handleOpen();
        const stateType =
          res.data[2] === "folder" ? "folderState" : "fileState";

        dispatch({
          type: "setSnackBar",
          payload: {
            isOpen: true,
            text: res.data[0],
            type: res.data[1],
            [stateType]: state.snackBar[stateType] + 1,
          },
        });
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
