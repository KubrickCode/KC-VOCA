import * as React from "react";
import { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { MyContext } from "../../Context";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const MySnackBar = () => {
  const { state, dispatch } = useContext(MyContext);
  const handleSnackClose = () => {
    dispatch({ type: "setSnackBarOpen", payload: false });
  };

  return (
    <Snackbar
      open={state.snackBarOpen}
      onClose={handleSnackClose}
      autoHideDuration={3000}
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
};

export default MySnackBar;
