import { useState, useEffect, useRef, Suspense } from "react";
import { useQueryGet, useQueryPatch } from "../UseQuery";
import LoadingOverlay from "../Loading";
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
import { EmailAlertProps, FormDialogProps } from "../components/ComponentsType";

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
  const isTokenExist = localStorage.getItem("token");
  const [errmsg, setErrMsg] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const url = import.meta.env.VITE_SERVER_HOST;
  const { data } = useQueryGet("/auth/login", "doLogin", {
    enabled: !!isTokenExist,
  });

  useEffect(() => {
    setErrMsg(data?.feedback);
  }, [data]);

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
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="비밀번호"
          type="password"
          autoComplete="current-password"
        />
        {errmsg && <Alert severity="warning">{errmsg}</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ boxShadow: 1, mt: 3, mb: 2 }}
        >
          <Typography>로그인</Typography>
        </Button>
        <Button
          fullWidth
          sx={{ boxShadow: 1, marginBottom: "10px" }}
          component={Link}
          href={`${url}/signpage/google`}
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
          href={`${url}/signpage/kakao`}
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
  const { mutate } = useQueryPatch("/getdata/find_password", "post");
  const [emailState, setEmailState] = useState({
    open: false,
    type: "warning" as AlertColor,
    text: "",
  });
  const handleClose = () => {
    setOpen(false);
  };
  // const submitForm = () => {
  //   const requsetData = {
  //     body: {
  //       email: emailRef.current!.value,
  //     },
  //   };
  //   mutate(requsetData);
  //   const newState = {
  //     ...emailState,
  //     open: true,
  //     type: data ? "success" : ("warning" as AlertColor),
  //     text: data ? "이메일이 전송되었습니다." : "존재하지 않는 이메일 입니다.",
  //   };

  //   setEmailState(newState);
  // };

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
          />
          {emailState.open && (
            <EmailAlert type={emailState.type} text={emailState.text} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
          {/* <Button onClick={submitForm}>확인</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

const EmailAlert = ({ type, text }: EmailAlertProps) => {
  return <Alert severity={type}>{text}</Alert>;
};

export default SignIn;