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
  const { mutate: moveWords } = useQueryPatch(
    `/words/move?id=${state.selectedFile.id}&folder_id=${state.moveSelectedFolder}`,
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
          onError: (err: any) => {
            state.setSnackBar({
              text: "해당 위치로 이동할 수 없습니다",
              type: "warning",
            });
            state.setSnackBarOpen(true);
          },
        }
      );
    } else {
      moveWords(
        {},
        {
          onSuccess: () => {
            state.setSnackBar({
              text: "단어장이 이동되었습니다",
              type: "success",
            });
            queryClient.invalidateQueries("getWords");
            state.setSnackBarOpen(true);
          },
        }
      );
    }
  };

  return (
    <Dialog onClose={handleOpen} open={state.moveDialog.isOpen}>
      <DialogTitle sx={toggleStyle}>선택하신 폴더 내로 이동합니다</DialogTitle>
      <FolderArea moveStatus={true} />
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
