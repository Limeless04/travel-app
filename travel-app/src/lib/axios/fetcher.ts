import { apiClient } from "./client";

const fetcher = async (url: string) => {
  const response = await apiClient.get(url);
  return response.data;
};

export default fetcher;
