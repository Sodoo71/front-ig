import { Post } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, MessageCircle, Bookmark, Send } from "lucide-react";
import { useAxios } from "../hooks/useAxios";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";
dayjs.extend(relativeTime);

export const PostCard = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [totalComments, setTotalComments] = useState(3);

  const axios = useAxios();

  const [text, setText] = useState("");
  const [comments, setComments] = useState(post.comments);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const userId = user._id;
      setIsLiked(post.likes.some((like) => like.createdBy._id === userId));
    }
  }, [user]);

  const handleSubmitComment = async () => {
    const response = await axios.post(`/posts/${post._id}/comments`, { text });

    if (response.status === 200) {
      setText("");
      setComments([...comments, response.data]);
    } else {
      toast.error("Алдаа гарлаа");
    }
  };

  return (
    <div key={post._id} className="mb-4 border-b py-4">
      <div className="flex justify-between">
        <Link href={`/${post.createdBy.username}`} className="flex gap-2 text">
          <div className="uppercase bg-gray-300 h-8 w-8 rounded-full flex items-center justify-center text-gray-600 font-bold">
            {" "}
            {post.createdBy?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="font-semibold">{post.createdBy?.username}</span>
        </Link>
        <div className="text-xs text-gray-400 ml-2">
          {dayjs(post.createdAt).fromNow()}
        </div>
      </div>
      <img
        src={post.imageUrl}
        alt=""
        className="w-full -h-96 object-cover rounded-md p-4"
      />
      <div className="flex gap-2">
        <div
          className="hover:opacity-60 cursor-pointer"
          onClick={async () => {
            const response = await axios.post(`/posts/${post._id}/like`);
            const liked = response.data.isLiked;
            setIsLiked(liked);
            setLikeCount((c) => (liked ? c + 1 : c - 1));
          }}
        >
          {isLiked ? (
            <Heart stroke="red" size={20} />
          ) : (
            <Heart size={20} />
          )}
          <div className="flex">{likeCount}</div>
        </div>
        <MessageCircle
          className="cursor-pointer hover:text-blue-500"
          size={20}
        />
        <Send className="cursor-pointer hover:text-blue-500" size={20} />
        <div>
          <Bookmark className="cursor-pointer hover:text-blue-500" size={20} />
        </div>
      </div>
      <hr />
      <Link href={`/${post.createdBy.username}`}>
        <b>{post.createdBy.username}</b>
      </Link>{" "}
      {post.description}
      {comments.slice(0, totalComments).map((comment) => (
        <div key={comment._id}>
          <b>{comment.createdBy.username}: </b>
          {comment.text}
        </div>
      ))}
      {comments.length > 3 && (
        <div
          onClick={() => {
            setTotalComments(100);
          }}
          className="hover:underline cursor-pointer"
        >
          View all comments
        </div>
      )}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
          className="w-full resize-none"
          rows={1}
        />
        {text.length > 0 && (
          <div
            onClick={handleSubmitComment}
            className="absolute hover:underline cursor-pointer right-0 top-0 font-bold"
          >
            Post
          </div>
        )}
      </div>
    </div>
  );
};
