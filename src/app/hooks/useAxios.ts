import realAxios from "axios";
import { useUser } from "../providers/UserProvider";

export const useAxios = () => {
  const { token } = useUser();

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = "Bearer " + token;

  const axios = realAxios.create({
    baseURL: "http://localhost:5500",
    headers,
  });

  return axios;
};
