import { useMutation, useQuery } from "react-query";
import axios from "axios";

const host = import.meta.env.VITE_SERVER_HOST;
const token = localStorage.getItem("token") ?? null;

type method = "post" | "patch" | "put";

const api = axios.create({
  baseURL: host,
  headers: {
    Authorization: token,
  },
});

export const useQueryGet = (link: string, key: string, queryOptions = {}) => {
  const queryFunc = async () => {
    const response = await api.get(link);
    return response.data;
  };

  return useQuery([key, host + link], queryFunc, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3,
    ...queryOptions,
  });
};

export const useQueryPatch = (link: string, method: method) => {
  const mutation = useMutation(async (req: any) => {
    const response = await api[method](link, req?.body);
    return response.data;
  });

  return {
    data: mutation,
    isLoading: mutation.isLoading,
    error: mutation.error,
    mutate: mutation.mutate,
  };
};

export const useQueryDelete = (link: string) => {
  const mutation = useMutation(async (_id) => {
    const response = await api.delete(`${link}/${_id}`);
    return response.data;
  });

  return {
    data: mutation,
    isLoading: mutation.isLoading,
    error: mutation.error,
    deleteMutate: mutation.mutate,
  };
};
