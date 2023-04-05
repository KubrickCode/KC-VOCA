import { useEffect } from "react";
import Layout from "./Layout";
import Sign from "./Logoff/Sign";
import { useGlobalStore, usePersistStore } from "./State/GlobalStore";
import LoadingOverlay from "./Loading";

import { useGetAxios } from "./UseQuery";

const App = () => {
  const theme = usePersistStore((state) => !state.theme);
  const isLoading = useGlobalStore((state) => state.isLoading);
  const url = import.meta.env.VITE_SERVER_HOST;
  const { data } = useGetAxios(url + "/signpage/islogin");

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
      {data ? <Layout /> : <Sign />}
    </>
  );
};

export default App;
