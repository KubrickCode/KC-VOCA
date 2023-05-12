import { useState, useEffect, useRef } from "react";
import { useGlobalStore } from "../../Store/GlobalStore";
import axios from "axios";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { useQueryPatch } from "../../ReactQuery/UseQuery";

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

const SignUp = () => {
  const emailInput = useRef<HTMLInputElement>();
  const passwordInput = useRef<HTMLInputElement>();
  const password2Input = useRef<HTMLInputElement>();
  const nicknameInput = useRef<HTMLInputElement>();
  const [btnState, setBtnState] = useState(true);
  const [formField, setFormField] = useState(true);
  const url = import.meta.env.VITE_SERVER_HOST;
  const { mutate } = useQueryPatch("/auth/signup", "post");

  const [formErrors, setFormErrors] = useState({
    emailError: false,
    pwdError: false,
    pwdError2: false,
    nickError: false,
    emailMsg: "",
    pwdMsg: "",
    nickMsg: "",
    pwdMsg2: "",
  });

  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    const form = e.target;
    const email = form.email.value;
    const nickname = form.nickname.value;
    const password = form.password.value;

    e.preventDefault();
    try {
      mutate(
        { body: { email, nickname, password } },
        {
          onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            location.href = "/";
          },
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const duplicates = error?.response?.data.duplicates;
        setErrMsg(
          duplicates.email
            ? "이미 존재하는 이메일입니다"
            : duplicates.nickname
            ? "이미 존재하는 닉네임입니다"
            : ""
        );
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const regEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const regPassword = RegExp(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/
    );
    const regNickname = RegExp(/^[a-zA-Z0-9가-힣]{2,10}$/);

    const email = emailInput.current!.value;
    const password = passwordInput.current!.value;
    const password2 = password2Input.current!.value;
    const nickname = nicknameInput.current!.value;

    const testEmail = regEmail.test(email);
    const testPassword = regPassword.test(password);
    const testPassword2 = password === password2;
    const testNickname = regNickname.test(nickname);

    setFormErrors({
      ...formErrors,
      emailError: Boolean(email && !testEmail),
      pwdError: Boolean(password && !testPassword),
      pwdError2: Boolean(password && password2 && !testPassword2),
      nickError: Boolean(nickname && !testNickname),
      emailMsg: !email || testEmail ? "" : "이메일 형식을 확인해 주세요",
      pwdMsg: !password || testPassword ? "" : "비밀번호 형식을 확인해 주세요",
      pwdMsg2:
        !password2 || testPassword2 ? "" : "비밀번호가 일치하지 않습니다",
      nickMsg: !nickname || testNickname ? "" : "닉네임 형식을 확인해 주세요",
    });

    const isFormValid =
      testEmail && testPassword && testNickname && testPassword2;

    setBtnState(!isFormValid);
  }, [formField]);

  return (
    <>
      <Avatar sx={{ m: 3, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        회원가입
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}
        action={`${url}/signpage/signup_process`}
        method="post"
        onInput={() => setFormField(!formField)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {errMsg && <Alert severity="warning">{errMsg}</Alert>}
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="이메일 주소"
              name="email"
              autoComplete="email"
              error={formErrors.emailError}
              helperText={formErrors.emailMsg}
              inputRef={emailInput}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="비밀번호(6~20자 영문+숫자+특수문자)"
              type="password"
              id="password"
              autoComplete="new-password"
              error={formErrors.pwdError}
              helperText={formErrors.pwdMsg}
              inputRef={passwordInput}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password2"
              label="비밀번호 확인"
              type="password"
              id="password2"
              autoComplete="new-password"
              error={formErrors.pwdError2}
              helperText={formErrors.pwdMsg2}
              inputRef={password2Input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="given-name"
              name="nickname"
              required
              fullWidth
              id="nickname"
              label="닉네임(2~10자 한글,영문,숫자 가능)"
              error={formErrors.nickError}
              helperText={formErrors.nickMsg}
              inputRef={nicknameInput}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" sx={{ marginTop: "10px" }}>
          <Grid item>
            <Link href="./privacy_policy.html" variant="body2">
              개인정보처리방침
            </Link>
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={btnState}
        >
          회원가입
        </Button>
      </Box>
      <Copyright />
    </>
  );
};

export default SignUp;
