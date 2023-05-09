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
import { useQueryPatch } from "../../../ReactQuery/UseQuery";

const CheckDialog = () => {
  const state = useMainStore((state) => state);

  const { mutate } = useQueryPatch(state.checkDialog.link, "post");
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
          queryClient.invalidateQueries("getFolder");
        } else if (data[2] === "file") {
          queryClient.invalidateQueries("getFile");
        } else if (data[2] === "data") {
          queryClient.invalidateQueries("getData");
        } else {
          queryClient.invalidateQueries("getData");
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
