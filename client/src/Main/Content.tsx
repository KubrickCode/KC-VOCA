import { useMemo } from "react";
import { usePersistStore } from "../State/GlobalStore";
import { useMainStore } from "../State/MainStore";
import FolderArea from "./FolderArea";
import FileArea from "./FileArea";
import MoveDial from "./Dialog/MoveDialog";
import MySpeedDial from "./Dialog/SpeedDial";
import Grid from "@mui/material/Unstable_Grid2";
import { Item } from "../Style/MUIStyle";
import { useMediaQuery, Box } from "@mui/material";

const Content = () => {
  const theme = usePersistStore((state) => !state.theme);
  const state = useMainStore((state) => state);
  const matches = useMediaQuery("(max-width:768px)");
  const bgColor = { backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white" };

  const renderMove = useMemo(
    () => state.moveDialog.isOpen && <MoveDial />,
    [state.moveDialog.isOpen]
  );

  return (
    <>
      <Grid container spacing={2} mt={10}>
        <Grid xs={matches ? 12 : 3}>
          <Item sx={bgColor}>
            <FolderArea />
          </Item>
        </Grid>
        <Grid xs={matches ? 12 : 9}>
          <Item sx={bgColor}>
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
        {renderMove}
      </Box>
    </>
  );
};

export default Content;
