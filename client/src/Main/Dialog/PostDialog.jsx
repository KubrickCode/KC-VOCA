import { useState, useContext } from "react";
import { MyContext } from "../../Context";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import axios from "axios";
import { useHandleOpen } from "./../../CustomHook";

const PostDialog = () => {
  const [formData, setFormData] = useState({ value1: "", value2: "" });
  const { state, dispatch } = useContext(MyContext);

  const [, handleOpen, setOpen] = useHandleOpen(false, () => {
    dispatch({ type: "setPostDialog", payload: { isOpen: false } });
  });

  const submitForm = () => {
    axios
      .post(
        state.postDialog.link,
        {
          folder_id: state.selectedFolder,
          formData: formData,
          file_id: state.selectedFile.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        handleOpen();
        const stateType =
          res.data[2] === "folder" ? "folderState" : "fileState";

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
  };

  return (
    <div>
      <Dialog open={state.postDialog.isOpen} onClose={handleOpen}>
        <DialogTitle>{state.postDialog.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            label={state.postDialog.label}
            fullWidth
            variant="standard"
            onChange={(e) => {
              setFormData({ ...formData, value1: e.target.value });
            }}
          />
          {state.postDialog.title == "비밀번호 변경" && (
            <TextField
              margin="dense"
              id="name2"
              type="text"
              label={statePostDialog.label}
              fullWidth
              variant="standard"
              onChange={(e) => {
                setFormData({ ...formData, value2: e.target.value });
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen}>닫기</Button>
          <Button onClick={submitForm}>확인</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PostDialog;
