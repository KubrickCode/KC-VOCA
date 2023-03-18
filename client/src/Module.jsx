import axios from "axios";

export const useAxios = async (
  method,
  url,
  data = null,
  setLoad = null,
  resType = null
) => {
  try {
    setLoad && setLoad(true);
    let res;
    if (method === "get") {
      res = await axios.get(url, { withCredentials: true });
    } else {
      res = await axios.post(url, data, { withCredentials: true, ...resType });
    }
    setLoad && setLoad(false);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
