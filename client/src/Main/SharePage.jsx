import { useEffect, useContext } from "react";
import { MyContext, ThemeContext } from "../Context";
import FileArea from "./FileArea";
import Typography from "@mui/material/Typography";

const SharePage = () => {
  const { dispatch } = useContext(MyContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    dispatch({ type: "setSelectedFolder", payload: "get_share_file" });
  }, []);

  return (
    <>
      <Typography
        variant="h5"
        mb={3}
        sx={{ color: theme === "dark" && "lightgray" }}
      >
        공유마당
      </Typography>
      <FileArea />
    </>
  );
};

export default SharePage;
