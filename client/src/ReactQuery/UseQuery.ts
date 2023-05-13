import { useMutation, useQuery } from "react-query";
import axios, { AxiosRequestConfig } from "axios";

const host = import.meta.env.VITE_SERVER_HOST;

export type method = "post" | "patch" | "put";

const api = axios.create({
  baseURL: host,
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

api.interceptors.request.use((config) => {
  config.headers["Authorization"] = localStorage.getItem("token");
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response || error.response.status !== 401) {
      throw error;
    }

    if (error.config.url === "/auth/refresh") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw error;
    }

    try {
      const response = await api.post("/auth/refresh", null, {
        headers: { "x-refresh-token": refreshToken },
      });

      localStorage.setItem("token", response.data.token);
      error.config.headers["Authorization"] = response.data.token;
      return api.request(error.config);
    } catch (refreshError) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      throw refreshError;
    }
  }
);

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
