import { useState, useEffect } from "react";
import Layout from "./Layout";
import Sign from "./Logoff/Sign";
import { ThemeContext } from "./Context";
import CircularProgress from "@mui/material/CircularProgress";
import { useAxios } from "./Module";

const host = import.meta.env.VITE_SERVER_HOST;

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("kcvoca_theme");
    return savedTheme || "light";
  });
  const [load, setLoad] = useState(false);

  const url = host;

  useEffect(() => {
    const fetchIsLogin = async () => {
      const data = await useAxios(
        "get",
        `${url}/signpage/islogin`,
        null,
        setLoad
      );
      setIsLogin(data);
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
      {load && (
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
      )}
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
      <ThemeContext.Provider value={{ theme, setTheme, url, setLoad }}>
        {isLogin ? <Layout /> : <Sign />}
      </ThemeContext.Provider>
    </>
  );
};

export default App;
