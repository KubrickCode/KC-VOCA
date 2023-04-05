import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useGlobalStore } from "./State/GlobalStore";

export const useGetAxios = (link: string) => {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const queryFunc = async () => {
    setIsLoading(true);
    const response = await axios.get(link, { withCredentials: true });
    setIsLoading(false);
    return response.data;
  };

  return useQuery(["get", link], queryFunc, {
    refetchOnWindowFocus: false,
  });
};

export const usePostAxios = (link: string) => {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  const mutation = useMutation(
    async (req: { body: object; responseType?: object }) => {
      setIsLoading(true);
      const response = await axios.post(link, req.body, {
        withCredentials: true,
        ...req.responseType,
      });
      setIsLoading(false);
      return response.data;
    }
  );

  return {
    data: mutation,
    isLoading: mutation.isLoading,
    error: mutation.error,
    mutate: mutation.mutate,
  };
};
