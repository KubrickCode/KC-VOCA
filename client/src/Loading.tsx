import CircularProgress from "@mui/material/CircularProgress";

const LoadingOverlay = () => (
  <div
    style={{
      height: "100%",
      width: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      pointerEvents: "auto",
    }}
  >
    <CircularProgress
      color="primary"
      size={80}
      thickness={5}
      style={{ pointerEvents: "none" }}
    />
  </div>
);

export default LoadingOverlay;
