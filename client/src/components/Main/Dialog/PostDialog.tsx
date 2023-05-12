import { useState, useEffect } from "react";
import { useMainStore } from "../../../Store/MainStore";
import { useQueryClient } from "react-query";
import { usePersistStore } from "../../../Store/GlobalStore";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Alert,
} from "@mui/material";
import { useQueryPatch } from "../../../ReactQuery/UseQuery";

const PostDialog = () => {
  const state = useMainStore((state) => state);
  const { mutate: addFolder } = useQueryPatch("/folders", "post");
  const { mutate: addWords } = useQueryPatch("/words", "post");
  const { mutate: renameFolder } = useQueryPatch(
    `/folders/${state.selectedFolder}`,
    "patch"
  );
  const { mutate: renameWords } = useQueryPatch(
    `/words/${state.selectedFile.id}`,
    "patch"
  );
  const { mutate: addData } = useQueryPatch("/word-data", "post");
  const { mutate: changeData } = useQueryPatch(
    `/word-data/${state.selectedData.id}`,
    "patch"
  );
  const { mutate: changeUser } = useQueryPatch("/user", "patch");
  const { mutate: deleteUser } = useQueryPatch("/user", "post");

  const [formData, setFormData] = useState({
    value1: "",
    value2: "",
    word: "",
    meaning: "",
    example_sentence: "",
    example_sentence_meaning: "",
  });
  const [submitBtn, setSubmitBtn] = useState(true);
  const queryClient = useQueryClient();
  const theme = usePersistStore((state) => !state.theme);
  const [errMsg, setErrMsg] = useState("");

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

  useEffect(() => {
    setFormData({
      ...formData,
      value1: "",
      value2: "",
      word: state.selectedData.word,
      meaning: state.selectedData.meaning,
      example_sentence: state.selectedData.example_sentence,
      example_sentence_meaning: state.selectedData.example_sentence_meaning,
    });
  }, [state.postDialog]);

  useEffect(() => {
    const { title } = state.postDialog;
    const { value1, value2, word } = formData;
    const formPwd = RegExp(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,18}$/
    );
    const formNick = RegExp(/^[a-zA-Z0-9가-힣]{2,10}$/);

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
      case "데이터 추가":
      case "데이터 수정":
        isValid = word.length > 0;
        setSubmitBtn(!isValid);
        break;
      default:
        isValid = value1.length > 0;
        setSubmitBtn(!isValid);
        break;
    }
  }, [formData, state.postDialog]);

  const handleOpen = () => {
    state.setPostDialog({ isOpen: false });
  };

  const submitForm = async () => {
    const { title } = state.postDialog;

    switch (title) {
      case "폴더 추가":
        addFolder(
          {
            body: {
              parent_id: state.selectedFolder,
              name: formData.value1,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("getFolder");
              state.setSnackBar({
                text: "폴더가 추가되었습니다",
                type: "success",
              });
              state.setSnackBarOpen(true);
              handleOpen();
            },
          }
        );
        break;
      case "폴더명 변경":
        renameFolder(
          { body: { name: formData.value1 } },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("getFolder");
              state.setSnackBar({
                text: "폴더명이 변경되었습니다",
                type: "success",
              });
              state.setSnackBarOpen(true);
              handleOpen();
            },
          }
        );
        break;
      case "단어장 추가":
        addWords(
          {
            body: {
              folder_id: state.selectedFolder,
              name: formData.value1,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("getWords");
              state.setSnackBar({
                text: "단어장이 추가되었습니다",
                type: "success",
              });
              state.setSnackBarOpen(true);
              handleOpen();
            },
          }
        );
        break;
      case "단어장명 변경":
        renameWords(
          { body: { name: formData.value1 } },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("getWords");
              state.setSnackBar({
                text: "단어장명이 변경되었습니다",
                type: "success",
              });
              state.setSnackBarOpen(true);
              handleOpen();
            },
          }
        );
        break;
      case "데이터 추가":
        addData(
          {
            body: {
              words_id: state.selectedFile.id,
              word: formData.word,
              meaning: formData.meaning,
              example_sentence: formData.example_sentence,
              example_sentence_meaning: formData.example_sentence_meaning,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("getData");
              state.setSnackBar({
                text: "데이터가 추가되었습니다",
                type: "success",
              });
              state.setSnackBarOpen(true);
              handleOpen();
            },
          }
        );
        break;
      case "데이터 수정":
        changeData(
          {
            body: {
              word: formData.word,
              meaning: formData.meaning,
              example_sentence: formData.example_sentence,
              example_sentence_meaning: formData.example_sentence_meaning,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("getData");
              state.setSnackBar({
                text: "데이터가 수정되었습니다",
                type: "success",
              });
              state.setSnackBarOpen(true);
              handleOpen();
            },
          }
        );
        break;
      case "닉네임 변경":
        changeUser(
          {
            body: {
              nickname: formData.value1,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("getUser");
              state.setSnackBar({
                text: "닉네임이 수정되었습니다",
                type: "success",
              });
              state.setSnackBarOpen(true);
              handleOpen();
            },
            onError: (err: any) => {
              setErrMsg(err.response.data.message);
            },
          }
        );
        break;
      case "비밀번호 변경":
        changeUser(
          {
            body: {
              prevPassword: formData.value1,
              password: formData.value2,
            },
          },
          {
            onSuccess: () => {
              state.setSnackBar({
                text: "비밀번호가 변경되었습니다",
                type: "success",
              });
              state.setSnackBarOpen(true);
              handleOpen();
            },
            onError: (error: any) => {
              setErrMsg(error.response.data.message);
            },
          }
        );
        break;
      case "정말 회원에서 탈퇴하시겠습니까?":
        deleteUser(
          {
            body: {
              password: formData.value1,
            },
          },
          {
            onSuccess: () => {
              localStorage.removeItem("token");
              location.href = "/";
            },
            onError: (error: any) => {
              setErrMsg(error.response.data.message);
            },
          }
        );
        break;
    }
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
          inputProps={{
            minLength: pwdState ? 6 : 1,
            maxLength: 18,
            style: toggleInputStyle,
          }}
          InputLabelProps={{
            style: toggleInputStyle,
          }}
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
            inputProps={{
              minLength: 6,
              maxLength: 18,
              style: toggleInputStyle,
            }}
            InputLabelProps={{
              style: toggleInputStyle,
            }}
          />
        )}
        {errMsg && <Alert severity="warning">{errMsg}</Alert>}
      </div>
    );
  };

  const dataContent = () => {
    return (
      <div>
        <TextField
          autoFocus
          margin="dense"
          id="word"
          type="text"
          value={formData.word}
          label="단어"
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, word: e.target.value });
          }}
          inputProps={{ minLength: 1, maxLength: 100, style: toggleInputStyle }}
          InputLabelProps={{
            style: toggleInputStyle,
          }}
          multiline={true}
        />
        <TextField
          margin="dense"
          id="meaning"
          type="text"
          label="단어 뜻"
          value={formData.meaning}
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, meaning: e.target.value });
          }}
          inputProps={{ maxLength: 100, style: toggleInputStyle }}
          InputLabelProps={{
            style: toggleInputStyle,
          }}
          multiline={true}
        />
        <TextField
          margin="dense"
          id="example_sentence"
          type="textarea"
          label="예문"
          value={formData.example_sentence}
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({ ...formData, example_sentence: e.target.value });
          }}
          inputProps={{ maxLength: 1000, style: toggleInputStyle }}
          InputLabelProps={{
            style: toggleInputStyle,
          }}
          multiline={true}
        />
        <TextField
          margin="dense"
          id="example_sentence_meaning"
          type="textarea"
          label="예문 뜻"
          value={formData.example_sentence_meaning}
          fullWidth
          variant="standard"
          onChange={(e) => {
            setFormData({
              ...formData,
              example_sentence_meaning: e.target.value,
            });
          }}
          inputProps={{ maxLength: 1000, style: toggleInputStyle }}
          InputLabelProps={{
            style: toggleInputStyle,
          }}
          multiline={true}
        />
      </div>
    );
  };

  return (
    <Dialog open={state.postDialog.isOpen} onClose={handleOpen}>
      <DialogTitle sx={toggleStyle}>{state.postDialog.title}</DialogTitle>
      <DialogContent sx={toggleStyle}>
        {state.postDialog.content === "basic" ? basicContent() : dataContent()}
      </DialogContent>
      <DialogActions sx={toggleStyle}>
        <Button onClick={handleOpen} sx={toggleBtnStyle}>
          닫기
        </Button>
        <Button onClick={submitForm} disabled={submitBtn} sx={toggleBtnStyle}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostDialog;
