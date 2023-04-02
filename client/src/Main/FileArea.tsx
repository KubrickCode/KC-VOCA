import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { useEffect, useState, useContext } from "react";
import { MainContext, GlobalContext } from "../Context";
import { Item } from "../Style/MUIStyle";
import FileDial from "./Dialog/FileDial";
import { useAxios } from "../Module";

type File = {
  file_id: number;
  file_name: string;
  nickname: string;
  favorites: number;
  shared: number;
};

const FileArea = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { theme, url, setLoad } = useContext(GlobalContext);
  const isDark = theme === "dark";

  const { state } = useContext(MainContext);

  useEffect(() => {
    let method: string;
    let action: string;
    let body: { folder_id: string };
    const fetchFiles = async () => {
      if (Number(state.selectedFolder)) {
        method = "post";
        action = `${url}/getdata/get_file`;
        body = { folder_id: state.selectedFolder };
      } else if (
        ["get_share_file", "get_fav_file", "get_recent_file"].includes(
          state.selectedFolder
        )
      ) {
        method = "get";
        action = `${url}/getdata/${state.selectedFolder}`;
      }

      const data = await useAxios(method, action, body, setLoad);
      setFiles(data);
    };

    fetchFiles();
  }, [state.selectedFolder, state.fileState, state.folderState]);

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
            <FileBody
              key={file.file_id}
              file_id={file.file_id}
              file_name={file.file_name}
              nickname={file.nickname}
              favorites={file.favorites}
              shared={file.shared}
            />
          ))}
        </Grid>
      </>
    );
  } else {
    return (
      <Typography sx={{ color: isDark ? "lightgray" : "hsl(0, 0%, 20%)" }}>
        해당 폴더 내에 생성된 단어장이 없습니다
      </Typography>
    );
  }
};

const FileBody = ({
  file_id,
  file_name,
  nickname,
  favorites,
  shared,
}: File) => {
  const { theme } = useContext(GlobalContext);
  const isDark = theme === "dark";
  const { state, dispatch } = useContext(MainContext);
  const [open, setOpen] = useState(false);

  return (
    <Grid
      xs={2}
      sm={2}
      md={2}
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
          height: state.selectedFolder === "get_share_file" ? "230px" : "200px",
          backgroundColor: isDark ? "hsl(0, 0%, 35%)" : "white",
          color: isDark ? "lightgray" : "hsl(0, 0%, 20%)",
          textAlign: "center",
        }}
        onClick={() => {
          location.href = `/load/${file_id}`;
        }}
      >
        <div>
          <TextSnippetIcon sx={{ fontSize: 100 }} />
        </div>
        <div>
          <Typography variant="h6" gutterBottom sx={{ wordBreak: "break-all" }}>
            {file_name}
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display:
                state.selectedFolder === "get_share_file" ? "block" : "none",
            }}
          >
            by {nickname}
          </Typography>
        </div>
      </Item>
      <MoreVertIcon
        sx={{
          position: "absolute",
          right: 10,
          top: 15,
          color: isDark ? "lightgray" : "hsl(0, 0%, 20%)",
          display: state.selectedFolder === "get_share_file" ? "none" : "block",
          "&:hover": {
            backgroundColor: isDark ? "hsl(0, 0%, 45%)" : "lightgray",
            cursor: "pointer",
          },
        }}
        onClick={() => {
          dispatch({
            type: "setSelectedFile",
            payload: {
              id: file_id,
              fav: favorites,
              sha: shared,
            },
          });
          setOpen(!open);
        }}
      />
      <FileDial open={open} setOpen={setOpen} />
    </Grid>
  );
};

export default FileArea;
