import { useMutation, useQuery } from "react-query";
import axios, { AxiosRequestConfig } from "axios";

const host = import.meta.env.VITE_SERVER_HOST;
const token = localStorage.getItem("token") ?? null;

export type method = "post" | "patch" | "put";

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
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};

export const useQueryPatch = (link: string, method: method) => {
  const mutation = useMutation(
    async (req: { body?: any; config?: AxiosRequestConfig }) => {
      const response = await api[method](link, req?.body, req?.config);
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

export const useQueryDelete = (link: string) => {
  const mutation = useMutation(async (id: string) => {
    const response = await api.delete(`${link}/${id}`);
    return response.data;
  });

  return {
    data: mutation,
    isLoading: mutation.isLoading,
    error: mutation.error,
    deleteMutate: mutation.mutate,
  };
};
