import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileArea from "./FileArea";
import { usePersistStore } from "../State/GlobalStore";
import { useMainStore } from "../State/MainStore";
import HomeIcon from "@mui/icons-material/Home";
import { IconButton, Stack, Typography } from "@mui/material";

const SharePage = () => {
  const state = useMainStore((state) => state);
  const theme = usePersistStore((state) => !state.theme);
  const textColor = { color: theme ? "lightgray" : "hsl(0, 0%, 20%)" };
  const navigate = useNavigate();

  useEffect(() => {
    state.setSelectedFolder("get_share_file");
  }, []);

  return (
    <div style={{ marginLeft: "20px", marginTop: "100px" }}>
      <Stack direction="row" spacing={2} mb={2}>
        <IconButton
          sx={{
            ...textColor,
            border: "1px solid lightgray",
            "&:hover": {
              backgroundColor: theme ? "hsl(0, 0%, 45%)" : "lightgray",
            },
          }}
          onClick={() => {
            navigate("/");
            state.setSelectedFolder("get_recent_file");
          }}
        >
          <HomeIcon />
        </IconButton>
        <Typography variant="h5" sx={textColor} pt={1}>
          공유마당
        </Typography>
      </Stack>

      <FileArea />
    </div>
  );
};

export default SharePage;
