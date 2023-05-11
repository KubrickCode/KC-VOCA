import qs from "qs";
import { useEffect } from "react";
import LoadingOverlay from "../Layout/Loading";

const Authorize = () => {
  const { token } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  useEffect(() => {
    localStorage.setItem("token", token as string);
    location.href = "/";
  }, [token]);
  return <LoadingOverlay />;
};

export default Authorize;
