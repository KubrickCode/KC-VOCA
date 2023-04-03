import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { AlertProps, AlertColor } from "@mui/material/Alert";
import { useMainStore } from "../../State/MainStore";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const MySnackBar = () => {
  const state = useMainStore((state) => state);

  const handleSnackClose = () => {
    state.setSnackBarOpen(false);
  };

  return (
    <Snackbar
      open={state.snackBarOpen}
      onClose={handleSnackClose}
      autoHideDuration={3000}
    >
      <Alert
        onClose={handleSnackClose}
        severity={state.snackBar.type as AlertColor}
        sx={{ width: "100%" }}
      >
        {state.snackBar.text}
      </Alert>
    </Snackbar>
  );
};

export default MySnackBar;
