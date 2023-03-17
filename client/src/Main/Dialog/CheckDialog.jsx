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
import { useHandleOpen } from "./../../CustomHook";
import { useAxios } from "../../Module";

const CheckDialog = () => {
  const { state, dispatch } = useContext(MainContext);
  const { setLoad } = useContext(GlobalContext);

  const [, handleOpen] = useHandleOpen(false, () => {
    dispatch({ type: "setCheckDialog", payload: { isOpen: false } });
  });

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

    dispatch({
      type: "setSnackBar",
      payload: {
        [stateType]: state.snackBar[stateType] + 1,
        text: data[0],
        type: data[1],
      },
    });
    dispatch({
      type: "setSnackBarOpen",
      payload: true,
    });
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
