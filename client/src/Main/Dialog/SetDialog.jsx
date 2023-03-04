import { MyContext } from "../../Context";
import { useHandleOpen } from "./../../CustomHook";
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
  const { state, dispatch } = useContext(MyContext);
  const [, handleOpen] = useHandleOpen(false, () => {
    dispatch({ type: "setSetDialog", payload: { isOpen: false } });
  });

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
            onClick={() =>
              (window.location.href = "http://localhost:3000/signpage/logout")
            }
          >
            로그아웃
          </Button>
          <Button
            startIcon={<ModeIcon />}
            onClick={() => {
              dispatch({
                type: "setPostDialog",
                payload: {
                  isOpen: true,
                  title: "닉네임 변경",
                  label: "변경할 닉네임",
                  link: "http://localhost:3000/modify/nickname",
                  content: "basic",
                },
              });
            }}
          >
            닉네임 변경
          </Button>
          <Button
            startIcon={<KeyIcon />}
            onClick={() => {
              dispatch({
                type: "setPostDialog",
                payload: {
                  isOpen: true,
                  title: "비밀번호 변경",
                  label: "비밀번호",
                  link: "http://localhost:3000/modify/password",
                  content: "basic",
                },
              });
            }}
          >
            비밀번호 변경
          </Button>
          <Button
            color="warning"
            startIcon={<PersonOffIcon />}
            onClick={() => {
              dispatch({
                type: "setPostDialog",
                payload: {
                  isOpen: true,
                  title: "정말 회원에서 탈퇴하시겠습니까?",
                  label: "비밀번호 확인",
                  link: "http://localhost:3000/delete/user",
                  content: "basic",
                },
              });
            }}
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
