import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { ThemeContext } from "../Context";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit">KC VOCA</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const theme = createTheme();

const SignUp = () => {
  const [btnState, setBtnState] = useState(true);
  const { url, setLoad } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    nickname: "",
  });

  const [formErrors, setFormErrors] = useState({
    emailError: false,
    emailMsg: "",
    pwdError: false,
    pwdMsg: "",
    pwdError2: false,
    pwdMsg2: "",
    nickError: false,
    nickMsg: "",
  });

  const [errMsg, setErrMsg] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const nickname = form.nickname.value;
    setLoad(true);
    try {
      await axios.post(`${url}/signpage/check_duplicate`, {
        email,
        nickname,
      });
      form.submit();
      setLoad(false);
    } catch (error) {
      const duplicates = error.response.data.duplicates;
      if (duplicates.email) {
        setErrMsg("이미 존재하는 이메일입니다");
      }
      if (duplicates.nickname) {
        setErrMsg("이미 존재하는 닉네임입니다");
      }
    }
  };

  useEffect(() => {
    const formEmail = RegExp(
      /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/
    );
    const formPwd = RegExp(/^[a-zA-Z0-9]{6,18}$/);
    const formNick = RegExp(/^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,10}$/);

    setFormErrors({
      emailError: formData.email && !formEmail.test(formData.email),
      emailMsg:
        !formData.email || formEmail.test(formData.email)
          ? ""
          : "이메일 형식을 확인해 주세요",
      pwdError: formData.password && !formPwd.test(formData.password),
      pwdMsg:
        !formData.password || formPwd.test(formData.password)
          ? ""
          : "비밀번호 형식을 확인해 주세요",
      pwdError2:
        formData.password &&
        formData.password2 &&
        formData.password !== formData.password2,
      pwdMsg2:
        !formData.password2 || formData.password === formData.password2
          ? ""
          : "비밀번호가 일치하지 않습니다",
      nickError: formData.nickname && !formNick.test(formData.nickname),
      nickMsg:
        !formData.nickname || formNick.test(formData.nickname)
          ? ""
          : "닉네임 형식을 확인해 주세요",
    });

    if (
      formData.email &&
      formData.password &&
      formData.password2 &&
      formData.nickname &&
      formEmail.test(formData.email) &&
      formPwd.test(formData.password) &&
      formNick.test(formData.nickname) &&
      formData.password === formData.password2
    ) {
      setBtnState(false);
    } else {
      setBtnState(true);
    }
  }, [formData]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ backgroundColor: "white", borderRadius: "10px" }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
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
            onChange={handleChange}
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
                  autoFocus
                  error={formErrors.emailError && true}
                  helperText={formErrors.emailMsg}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="비밀번호(6~18자)"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={formErrors.pwdError && true}
                  helperText={formErrors.pwdMsg}
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
                  error={formErrors.pwdError2 && true}
                  helperText={formErrors.pwdMsg2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="nickname"
                  required
                  fullWidth
                  id="nickname"
                  label="닉네임(2~10자)"
                  error={formErrors.nickError && true}
                  helperText={formErrors.nickMsg}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/privacy_policy" variant="body2">
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

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  이미 계정이 있으신가요? 로그인 하러 가기
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
