import { Suspense, useEffect, useState } from "react";
import Layout from "./Layout";
import Sign from "./Logoff/Sign";
import { usePersistStore } from "./State/GlobalStore";
import LoadingOverlay from "./Loading";

import { useGetAxios } from "./UseQuery";

const App = () => {
  const theme = usePersistStore((state) => !state.theme);
  const url = import.meta.env.VITE_SERVER_HOST;
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data } = useGetAxios(url + "/signpage/islogin", {
    enabled: shouldFetch,
  });

  useEffect(() => {
    const backgroundColor = theme ? "hsl(0, 0%, 20%)" : "#fff";
    document.body.style.backgroundColor = backgroundColor;
  }, [theme]);

  useEffect(() => {
    if (!shouldFetch) {
      setShouldFetch(true);
    }
  }, [shouldFetch]);

  return (
    <Suspense fallback={<LoadingOverlay />}>
      {data ? <Layout /> : <Sign />}
    </Suspense>
  );
};

export default App;
