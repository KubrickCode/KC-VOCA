import * as React from "react";
import { useReducer, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Stack } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Content from "./Main/Content";
import PostDialog from "./Main/Dialog/PostDialog";
import CheckDialog from "./Main/Dialog/CheckDialog";
import MySnackBar from "./Main/Dialog/MySnackbar";
import VocaLoad from "./Main/VocaLoad";
import SearchPage from "./Main/SearchPage";
import SharePage from "./Main/SharePage";
import { MyContext } from "./Context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { initialState, reducer } from "./Reducer";
import { useHandleOpen } from "./CustomHook";
import {
  darkTheme,
  drawerWidth,
  Main,
  AppBar,
  DrawerHeader,
} from "./Style/MUIStyle";
import axios from "axios";
import SetDialog from "./Main/Dialog/SetDialog";

const PersistentDrawerLeft = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchValue, setSearchValue] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, handleOpen, setOpen] = useHandleOpen(false, () => {
    setOpen(!open);
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/getdata/user", {
        withCredentials: true,
      })
      .then((res) =>
        dispatch({
          type: "setUser",
          payload: { email: res.data.email, nickname: res.data.nickname },
        })
      );
  }, [state.snackBar.setState]);

  return (
    <MyContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <ThemeProvider theme={darkTheme}>
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                onClick={() => (window.location.href = "/")}
                sx={{ cursor: "pointer" }}
              >
                KC VOCA
              </Typography>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Stack direction="row" spacing={1}>
              <AccountCircleIcon />
              <Typography>{state.user.nickname}</Typography>
            </Stack>
            <IconButton onClick={handleOpen}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  dispatch({
                    type: "setSetDialog",
                    payload: { isOpen: true },
                  });
                }}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="설정" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => (window.location.href = "/share")}>
                <ListItemIcon>
                  <ShareIcon />
                </ListItemIcon>
                <ListItemText primary="공유마당" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsBrightnessIcon />
                </ListItemIcon>
                <ListItemText primary="다크모드" />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              sx={{ borderBottom: 1, borderColor: "grey.500" }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={() => {
                  navigate("/search", { state: { value: searchValue } });
                }}
              >
                <SearchIcon />
              </IconButton>
            </ListItem>
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/load/:id" element={<VocaLoad />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/share" element={<SharePage />} />
          </Routes>
        </Main>
      </Box>
      <MySnackBar />
      <PostDialog />
      <CheckDialog />
      <SetDialog />
    </MyContext.Provider>
  );
};

export default PersistentDrawerLeft;
