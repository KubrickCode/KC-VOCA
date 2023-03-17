import React, { useState, useEffect, useContext } from "react";
import { useAxios } from "../Module";
import { GlobalContext } from "../Context";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/roboto/500.css";

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

const theme = createTheme();

const SignInSide = () => {
  const [errmsg, setErrMsg] = useState("");
  const { url, setLoad } = useContext(GlobalContext);

  useEffect(() => {
    const fetchData = async () => {
      const data = await useAxios(
        "get",
        `${url}/signpage/login_process`,
        null,
        setLoad
      );
      setErrMsg(data.feedback);
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
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
                id="email"
                label="이메일 주소"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
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
                onClick={() =>
                  (window.location.href = `${url}/signpage/google`)
                }
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
                onClick={() => (window.location.href = `${url}/signpage/kakao`)}
              >
                <img height="20px" src={"kakao.png"} />
                <Typography color="black" sx={{ marginLeft: "10px" }}>
                  카카오 로그인
                </Typography>
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    비밀번호 찾기
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"회원가입"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default SignInSide;
