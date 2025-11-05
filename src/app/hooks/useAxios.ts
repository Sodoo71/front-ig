import realAxios from "axios";
import { useUser } from "../providers/UserProvider";

export const useAxios = () => {
  const { token } = useUser();

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = "Bearer " + token;

  const axios = realAxios.create({
    baseURL: "https://back-ig.vercel.app/",
    headers,
  });

  return axios;
};
