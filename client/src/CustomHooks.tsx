import axios from "axios";

type UseAxiosFunc = (
  method: string,
  url: string,
  setIsLoading: (isLoading: boolean) => void,
  data?: object,
  resType?: object
) => Promise<any>;

const useAxios: UseAxiosFunc = async (
  method,
  url,
  setIsLoading,
  data,
  resType
) => {
  try {
    setIsLoading(true);
    let res: { data: {} };
    if (method === "get") {
      res = await axios.get(url, { withCredentials: true });
    } else {
      res = await axios.post(url, data, { withCredentials: true, ...resType });
    }
    setIsLoading(false);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

type UseAxiosReturnType = {
  useAxios: UseAxiosFunc;
};

export const useAxiosHook = (): UseAxiosReturnType => {
  return { useAxios };
};
