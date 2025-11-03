// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type UserResponse = {
  user: {
    _id: string;
    username: string;
    fullname: string;
    email: string | null;
    phone: string | null;
    followersCount: number;
    followingCount: number;
  };
  isFollowing: boolean;
};

export type FollowResponse = {
  isfollow: boolean;
  followersCount: number;
};

export type UserPostsResponse = {
  posts: Array<{
    _id: string;
    imageUrl: string;
    description: string;
    createdAt: string;
    createdBy: {
      _id: string;
      username: string;
    };
    likes: Array<{
      _id: string;
      createdBy: {
        _id: string;
        username: string;
      };
    }>;
    comments: Array<{
      _id: string;
      text: string;
      createdAt: string;
      createdBy: {
        _id: string;
        username: string;
      };
    }>;
  }>;
};