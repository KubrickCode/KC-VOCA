import { useMainStore } from "../../../Store/MainStore";
import { usePersistStore } from "../../../Store/GlobalStore";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ModeIcon from "@mui/icons-material/Mode";
import KeyIcon from "@mui/icons-material/Key";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Stack,
  Typography,
  Paper,
  ButtonGroup,
} from "@mui/material";
import { useQueryGet } from "../../../ReactQuery/UseQuery";

const SetDialog = () => {
  const state = useMainStore((state) => state);
  const url = import.meta.env.VITE_SERVER_HOST;
  const theme = usePersistStore((state) => !state.theme);
  const { data } = useQueryGet(`/user`, "getUser");

  const toggleStyle = {
    backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white",
    color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
  };

  const toggleBtnGroupStyle = {
    color: theme ? "lightgray" : undefined,
    borderColor: theme ? "lightgray" : undefined,
  };

  const toggleBtnStyle = {
    color: theme ? "lightgray" : "primary",
  };

  const handleOpen = () => {
    state.setSetDialog({ isOpen: false });
  };

  const handleButtonClick = (title: string, label: string, content: string) => {
    state.setPostDialog({ isOpen: true, title, label, content });
  };

  return (
    <Dialog open={state.setDialog.isOpen} onClose={handleOpen}>
      <DialogTitle sx={toggleStyle}>
        <Stack direction="row" spacing={1}>
          <ManageAccountsIcon />
          <Typography fontSize={"18px"}>설정</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={toggleStyle}>
        <Paper sx={{ padding: "10px", ...toggleStyle }}>
          <Stack direction="row" spacing={1}>
            <ContactPageIcon /> <Typography>회원 정보</Typography>
          </Stack>
          <p>이메일 : {data?.email}</p> <p>닉네임 : {data?.nickname}</p>
        </Paper>
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical outlined button group"
          sx={{ width: "100%", marginTop: "10px" }}
        >
          <Button
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.removeItem("token");
              location.href = "/";
            }}
            sx={toggleBtnGroupStyle}
          >
            로그아웃
          </Button>
          <Button
            startIcon={<ModeIcon />}
            onClick={() =>
              handleButtonClick("닉네임 변경", "변경할 닉네임", "basic")
            }
            sx={toggleBtnGroupStyle}
          >
            닉네임 변경
          </Button>
          <Button
            startIcon={<KeyIcon />}
            onClick={() =>
              handleButtonClick("비밀번호 변경", "비밀번호", "basic")
            }
            sx={toggleBtnGroupStyle}
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
                "basic"
              )
            }
            sx={toggleBtnGroupStyle}
          >
            회원탈퇴
          </Button>
        </ButtonGroup>
      </DialogContent>
      <DialogActions sx={toggleStyle}>
        <Button onClick={handleOpen} sx={toggleBtnStyle}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetDialog;
