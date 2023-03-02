import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import MySpeedDial from "./Dialog/SpeedDial";
import FileArea from "./FileArea";
import FolderArea from "./FolderArea";
import { Item } from "../Style/MUIStyle";
import MoveDial from "./Dialog/MoveDialog";

const Content = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={3}>
          <Item>
            <FolderArea />
          </Item>
        </Grid>
        <Grid xs={9}>
          <Item>
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
