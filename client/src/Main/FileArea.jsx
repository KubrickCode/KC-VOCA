import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { MyContext, ThemeContext } from "../Context";
import { Item } from "../Style/MUIStyle";
import FileDial from "./Dialog/FileDial";
import { useHandleOpen } from "./../CustomHook";

const FileArea = () => {
  const [files, setFiles] = useState([]);
  const [setSort] = useState("");
  const { theme, url } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const { state, dispatch } = useContext(MyContext);

  const [open, handleOpen, setOpen] = useHandleOpen(false, () => {
    setOpen(!open);
  });

  useEffect(() => {
    if (Number(state.selectedFolder)) {
      axios
        .post(`${url}/getdata/get_file`, {
          folder_id: state.selectedFolder,
        })
        .then((res) => {
          setFiles(res.data);
        });
    } else if (state.selectedFolder === "get_share_file") {
      axios
        .get(`${url}/getdata/${state.selectedFolder}`, {
          withCredentials: true,
        })
        .then((res) => {
          setFiles(res.data);
        });
    } else if (state.selectedFolder === "get_fave_file" || "get_recent_file") {
      axios
        .get(`${url}/getdata/${state.selectedFolder}`, {
          withCredentials: true,
        })
        .then((res) => {
          setFiles(res.data);
        });
    }
  }, [
    state.selectedFolder,
    state.snackBar.fileState,
    state.snackBar.folderState,
  ]);

  if (files.length > 0) {
    return (
      <>
        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
          columns={{ xs: 4, sm: 6, md: 10 }}
          sx={{ clear: "right" }}
        >
          {files.map((file) => (
            <Grid
              xs={2}
              sm={2}
              md={2}
              key={file.file_id}
              sx={{
                position: "relative",
              }}
            >
              <Item
                sx={{
                  "&:hover": {
                    backgroundColor: isDark ? "hsl(0, 0%, 45%)" : "lightgray",
                    cursor: "pointer",
                  },
                  height:
                    state.selectedFolder === "get_share_file"
                      ? "230px"
                      : "200px",
                  backgroundColor: isDark ? "hsl(0, 0%, 35%)" : "white",
                  color: isDark && "lightgray",
                }}
                align="center"
                onClick={() => {
                  location.href = `/load/${file.file_id}`;
                }}
              >
                <div>
                  <TextSnippetIcon sx={{ fontSize: 100 }} />
                </div>
                <div>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ wordBreak: "break-all" }}
                  >
                    {file.file_name}
                  </Typography>
                  <Typography
                    variant="h7"
                    gutterBottom
                    sx={{
                      display:
                        state.selectedFolder === "get_share_file"
                          ? "block"
                          : "none",
                    }}
                  >
                    by {file.nickname}
                  </Typography>
                </div>
              </Item>
              <MoreVertIcon
                sx={{
                  position: "absolute",
                  right: 10,
                  top: 15,
                  color: isDark && "lightgray",
                  display:
                    state.selectedFolder === "get_share_file"
                      ? "none"
                      : "block",
                  "&:hover": {
                    backgroundColor: isDark ? "hsl(0, 0%, 45%)" : "lightgray",
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  dispatch({
                    type: "setSelectedFile",
                    payload: {
                      id: file.file_id,
                      fav: file.favorites,
                      sha: file.shared,
                    },
                  });
                  setOpen(true);
                }}
              />
              <FileDial open={open} handleOpen={handleOpen} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  } else {
    return <Typography>?????? ?????? ?????? ????????? ???????????? ????????????</Typography>;
  }
};

export default FileArea;
