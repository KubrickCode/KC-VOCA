import { useState, useEffect } from "react";
import Layout from "./Layout";
import Sign from "./Logoff/Sign";
import { GlobalContext } from "./Context";
import CircularProgress from "@mui/material/CircularProgress";
import { useAxios } from "./Module";

const LoadingOverlay = () => (
  <div
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.5)",
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

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("kcvoca_theme");
    return savedTheme || "light";
  });
  const [load, setLoad] = useState(false);
  const url = import.meta.env.VITE_SERVER_HOST;

  useEffect(() => {
    const fetchIsLogin = async () => {
      const data = await useAxios(
        "get",
        `${url}/signpage/islogin`,
        null,
        setLoad
      );
      setIsLogin(data);
      setIsFetching(false);
    };
    fetchIsLogin();
  }, []);

  useEffect(() => {
    const backgroundColor = theme === "dark" ? "hsl(0, 0%, 20%)" : "#fff";
    window.localStorage.setItem("kcvoca_theme", theme);
    document.body.style.backgroundColor = backgroundColor;
  }, [theme]);

  return (
    <>
      {load && <LoadingOverlay />}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          pointerEvents: load ? "auto" : "none",
        }}
      />
      <GlobalContext.Provider value={{ theme, setTheme, url, setLoad }}>
        {isFetching ? <LoadingOverlay /> : isLogin ? <Layout /> : <Sign />}
      </GlobalContext.Provider>
    </>
  );
};

export default App;
