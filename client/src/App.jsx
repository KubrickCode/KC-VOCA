import axios from "axios";
import { useState, useEffect } from "react";
import Layout from "./Layout";
import Sign from "./Logoff/Sign";
import { ThemeContext } from "./Context";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("kcvoca_theme");
    return savedTheme || "light";
  });

  const url = "http://localhost:3000";

  useEffect(() => {
    const fetchIsLogin = async () => {
      try {
        const res = await axios.get(`${url}/signpage/islogin`, {
          withCredentials: true,
        });
        setIsLogin(res.data);
      } catch (err) {
        console.error("Error fetching data: ", err);
      }
    };
    fetchIsLogin();
  }, []);

  useEffect(() => {
    const backgroundColor = theme === "dark" ? "hsl(0, 0%, 20%)" : "#fff";
    window.localStorage.setItem("kcvoca_theme", theme);
    document.body.style.backgroundColor = backgroundColor;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, url }}>
      {isLogin ? <Layout /> : <Sign />}
    </ThemeContext.Provider>
  );
};

export default App;
