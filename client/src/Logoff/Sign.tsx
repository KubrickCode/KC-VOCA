import { useState, useMemo } from "react";
import Signin from "./Signin";
import Signup from "./Signup";
import {
  createTheme,
  ThemeProvider,
  Box,
  Tabs,
  Tab,
  CssBaseline,
  Grid,
  Paper,
} from "@mui/material";
import { CenteredTabsProps } from "../ComponentsType";

const CenteredTabs = ({ value, handleChange }: CenteredTabsProps) => {
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs value={value} onChange={handleChange} variant="fullWidth">
        <Tab label="로그인" />
        <Tab label="회원가입" />
      </Tabs>
    </Box>
  );
};

const theme = createTheme();

const Sign = () => {
  const [value, setValue] = useState(0);
  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const renderForm = useMemo(
    () => (value === 0 ? <Signin /> : <Signup />),
    [value]
  );

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
              my: 1,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CenteredTabs handleChange={handleChange} value={value} />
            {renderForm}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Sign;
