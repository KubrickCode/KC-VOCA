import FolderArea from "../FolderArea";
import { useMainStore } from "../../../Store/MainStore";
import { useQueryClient } from "react-query";
import { usePersistStore } from "../../../Store/GlobalStore";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useQueryPatch } from "../../../ReactQuery/UseQuery";

const MoveDial = () => {
  const state = useMainStore((state) => state);
  const { mutate: moveFolder } = useQueryPatch(
    `/folders/move?id=${state.selectedFolder}&parent_id=${state.moveSelectedFolder}`,
    "patch"
  );
  const queryClient = useQueryClient();
  const theme = usePersistStore((state) => !state.theme);

  const toggleStyle = {
    backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white",
    color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
  };

  const toggleBtnStyle = {
    color: theme ? "lightgray" : "primary",
  };

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
    if (state.moveDialog.type === "folder") {
      moveFolder(
        {},
        {
          onSuccess: () => {
            state.setSnackBar({
              text: "폴더가 이동되었습니다",
              type: "success",
            });
            queryClient.invalidateQueries("getFolder");
            state.setSnackBarOpen(true);
          },
        }
      );
    }

    // mutate(requsetData, {
    //   onSuccess: (data) => {
    //     handleOpen();
    //     state.setSnackBar({
    //       text: data[0],
    //       type: data[1],
    //     });

    //     if (data[2] === "folder") {
    //       queryClient.invalidateQueries("getFolder");
    //     } else if (data[2] === "file") {
    //       queryClient.invalidateQueries("getFile");
    //     }

    //     state.setSnackBarOpen(true);
    //   },
    // });
  };

  return (
    <Dialog onClose={handleOpen} open={state.moveDialog.isOpen}>
      <DialogTitle sx={toggleStyle}>선택하신 폴더 내로 이동합니다</DialogTitle>
      <FolderArea />
      <DialogActions sx={toggleStyle}>
        <Button onClick={handleOpen} sx={toggleBtnStyle}>
          닫기
        </Button>
        <Button onClick={submitForm} autoFocus sx={toggleBtnStyle}>
          선택
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveDial;
