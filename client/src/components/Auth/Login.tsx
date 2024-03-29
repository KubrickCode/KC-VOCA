import { useState, useRef, Suspense } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import "@fontsource/roboto/500.css";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Grid,
  Typography,
  Alert,
  AlertColor,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { EmailAlertProps, FormDialogProps } from "../ComponentsType";
import { useQueryPatch } from "../../ReactQuery/UseQuery";
import LoadingOverlay from "../Layout/Loading";

const Copyright = () => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 5 }}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        KC VOCA
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const SignIn = () => {
  const [errmsg, setErrMsg] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const url = import.meta.env.VITE_SERVER_HOST;
  const { mutate } = useQueryPatch("/auth/login", "post");

  const login = (e: any) => {
    e.preventDefault();
    mutate(
      { body: { email, password } },
      {
        onSuccess: (data) => {
          if (data.result.message) {
            setErrMsg(data.result.message);
          } else {
            localStorage.setItem("token", data.result.token);
            localStorage.setItem("refreshToken", data.result.refreshToken);
            location.href = "/";
          }
        },
        onError: (err: any) => {
          setErrMsg(err.response.data.errors[0]);
        },
      }
    );
  };

  return (
    <Suspense fallback={<LoadingOverlay />}>
      <Avatar sx={{ m: 3, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        로그인
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        action={`${url}/signpage/login_process`}
        method="post"
      >
        <TextField
          margin="normal"
          required
          fullWidth
          name="email"
          label="이메일 주소"
          type="email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          inputProps={{ maxLength: 255 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ maxLength: 20 }}
        />
        {errmsg && <Alert severity="warning">{errmsg}</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ boxShadow: 1, mt: 3, mb: 2 }}
          onClick={login}
        >
          <Typography>로그인</Typography>
        </Button>
        <Button
          fullWidth
          sx={{ boxShadow: 1, marginBottom: "10px" }}
          component={Link}
          href={`${url}/auth/google`}
        >
          <img height="20px" src={"google.png"} />
          <Typography
            color="black"
            sx={{ textTransform: "none", marginLeft: "10px" }}
          >
            Google 계정으로 로그인
          </Typography>
        </Button>
        <Button
          fullWidth
          sx={{
            boxShadow: 1,
            backgroundColor: "	#FEE500",
            marginBottom: "10px",
            "&:hover": {
              backgroundColor: "	#EDD70F",
            },
          }}
          component={Link}
          href={`${url}/auth/kakao`}
        >
          <img height="20px" src={"kakao.png"} />
          <Typography color="black" sx={{ marginLeft: "10px" }}>
            카카오 로그인
          </Typography>
        </Button>
        <Grid container justifyContent="flex-end" sx={{ marginTop: "10px" }}>
          <Grid item>
            <Link
              href="#"
              variant="body2"
              onClick={() => {
                setOpen(true);
              }}
            >
              비밀번호 찾기
            </Link>
          </Grid>
        </Grid>

        <Copyright />
      </Box>
      <FormDialog open={open} setOpen={setOpen} url={url} />
    </Suspense>
  );
};

const FormDialog = ({ open, setOpen, url }: FormDialogProps) => {
  const emailRef = useRef<HTMLInputElement>();
  const { mutate } = useQueryPatch("/auth/find-password", "post");
  const [emailState, setEmailState] = useState({
    open: false,
    type: "warning" as AlertColor,
    text: "",
  });
  const handleClose = () => {
    setOpen(false);
  };
  const submitForm = () => {
    const requsetData = {
      body: {
        email: emailRef.current!.value,
      },
    };
    mutate(requsetData, {
      onSuccess: () => {
        setEmailState({
          ...emailState,
          open: true,
          type: "success",
          text: "이메일이 전송되었습니다",
        });
      },
      onError: (err: any) => {
        setEmailState({
          ...emailState,
          open: true,
          type: "warning" as AlertColor,
          text: err.response.data.message ?? err.response.data.errors[0],
        });
      },
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>비밀번호 찾기</DialogTitle>
        <DialogContent>
          <DialogContentText>
            입력하신 이메일로 임시 비밀번호가 전송됩니다.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="이메일 주소"
            type="email"
            fullWidth
            variant="standard"
            inputRef={emailRef}
            inputProps={{ maxLength: 255 }}
          />
          {emailState.open && (
            <EmailAlert type={emailState.type} text={emailState.text} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
          <Button onClick={submitForm}>확인</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const EmailAlert = ({ type, text }: EmailAlertProps) => {
  return <Alert severity={type}>{text}</Alert>;
};

export default SignIn;
