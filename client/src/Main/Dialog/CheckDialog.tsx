import { useContext } from "react";
import { MainContext, GlobalContext } from "../../Context";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import { useAxios } from "../../Module";

const CheckDialog = () => {
  const { state, dispatch } = useContext(MainContext);
  const { setLoad } = useContext(GlobalContext);

  const handleOpen = () => {
    dispatch({ type: "setCheckDialog", payload: { isOpen: false } });
  };

  const submitForm = async () => {
    const data = await useAxios(
      "post",
      state.checkDialog.link,
      {
        folder_id: state.selectedFolder,
        file_id: state.selectedFile.id,
        file_favorites: state.selectedFile.fav,
        file_shared: state.selectedFile.sha,
        data_id: state.selectedData.id,
      },
      setLoad
    );

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
    if (data[3]) {
      dispatch({
        type: "setSelectedFolder",
        payload: data[3],
      });
    }
    handleOpen();
  };

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