import FolderArea from "../FolderArea";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useAxiosHook } from "../../CustomHooks";
import { useGlobalStore } from "../../State/GlobalStore";
import { useMainStore } from "../../State/MainStore";

const MoveDial = () => {
  const state = useMainStore((state) => state);
  const { useAxios } = useAxiosHook();
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  const handleOpen = () => {
    state.setMoveDialog({ isOpen: false });
  };

  const submitForm = async () => {
    const data = await useAxios("post", state.moveDialog.link, setIsLoading, {
      folder_id: state.selectedFolder,
      file_id: state.selectedFile.id,
      parent_folder: state.moveSelectedFolder,
    });
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
