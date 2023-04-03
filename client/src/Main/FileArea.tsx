import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Item } from "../Style/MUIStyle";
import FileDial from "./Dialog/FileDial";
import { useAxiosHook } from "../CustomHooks";
import { useGlobalStore, usePersistStore } from "../State/GlobalStore";
import { useMainStore } from "../State/MainStore";

type File = {
  file_id: number;
  file_name: string;
  nickname: string;
  favorites: number;
  shared: number;
};

const FileArea = () => {
  const { useAxios } = useAxiosHook();
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const [files, setFiles] = useState<File[]>([]);
  const url = import.meta.env.VITE_SERVER_HOST;
  const theme = usePersistStore((state) => !state.theme);

  const state = useMainStore((state) => state);

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
      const data = await useAxios(method, action, setIsLoading, body);
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
      <Typography sx={{ color: theme ? "lightgray" : "hsl(0, 0%, 20%)" }}>
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
  const theme = usePersistStore((state) => !state.theme);
  const [open, setOpen] = useState(false);

  const state = useMainStore((state) => state);

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
            backgroundColor: theme ? "hsl(0, 0%, 45%)" : "lightgray",
            cursor: "pointer",
          },
          height: state.selectedFolder === "get_share_file" ? "230px" : "200px",
          backgroundColor: theme ? "hsl(0, 0%, 35%)" : "white",
          color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
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
          color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
          display: state.selectedFolder === "get_share_file" ? "none" : "block",
          "&:hover": {
            backgroundColor: theme ? "hsl(0, 0%, 45%)" : "lightgray",
            cursor: "pointer",
          },
        }}
        onClick={() => {
          state.setSelectedFile({
            id: file_id,
            fav: favorites,
            sha: shared,
          });
          setOpen(!open);
        }}
      />
      <FileDial open={open} setOpen={setOpen} />
    </Grid>
  );
};

export default FileArea;
