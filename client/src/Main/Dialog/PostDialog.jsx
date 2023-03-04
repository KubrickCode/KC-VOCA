import { useState, useContext, useEffect } from "react";
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
  const { state, dispatch } = useContext(MyContext);
  const [formData, setFormData] = useState({
    value1: "",
    value2: "",
    voca: "",
    voca_mean: "",
    exam: "",
    exam_mean: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      voca: state.selectedData.voca,
      voca_mean: state.selectedData.voca_mean,
      exam: state.selectedData.exam,
      exam_mean: state.selectedData.exam_mean,
    });
  }, [state.selectedData]);

  const [, handleOpen] = useHandleOpen(false, () => {
    dispatch({ type: "setPostDialog", payload: { isOpen: false } });
  });

  const submitForm = () => {
    axios
      .post(
        state.postDialog.link,
        {
          formData: formData,
          folder_id: state.selectedFolder,
          file_id: state.selectedFile.id,
          data_id: state.selectedData.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        handleOpen();
        let stateType;
        if (res.data[2] === "folder") {
          stateType = "folderState";
        } else if (res.data[2] === "file") {
          stateType = "fileState";
        } else if (res.data[2] === "data") {
          stateType = "dataState";
        } else if (res.data[2] === "set") {
          stateType = "setState";
        }

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

  const basicContent = () => {
    return (
      <div>
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
        {state.postDialog.title === "비밀번호 변경" && (
          <TextField
            margin="dense"
            id="name2"
            type="text"
            label={"새 " + state.postDialog.label}
            fullWidth
            variant="standard"
            onChange={(e) => {
              setFormData({ ...formData, value2: e.target.value });
            }}
          />
        )}
      </div>
    );
  };

  const dataContent = () => {
    return (
      <div>
        <TextField
          autoFocus
          margin="dense"
          id="voca"
          type="text"
          value={formData.voca}
          label="단어"
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, voca: e.target.value });
          }}
        />
        <TextField
          margin="dense"
          id="voca_mean"
          type="text"
          label="단어 뜻"
          value={formData.voca_mean}
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, voca_mean: e.target.value });
          }}
        />
        <TextField
          margin="dense"
          id="exam"
          type="text"
          label="예문"
          value={formData.exam}
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, exam: e.target.value });
          }}
        />
        <TextField
          margin="dense"
          id="exam_mean"
          type="text"
          label="예문 뜻"
          value={formData.exam_mean}
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, exam_mean: e.target.value });
          }}
        />
      </div>
    );
  };

  return (
    <Dialog open={state.postDialog.isOpen} onClose={handleOpen}>
      <DialogTitle>{state.postDialog.title}</DialogTitle>
      <DialogContent>
        {state.postDialog.content == "basic" ? basicContent() : dataContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen}>닫기</Button>
        <Button onClick={submitForm}>확인</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostDialog;
