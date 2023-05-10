import { useMainStore } from "../../../Store/MainStore";
import { useQueryClient } from "react-query";
import { usePersistStore } from "../../../Store/GlobalStore";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import { useQueryDelete, useQueryPatch } from "../../../ReactQuery/UseQuery";

const CheckDialog = () => {
  const state = useMainStore((state) => state);

  const { deleteMutate: deleteFolder } = useQueryDelete("/folders");
  const { deleteMutate: deleteWords}  = useQueryDelete("/words");
  const { mutate: changeStatus } = useQueryPatch(`/words/status/${state.selectedFile.id}`,"patch");
  const queryClient = useQueryClient();
  const theme = usePersistStore((state) => !state.theme);

  const toggleStyle = {
    backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white",
    color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
  };

  const toggleInputStyle = {
    color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
  };

  const toggleBtnStyle = {
    color: theme ? "lightgray" : "primary",
  };

  const handleOpen = () => {
    state.setCheckDialog({ isOpen: false });
  };

  const submitForm = () => {
    switch (state.checkDialog.title) {
      case "폴더 삭제":
        deleteFolder(state.selectedFolder, {
          onSuccess: () => {
            queryClient.invalidateQueries("getFolder");
            handleOpen();
            state.setSnackBar({
              text: "폴더가 삭제되었습니다",
              type: "success",
            });
            state.setSnackBarOpen(true);
          },
        });
        break;
      case "단어장 삭제":
        deleteWords(String(state.selectedFile.id), {
          onSuccess: () => {
            queryClient.invalidateQueries("getWords");
            handleOpen();
            state.setSnackBar({
              text: "단어장이 삭제되었습니다",
              type: "success",
            });
            state.setSnackBarOpen(true);
          },
        });
        break;
      case "즐겨찾기 등록":
      case "즐겨찾기 해제":
        changeStatus({body:{is_favorite:state.selectedFile.is_favorite}}, {
          onSuccess: (data) => {
            queryClient.invalidateQueries("getWords");
            handleOpen();
            state.setSnackBar({
              text: data.message,
              type: "success",
            });
            state.setSnackBarOpen(true);
          },
        });
        break;
      case "단어장 공유":
      case "단어장 공유 해제":
        changeStatus({body:{is_shared:state.selectedFile.is_shared}}, {
          onSuccess: (data) => {
            queryClient.invalidateQueries("getWords");
            handleOpen();
            state.setSnackBar({
              text: data.message,
              type: "success",
            });
            state.setSnackBarOpen(true);
          },
        });
        break;
        
    }

    // mutate(requsetData, {
    //   onSuccess: (data) => {
    //     state.setSnackBar({
    //       text: data[0],
    //       type: data[1],
    //     });

    //     if (data[2] === "folder") {
    //       queryClient.invalidateQueries("getFolder");
    //     } else if (data[2] === "file") {
    //       queryClient.invalidateQueries("getFile");
    //     } else if (data[2] === "data") {
    //       queryClient.invalidateQueries("getData");
    //     } else {
    //       queryClient.invalidateQueries("getData");
    //     }
    //     state.setSnackBarOpen(true);

    //     if (data[3]) {
    //       state.setSelectedFolder(data[3]);
    //     }
    //     handleOpen();
    //   },
    // });
  };

  return (
    <Dialog
      open={state.checkDialog.isOpen}
      onClose={handleOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={toggleStyle}>
        {state.checkDialog.title}
      </DialogTitle>
      <DialogContent sx={toggleStyle}>
        <DialogContentText id="alert-dialog-description" sx={toggleInputStyle}>
          {state.checkDialog.text}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={toggleStyle}>
        <Button onClick={handleOpen} sx={toggleBtnStyle}>
          취소
        </Button>
        <Button onClick={submitForm} sx={toggleBtnStyle}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckDialog;
