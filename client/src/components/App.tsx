import { Suspense, useEffect, useState } from "react";
import Layout from "./Layout/Layout";
import LoadingOverlay from "./Loading";
import Auth from "./Auth/Auth";
import { usePersistStore } from "../Store/GlobalStore";

const App = () => {
  const theme = usePersistStore((state) => !state.theme);
  const isTokenExist = localStorage.getItem("token");

  useEffect(() => {
    const backgroundColor = theme ? "hsl(0, 0%, 20%)" : "#fff";
    document.body.style.backgroundColor = backgroundColor;
  }, [theme]);

  return (
    <Suspense fallback={<LoadingOverlay />}>
      {isTokenExist ? <Layout /> : <Auth />}
    </Suspense>
  );
};

export default App;
