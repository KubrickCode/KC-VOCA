import axios from "axios";

type UseAxiosFunc = (
  method: string,
  url: string,
  data?: object | null,
  setLoad?: (a: boolean) => void,
  resType?: object
) => Promise<any>;

export const useAxios: UseAxiosFunc = async (
  method,
  url,
  data,
  setLoad,
  resType
) => {
  try {
    setLoad && setLoad(true);

    let res: { data: {} };
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
