import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import MySpeedDial from "./Dialog/SpeedDial";
import FileArea from "./FileArea";
import FolderArea from "./FolderArea";
import { Item } from "../Style/MUIStyle";
import MoveDial from "./Dialog/MoveDialog";
import { ThemeContext } from "../Context";
import { useContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const Content = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const matches = useMediaQuery("(max-width:768px)");

  return (
    <>
      <Grid container spacing={2} mt={10}>
        <Grid xs={matches ? 12 : 3}>
          <Item
            sx={{
              backgroundColor: isDark ? "hsl(0, 0%, 30%)" : "white",
            }}
          >
            <FolderArea />
          </Item>
        </Grid>
        <Grid xs={matches ? 12 : 9}>
          <Item
            sx={{
              backgroundColor: isDark ? "hsl(0, 0%, 30%)" : "white",
            }}
          >
            <FileArea />
          </Item>
        </Grid>
      </Grid>
      <Box
        sx={{
          height: 320,
          transform: "translateZ(0px)",
          flexGrow: 1,
          position: "fixed",
          bottom: "100px",
          right: "50px",
        }}
      >
        <MySpeedDial />
        <MoveDial />
      </Box>
    </>
  );
};

export default Content;
