"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { User } from "../types";
import { Button } from "@/components/ui/button";

type Post = {
  id: string | number;
  imageUrl: string;
  likesCount?: number;
  commentsCount?: number;
  // ...other post fields...
};

const Page = () => {
  const { username } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();
  const [isFollow, setIsFollow] = useState(false);
  const [followCount, setFollowCount] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);
  const [hoveringFollow, setHoveringFollow] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`/users/${username}`),
          axios.get(`/users/${username}/posts`),
        ]);

        const userData = userRes.data;
        const postsData: Post[] = postsRes.data || [];

        setUser(userData);
        setPosts(postsData);
        setIsFollow(!!userData.isFollow);
        setFollowCount(Number(userData.followersCount ?? 0));
        setPostCount(postsData.length);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setIsNotFound(true);
        } else {
          console.error("Failed to load profile:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) fetch();
  }, [username, axios]);

  const handleFollow = async () => {
    try {
      const res = await axios.post(`/users/${username}/follow`);
      const newIsFollow = !!res.data.isFollow;
      // Update follower count based on toggled state
      setFollowCount((prev) => prev + (newIsFollow ? 1 : -1));
      setIsFollow(newIsFollow);
    } catch (err) {
      console.error("Follow action failed", err);
    }
  };

  if (loading) return <>Loading...</>;
  if (isNotFound)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold">User "{username}" not found</h2>
        <p className="text-sm text-gray-600 mt-2">
          The profile you requested doesn't exist.
        </p>
        <div className="mt-4">
          <Button
            onClick={() => router.back()}
            className="rounded bg-gray-200 px-4 py-2"
          >
            Go back
          </Button>
        </div>
      </div>
    );
console.log(username);
  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="mb-8">
        <div className="flex items-start gap-8">
          <div className="h-32 w-32 rounded-full bg-gray-200" />

          <div className="flex-1">
            <div className="mb-4 flex items-center gap-4">
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <div
                onMouseEnter={() => setHoveringFollow(true)}
                onMouseLeave={() => setHoveringFollow(false)}
                onClick={handleFollow}
              >
                {isFollow ? (
                  <Button
                    className={`rounded-lg px-4 py-2 ${
                      hoveringFollow
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white border text-black hover:bg-gray-100"
                    }`}
                  >
                    {hoveringFollow ? "Unfollow" : "Following"}
                  </Button>
                ) : (
                  <Button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Follow
                  </Button>
                )}
              </div>
            </div>

            <div className="mb-4 flex gap-6">
              <div>
                <span className="font-semibold">{postCount}</span> posts
              </div>
              <div>
                <span className="font-semibold">{followCount}</span> followers
              </div>
              <div>
                <span className="font-semibold">
                  {user?.followingCount ?? 0}
                </span>{" "}
                following
              </div>
            </div>

            <div>
              <h2 className="font-semibold">{user?.fullname}</h2>
              {user?.email && (
                <p className="text-sm text-gray-600">{user.email}</p>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <div>
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="relative group">
                <img
                  src={post.imageUrl}
                  alt={`post-${post.id}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      <span>{post.likesCount ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M18 10c0 3.866-3.582 7-8 7a9.96 9.96 0 01-3-.5L2 17l1.5-4A7.96 7.96 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
                      </svg>
                      <span>{post.commentsCount ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
