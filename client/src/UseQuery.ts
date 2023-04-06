import axios from "axios";
import { useMutation, useQuery } from "react-query";

export const useGetAxios = (link: string, queryOptions?: {}) => {
  const queryFunc = async () => {
    const response = await axios.get(link, { withCredentials: true });
    return response.data;
  };

  return useQuery(link, queryFunc, {
    refetchOnWindowFocus: false,
    suspense: true,
    ...queryOptions,
  });
};

export const usePostAxios = (link: string) => {
  const mutation = useMutation(
    async (req: { body: object; responseType?: object }) => {
      const response = await axios.post(link, req.body, {
        withCredentials: true,
        ...req.responseType,
      });
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
