import qs from "qs";
import { useEffect } from "react";
import LoadingOverlay from "../Layout/Loading";

const Authorize = () => {
  const { token, refreshToken } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  useEffect(() => {
    localStorage.setItem("token", token as string);
    localStorage.setItem("refreshToken", refreshToken as string);
    location.href = "/";
  }, [token, refreshToken]);
  return <LoadingOverlay />;
};

export default Authorize;
