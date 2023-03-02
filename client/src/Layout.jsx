import * as React from "react";
import { useState, useReducer } from "react";
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
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Content from "./Main/Content";
import PostDialog from "./Main/Dialog/PostDialog";
import CheckDialog from "./Main/Dialog/CheckDialog";
import MySnackBar from "./Main/Dialog/MySnackbar";
import { MyContext } from "./Context";
import { Route, Routes } from "react-router-dom";
import { initialState, reducer } from "./Reducer";
import { useHandleOpen } from "./CustomHook";
import {
  darkTheme,
  drawerWidth,
  Main,
  AppBar,
  DrawerHeader,
} from "./Style/MUIStyle";

const PersistentDrawerLeft = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();
  const [open, handleOpen, setOpen] = useHandleOpen(false, () => {
    setOpen(!open);
  });

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
              <Typography variant="h6" noWrap component="div">
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
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="설정" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ShareIcon />
                </ListItemIcon>
                <ListItemText primary="공유마당" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="문의하기" />
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
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </ListItem>
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Routes>
            <Route path="/" element={<Content />} />
          </Routes>
        </Main>
      </Box>
      <MySnackBar />
      <PostDialog />
      <CheckDialog />
    </MyContext.Provider>
  );
};

export default PersistentDrawerLeft;
