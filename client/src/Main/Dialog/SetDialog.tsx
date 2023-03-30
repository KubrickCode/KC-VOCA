import { MainContext, GlobalContext } from "../../Context";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ModeIcon from "@mui/icons-material/Mode";
import KeyIcon from "@mui/icons-material/Key";

const SetDialog = () => {
  const { state, dispatch } = useContext(MainContext);
  const { url } = useContext(GlobalContext);

  const handleOpen = () => {
    dispatch({ type: "setSetDialog", payload: { isOpen: false } });
  };

  const handleButtonClick = (
    title: string,
    label: string,
    link: string,
    content: string
  ) => {
    dispatch({
      type: "setPostDialog",
      payload: { isOpen: true, title, label, link, content },
    });
  };

  return (
    <Dialog open={state.setDialog.isOpen} onClose={handleOpen}>
      <DialogTitle>
        <Stack direction="row" spacing={1}>
          <ManageAccountsIcon />
          <Typography fontSize={"18px"}>설정</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Paper sx={{ padding: "10px" }}>
          <Stack direction="row" spacing={1}>
            <ContactPageIcon /> <Typography>회원 정보</Typography>
          </Stack>
          <p>이메일 : {state.user.email}</p>{" "}
          <p>닉네임 : {state.user.nickname}</p>
        </Paper>
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical outlined button group"
          sx={{ width: "100%", marginTop: "10px" }}
        >
          <Button
            startIcon={<LogoutIcon />}
            onClick={() => (window.location.href = `${url}/signpage/logout`)}
          >
            로그아웃
          </Button>
          <Button
            startIcon={<ModeIcon />}
            onClick={() =>
              handleButtonClick(
                "닉네임 변경",
                "변경할 닉네임",
                `${url}/modify/nickname`,
                "basic"
              )
            }
          >
            닉네임 변경
          </Button>
          <Button
            startIcon={<KeyIcon />}
            onClick={() =>
              handleButtonClick(
                "비밀번호 변경",
                "비밀번호",
                `${url}/modify/password`,
                "basic"
              )
            }
          >
            비밀번호 변경
          </Button>
          <Button
            color="warning"
            startIcon={<PersonOffIcon />}
            onClick={() =>
              handleButtonClick(
                "정말 회원에서 탈퇴하시겠습니까?",
                "비밀번호 확인",
                `${url}/delete/user`,
                "basic"
              )
            }
          >
            회원탈퇴
          </Button>
        </ButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetDialog;
