import { getPostsPagination } from "@/requests/post";
import { PostType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Actions = {
  getAllPost: () => Promise<void>;
  createPost: (post: PostType) => Promise<void>;
  // deletePost: (postId: string) => Promise<void>;
  // updatePost: (post: PostType) => Promise<void>;
  // getPost: (postId: string) => Promise<void>;
  // likePost: (postId: string) => Promise<void>;
  // unlikePost: (postId: string) => Promise<void>;
  // commentPost: (postId: string, comment: string) => Promise<void>;
  // sharePost: (postId: string) => Promise<void>;
  // reportPost: (postId: string) => Promise<void>;
  // hidePost: (postId: string) => Promise<void>;
  // blockUser: (userId: string) => Promise<void>;
  // unblockUser: (userId: string) => Promise<void>;
  // getPostByUser: (userId: string) => Promise<void>;
  // getPostByType: (type: string) => Promise<void>;

  clearList: () => void;
};

type State = {
  posts: PostType[];
  page: number;
  limit: number;
};
const defautValueStates: State = {
  posts: [],
  page: 1,
  limit: 10,
};
//create store using Zustand
export const usePostStore = create<State & Actions>()((set, get) => ({
  ...defautValueStates,
  getAllPost: async () => {
    //fetch all post
    const response = await getPostsPagination(get().page, get().limit);
    if (!response) {
      return;
    }
    set({
      posts: [...get().posts, ...response.posts],
    });
  },
  createPost: async (post: PostType) => {
    //create post
  },
  clearList: () => {
    set({
      ...defautValueStates,
    });
  },
}));
