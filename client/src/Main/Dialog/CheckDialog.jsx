import { useContext, useCallback } from "react";
import { MyContext } from "../../Context";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import axios from "axios";
import { useHandleOpen } from "./../../CustomHook";

const CheckDialog = () => {
  const { state, dispatch } = useContext(MyContext);

  const [, handleOpen] = useHandleOpen(false, () => {
    dispatch({ type: "setCheckDialog", payload: { isOpen: false } });
  });

  const submitForm = useCallback(() => {
    axios
      .post(
        state.checkDialog.link,
        {
          folder_id: state.selectedFolder,
          file_id: state.selectedFile.id,
          file_favorites: state.selectedFile.fav,
          file_shared: state.selectedFile.sha,
          data_id: state.selectedData.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        handleOpen();
        let stateType;
        if (res.data[2] === "folder") {
          stateType = "folderState";
        } else if (res.data[2] === "file") {
          stateType = "fileState";
        } else {
          stateType = "dataState";
        }

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
  }, [state]);

  return (
    <Dialog
      open={state.checkDialog.isOpen}
      onClose={handleOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {state.checkDialog.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {state.checkDialog.text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen}>취소</Button>
        <Button onClick={submitForm}>확인</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckDialog;
