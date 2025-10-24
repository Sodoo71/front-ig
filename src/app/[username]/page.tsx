"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { User } from "../types";

const Page = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    axios
      .get(`/users/${username}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((res) => {
        if (res.status === 404) {
          setIsNotFound(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <>Loading...</>;
  if (isNotFound) return <>User with username {username} not found!</>;

  return <>Hi {user?.fullname}</>;
};

export default Page;
