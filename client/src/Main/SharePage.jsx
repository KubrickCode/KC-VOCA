import { useEffect, useContext } from "react";
import { MainContext, GlobalContext } from "../Context";
import FileArea from "./FileArea";
import Typography from "@mui/material/Typography";

const SharePage = () => {
  const { dispatch } = useContext(MainContext);
  const { theme } = useContext(GlobalContext);

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
