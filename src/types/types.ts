import { type Database } from "@/database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];

export type ProfileEntity = Database["public"]["Tables"]["profile"]["Row"];

export type PostWithAuthor = PostEntity & {
  author: ProfileEntity;
  isLiked: boolean;
};

export type CommentEntity = Database["public"]["Tables"]["comment"]["Row"];

export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
