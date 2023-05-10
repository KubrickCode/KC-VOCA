import { useState, useMemo, lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { usePersistStore } from "../../Store/GlobalStore";
import { useMainStore } from "../../Store/MainStore";
import LoadingOverlay from "../Loading";
import Content from "../Main/Content";
import MySnackBar from "../Main/Dialog/MySnackbar";
import SetDialog from "../Main/Dialog/SetDialog";
import PostDialog from "../Main/Dialog/PostDialog";
import CheckDialog from "../Main/Dialog/CheckDialog";
import { darkTheme, DrawerHeader } from "../../Style/MUIStyle";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import {
  Drawer,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Link,
  Stack,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
  AppBar,
} from "@mui/material";
import { useQueryGet } from "../../ReactQuery/UseQuery";

const PersistentDrawerLeft = () => {
  const url = import.meta.env.VITE_SERVER_HOST;
  const [searchValue, setSearchValue] = useState("");
  const theme = usePersistStore((state) => !state.theme);
  const toggleTheme = usePersistStore((state) => state.toggleTheme);
  const theme2 = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const state = useMainStore((state) => state);
  const VocaLoad = lazy(() => import("../Main/VocaLoad"));
  const SearchPage = lazy(() => import("../Main/SearchPage"));
  const SharePage = lazy(() => import("../Main/SharePage"));
  const { data } = useQueryGet(`/user`, "getUser");

  const handleOpen = () => setOpen(!open);

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

  const toggleStyle = {
    backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white",
    color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
  };

  return (
    <Suspense fallback={<LoadingOverlay />}>
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

      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/load/:id" element={<VocaLoad />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/share" element={<SharePage />} />
        </Routes>
      </Suspense>

      <Drawer anchor="left" open={open}>
        <DrawerHeader sx={toggleStyle}>
          <Stack direction="row" spacing={1}>
            <AccountCircleIcon />
            <Typography>{data?.nickname}</Typography>
          </Stack>
          <IconButton onClick={handleOpen}>
            {theme2.direction === "ltr" ? (
              <ChevronLeftIcon sx={toggleStyle} />
            ) : (
              <ChevronRightIcon sx={toggleStyle} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider sx={toggleStyle} />
        <List sx={{ height: "100%", ...toggleStyle }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                state.setSetDialog({ isOpen: true });
              }}
            >
              <ListItemIcon>
                <SettingsIcon sx={toggleStyle} />
              </ListItemIcon>
              <ListItemText primary="설정" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/share")}>
              <ListItemIcon>
                <ShareIcon sx={toggleStyle} />
              </ListItemIcon>
              <ListItemText primary="공유마당" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleTheme}>
              <ListItemIcon>
                <SettingsBrightnessIcon sx={toggleStyle} />
              </ListItemIcon>
              <ListItemText primary="다크모드" />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{ borderBottom: 1, borderColor: "grey.500" }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, ...toggleStyle }}
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
              <SearchIcon sx={toggleStyle} />
            </IconButton>
          </ListItem>
        </List>
      </Drawer>
      {[renderPostDial, renderCheckDial, renderSnack, renderSetDial]}
    </Suspense>
  );
};

export default PersistentDrawerLeft;
