import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { GlobalContext } from "../Context";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
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
  const [btnState, setBtnState] = useState(true);
  const { url, setLoad } = useContext(GlobalContext);

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
    const form = event.target;
    const email = form.email.value;
    const nickname = form.nickname.value;

    event.preventDefault();
    setLoad(true);

    try {
      await axios.post(`${url}/signpage/check_duplicate`, {
        email,
        nickname,
      });
      form.submit();
    } catch (error) {
      const duplicates = error.response.data.duplicates;
      if (duplicates.email) {
        setErrMsg("이미 존재하는 이메일입니다");
      }
      if (duplicates.nickname) {
        setErrMsg("이미 존재하는 닉네임입니다");
      }
    }
    setLoad(false);
  };

  useEffect(() => {
    const formEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const formPwd = RegExp(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,18}$/
    );
    const formNick = RegExp(/^[a-zA-Z0-9가-힣]{2,10}$/);

    setFormErrors({
      ...formErrors,
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
  }, [formData, formErrors, setBtnState]);

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
              error={formErrors.emailError && true}
              helperText={formErrors.emailMsg}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="비밀번호(6~18자 영문+숫자+특수문자)"
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
              label="닉네임(2~10자 한글,영문,숫자 가능)"
              error={formErrors.nickError && true}
              helperText={formErrors.nickMsg}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" sx={{ marginTop: "10px" }}>
          <Grid item>
            <Link href="/api/policy" variant="body2">
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
      <Copyright sx={{ mt: 5 }} />
    </>
  );
};

export default SignUp;
