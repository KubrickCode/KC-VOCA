import { useEffect, useContext } from "react";
import { MainContext, GlobalContext } from "../Context";
import FileArea from "./FileArea";
import Typography from "@mui/material/Typography";
import { IconButton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const SharePage = () => {
  const { dispatch } = useContext(MainContext);
  const { theme } = useContext(GlobalContext);
  const isDark = theme === "dark";
  const textColor = { color: isDark ? "lightgray" : "hsl(0, 0%, 20%)" };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: "setSelectedFolder", payload: "get_share_file" });
  }, []);

  return (
    <div style={{ marginLeft: "20px", marginTop: "100px" }}>
      <Stack direction="row" spacing={2} mb={2}>
        <IconButton
          sx={{
            ...textColor,
            border: "1px solid lightgray",
            "&:hover": {
              backgroundColor: isDark ? "hsl(0, 0%, 45%)" : "lightgray",
            },
          }}
          onClick={() => {
            navigate("/");
            dispatch({
              type: "setSelectedFolder",
              payload: "get_recent_file",
            });
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
