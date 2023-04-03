import { useState, useEffect } from "react";
import Layout from "./Layout";
import Sign from "./Logoff/Sign";
import { useAxiosHook } from "./CustomHooks";
import { useGlobalStore, usePersistStore } from "./State/GlobalStore";
import LoadingOverlay from "./Loading";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const theme = usePersistStore((state) => !state.theme);
  const isLoading = useGlobalStore((state) => state.isLoading);
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const url = import.meta.env.VITE_SERVER_HOST;
  const { useAxios } = useAxiosHook();

  useEffect(() => {
    const fetchIsLogin = async () => {
      const data = await useAxios(
        "get",
        `${url}/signpage/islogin`,
        setIsLoading
      );
      setIsLogin(data);
      setIsFetching(false);
    };
    fetchIsLogin();
  }, []);

  useEffect(() => {
    const backgroundColor = theme ? "hsl(0, 0%, 20%)" : "#fff";
    document.body.style.backgroundColor = backgroundColor;
  }, [theme]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: isLoading ? "auto" : "none",
        }}
      />
      {isFetching ? <LoadingOverlay /> : isLogin ? <Layout /> : <Sign />}
    </>
  );
};

export default App;
