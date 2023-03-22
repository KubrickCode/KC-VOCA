import { useState, useContext, useEffect } from "react";
import { MainContext, GlobalContext } from "../../Context";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { useHandleOpen } from "./../../CustomHook";
import { useAxios } from "../../Module";

const PostDialog = () => {
  const { state, dispatch } = useContext(MainContext);
  const { setLoad } = useContext(GlobalContext);
  const [formData, setFormData] = useState({
    value1: "",
    value2: "",
    voca: "",
    voca_mean: "",
    exam: "",
    exam_mean: "",
  });
  const [submitBtn, setSubmitBtn] = useState(true);

  useEffect(() => {
    setFormData({
      ...formData,
      value1: "",
      value2: "",
      voca: state.selectedData.voca,
      voca_mean: state.selectedData.voca_mean,
      exam: state.selectedData.exam,
      exam_mean: state.selectedData.exam_mean,
    });
  }, [state.postDialog]);

  useEffect(() => {
    const { content, title } = state.postDialog;
    const { value1, value2, voca } = formData;
    const formPwd = RegExp(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,18}$/
    );
    const formNick = RegExp(/^[a-zA-Z0-9가-힣]{2,10}$/);

    if (content === "basic") {
      let isValid;
      switch (title) {
        case "비밀번호 변경":
          isValid =
            value1.length > 5 && value2.length > 5 && formPwd.test(value2);
          setSubmitBtn(!isValid);
          break;
        case "닉네임 변경":
          isValid = value1.length > 1 && formNick.test(value1);
          setSubmitBtn(!isValid);
          break;
        default:
          isValid = value1.length > 0;
          setSubmitBtn(!isValid);
          break;
      }
    } else if (content === "data") {
      let isValid = voca.length > 0;
      setSubmitBtn(!isValid);
    }
  }, [formData]);

  const [, handleOpen] = useHandleOpen(false, () => {
    dispatch({ type: "setPostDialog", payload: { isOpen: false } });
  });

  const submitForm = async () => {
    const data = await useAxios(
      "post",
      state.postDialog.link,
      {
        formData: formData,
        folder_id: state.selectedFolder,
        file_id: state.selectedFile.id,
        data_id: state.selectedData.id,
      },
      setLoad
    );
    if (
      state.postDialog.title === "정말 회원에서 탈퇴하시겠습니까?" &&
      data === "success"
    ) {
      location.reload();
    }
    handleOpen();
    const stateType = data[2] + "State";
    dispatch({
      type: "setSnackBar",
      payload: {
        text: data[0],
        type: data[1],
      },
    });
    dispatch({
      type: stateType,
      payload: state[stateType] + 1,
    });
    dispatch({
      type: "setSnackBarOpen",
      payload: true,
    });
  };

  const basicContent = () => {
    const pwdState = state.postDialog.title === "비밀번호 변경";
    return (
      <div>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          type={
            pwdState ||
            state.postDialog.title === "정말 회원에서 탈퇴하시겠습니까?"
              ? "password"
              : "text"
          }
          label={
            pwdState ? "기존 " + state.postDialog.label : state.postDialog.label
          }
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, value1: e.target.value });
          }}
          inputProps={{ minLength: pwdState ? 6 : 1, maxLength: 18 }}
        />
        {pwdState && (
          <TextField
            margin="dense"
            id="name2"
            type="password"
            label={
              "새 " + state.postDialog.label + "(6~18자 영문+숫자+특수문자)"
            }
            fullWidth
            variant="standard"
            onChange={(e) => {
              setFormData({ ...formData, value2: e.target.value });
            }}
            inputProps={{ minLength: 6, maxLength: 18 }}
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
          inputProps={{ minLength: 1, maxLength: 100 }}
          multiline={true}
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
          inputProps={{ maxLength: 100 }}
          multiline={true}
        />
        <TextField
          margin="dense"
          id="exam"
          type="textarea"
          label="예문"
          value={formData.exam}
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, exam: e.target.value });
          }}
          inputProps={{ maxLength: 1000 }}
          multiline={true}
        />
        <TextField
          margin="dense"
          id="exam_mean"
          type="textarea"
          label="예문 뜻"
          value={formData.exam_mean}
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, exam_mean: e.target.value });
          }}
          inputProps={{ maxLength: 1000 }}
          multiline={true}
        />
      </div>
    );
  };

  return (
    <Dialog open={state.postDialog.isOpen} onClose={handleOpen}>
      <DialogTitle>{state.postDialog.title}</DialogTitle>
      <DialogContent>
        {state.postDialog.content === "basic" ? basicContent() : dataContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen}>닫기</Button>
        <Button onClick={submitForm} disabled={submitBtn}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostDialog;
