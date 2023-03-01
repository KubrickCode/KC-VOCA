import axios from "axios";
import { useState, useEffect } from "react";
import Layout from "./Layout";
import Sign from "./Logoff/Sign";

function App() {
  const [isLogin, setAuth] = useState(false);

  useEffect(() => {
    async function fetchIsLogin() {
      try {
        const res = await axios.get("http://localhost:3000/signpage/islogin", {
          withCredentials: true,
        });
        setAuth(res.data);
      } catch (err) {
        console.error("Error fetching data: ", err);
      }
    }
    fetchIsLogin();
  }, []);

  return <div>{isLogin ? <Layout /> : <Sign />}</div>;
}

export default App;
