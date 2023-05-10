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
  const [formData, setFormData] = useState({
    value1: "",
    value2: "",
    voca: "",
    voca_mean: "",
    exam: "",
    exam_mean: "",
  });
  const [submitBtn, setSubmitBtn] = useState(true);
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
    const { title } = state.postDialog;
    const { value1, value2, voca } = formData;
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
      case "데이터 추가" || "데이터 수정":
        isValid = voca.length > 0;
        setSubmitBtn(!isValid);
      default:
        isValid = value1.length > 0;
        setSubmitBtn(!isValid);
        break;
    }
  }, [formData]);

  const handleOpen = () => {
    state.setPostDialog({ isOpen: false });
  };

  const submitForm = async () => {
    const requsetData = {
      body: {
        formData: formData,
        folder_id: state.selectedFolder,
        file_id: state.selectedFile.id,
        data_id: state.selectedData.id,
      },
    };

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
              queryClient.invalidateQueries("getFile");
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
              queryClient.invalidateQueries("getFile");
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
    }

    // mutate(requsetData, {
    //   onSuccess: (data) => {
    //     if (
    //       state.postDialog.title === "정말 회원에서 탈퇴하시겠습니까?" &&
    //       data === "success"
    //     ) {
    //       location.reload();
    //     }
    //     handleOpen();

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
    //       queryClient.invalidateQueries("getUser");
    //     }

    //     state.setSnackBarOpen(true);
    //   },
    // });
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
          inputProps={{ minLength: 1, maxLength: 100, style: toggleInputStyle }}
          InputLabelProps={{
            style: toggleInputStyle,
          }}
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
          inputProps={{ maxLength: 100, style: toggleInputStyle }}
          InputLabelProps={{
            style: toggleInputStyle,
          }}
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
          inputProps={{ maxLength: 1000, style: toggleInputStyle }}
          InputLabelProps={{
            style: toggleInputStyle,
          }}
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
