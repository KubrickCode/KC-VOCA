import { useReducer, useState, useEffect, useContext, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
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
import { Link, Stack } from "@mui/material";
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
import { MainContext, GlobalContext } from "./Context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { initialState, reducer } from "./Reducer";
import { useHandleOpen } from "./CustomHook";
import { darkTheme, DrawerHeader } from "./Style/MUIStyle";
import AppBar from "@mui/material/AppBar";
import SetDialog from "./Main/Dialog/SetDialog";
import { useAxios } from "./Module";

const PersistentDrawerLeft = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { theme, setTheme, url, setLoad } = useContext(GlobalContext);
  const [searchValue, setSearchValue] = useState("");
  const theme2 = useTheme();
  const navigate = useNavigate();
  const [open, handleOpen, setOpen] = useHandleOpen(false, () => {
    setOpen(!open);
  });

  const {
    postDialog: { isOpen: isPostDialogOpen },
    checkDialog: { isOpen: isCheckDialogOpen },
    setDialog: { isOpen: isSetDialogOpen },
    snackBarOpen,
  } = state;

  const renderSnack = useMemo(
    () => snackBarOpen && <MySnackBar key="MySnackBar" />,
    [snackBarOpen]
  );

  const renderPostDial = useMemo(
    () => isPostDialogOpen && <PostDialog key="PostDialog" />,
    [isPostDialogOpen]
  );

  const renderCheckDial = useMemo(
    () => isCheckDialogOpen && <CheckDialog key="CheckDialog" />,
    [isCheckDialogOpen]
  );

  const renderSetDial = useMemo(
    () => isSetDialogOpen && <SetDialog key="SetDialog" />,
    [isSetDialogOpen]
  );

  useEffect(() => {
    const fetchUser = async () => {
      const data = await useAxios("get", `${url}/getdata/user`, null, setLoad);
      dispatch({
        type: "setUser",
        payload: { email: data.email, nickname: data.nickname },
      });
    };

    fetchUser();
  }, [state.setState]);

  return (
    <MainContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <AppBar>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleOpen}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{ cursor: "pointer" }}
              component={Link}
              href={"/"}
              underline={"none"}
              color={"inherit"}
            >
              KC VOCA
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>

      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/load/:id" element={<VocaLoad />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/share" element={<SharePage />} />
      </Routes>

      <Drawer anchor="left" open={open}>
        <DrawerHeader>
          <Stack direction="row" spacing={1}>
            <AccountCircleIcon />
            <Typography>{state.user.nickname}</Typography>
          </Stack>
          <IconButton onClick={handleOpen}>
            {theme2.direction === "ltr" ? (
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
            <ListItemButton onClick={() => navigate("/share")}>
              <ListItemIcon>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText primary="공유마당" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
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
              inputProps={{ maxLength: 100 }}
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
      {[renderPostDial, renderCheckDial, renderSnack, renderSetDial]}
    </MainContext.Provider>
  );
};

export default PersistentDrawerLeft;
