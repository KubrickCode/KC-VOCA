import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileDial from "./Dialog/FileDial";
import { usePersistStore } from "../../Store/GlobalStore";
import { useMainStore } from "../../Store/MainStore";
import { Item } from "../../Style/MUIStyle";
import LoadingOverlay from "../Layout/Loading";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { File } from "../ComponentsType";
import { useQueryGet } from "../../ReactQuery/UseQuery";

const FileArea = () => {
  const theme = usePersistStore((state) => !state.theme);
  const state = useMainStore((state) => state);
  const { data } = useQueryGet(`/words/${state.selectedFolder}`, "getWords");

  if (data?.words?.length > 0) {
    return (
      <Suspense fallback={<LoadingOverlay />}>
        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
          columns={{ xs: 4, sm: 6, md: 10 }}
          sx={{ clear: "right" }}
        >
          {data.words.map((file: File) => (
            <FileBody
              key={file.id}
              id={file.id}
              name={file.name}
              nickname={file.nickname}
              is_favorite={file.is_favorite}
              is_shared={file.is_shared}
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

const FileBody = ({ id, name, nickname, is_favorite, is_shared }: File) => {
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
          navigate(`/load/${id}`);
        }}
      >
        <div>
          <TextSnippetIcon sx={{ fontSize: 100 }} />
        </div>
        <div>
          <Typography variant="h6" gutterBottom sx={{ wordBreak: "break-all" }}>
            {name}
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
            id,
            is_favorite,
            is_shared,
          });
          setOpen(!open);
        }}
      />
      <FileDial open={open} setOpen={setOpen} />
    </Grid>
  );
};

export default FileArea;
