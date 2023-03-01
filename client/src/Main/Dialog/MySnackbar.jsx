import * as React from "react";
import { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { MyContext } from "../../Context";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MySnackBar() {
  const { state, dispatch } = useContext(MyContext);
  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch({ type: "setSnackBar", payload: { isOpen: false } });
  };

  return (
    <Snackbar
      open={state.snackBar.isOpen}
      autoHideDuration={5000}
      onClose={handleSnackClose}
    >
      <Alert
        onClose={handleSnackClose}
        severity={state.snackBar.type}
        sx={{ width: "100%" }}
      >
        {state.snackBar.text}
      </Alert>
    </Snackbar>
  );
}
