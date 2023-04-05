import FolderArea from "../FolderArea";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useMainStore } from "../../State/MainStore";
import { usePostAxios } from "../../UseQuery";

const MoveDial = () => {
  const state = useMainStore((state) => state);
  const { mutate } = usePostAxios(state.moveDialog.link);
  const handleOpen = () => {
    state.setMoveDialog({ isOpen: false });
  };

  const requsetData = {
    body: {
      folder_id: state.selectedFolder,
      file_id: state.selectedFile.id,
      parent_folder: state.moveSelectedFolder,
    },
  };

  const submitForm = () => {
    mutate(requsetData, {
      onSuccess: (data) => {
        handleOpen();
        state.setSnackBar({
          text: data[0],
          type: data[1],
        });

        if (data[2] === "folder") {
          state.setFolderState(state.folderState + 1);
        } else if (data[2] === "file") {
          state.setFileState(state.fileState + 1);
        } else {
          state.setDataState(state.dataState + 1);
        }

        state.setSnackBarOpen(true);
      },
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
