import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import { useMainStore } from "../../State/MainStore";
import { usePostAxios } from "../../UseQuery";

const CheckDialog = () => {
  const state = useMainStore((state) => state);

  const { mutate } = usePostAxios(state.checkDialog.link);

  const handleOpen = () => {
    state.setCheckDialog({ isOpen: false });
  };

  const submitForm = () => {
    const requsetData = {
      body: {
        folder_id: state.selectedFolder,
        file_id: state.selectedFile.id,
        file_favorites: state.selectedFile.fav,
        file_shared: state.selectedFile.sha,
        data_id: state.selectedData.id,
      },
    };
    mutate(requsetData, {
      onSuccess: (data) => {
        state.setSnackBar({
          text: data[0],
          type: data[1],
        });

        if (data[2] === "folder") {
          state.setFolderState(state.folderState + 1);
        } else if (data[2] === "file") {
          state.setFileState(state.fileState + 1);
        } else if (data[2] === "data") {
          state.setDataState(state.dataState + 1);
        } else {
          state.setSetState(state.setState + 1);
        }
        state.setSnackBarOpen(true);

        if (data[3]) {
          state.setSelectedFolder(data[3]);
        }
        handleOpen();
      },
    });
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
