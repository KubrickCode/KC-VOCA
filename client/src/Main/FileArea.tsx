import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileDial from "./Dialog/FileDial";
import { usePersistStore } from "../State/GlobalStore";
import { useMainStore } from "../State/MainStore";
import { useGetAxios } from "../UseQuery";
import { Item } from "../Style/MUIStyle";
import LoadingOverlay from "../Loading";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { File } from "../ComponentsType";

const FileArea = () => {
  const url = import.meta.env.VITE_SERVER_HOST;
  const theme = usePersistStore((state) => !state.theme);

  const state = useMainStore((state) => state);
  const { data } = useGetAxios(
    `${url}/getdata/get_file/${state.selectedFolder}`,
    "getFile"
  );

  if (data.length > 0) {
    return (
      <Suspense fallback={<LoadingOverlay />}>
        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
          columns={{ xs: 4, sm: 6, md: 10 }}
          sx={{ clear: "right" }}
        >
          {data.map((file: File) => (
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
      </Suspense>
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
  const navigate = useNavigate();

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
          navigate(`/load/${file_id}`);
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
