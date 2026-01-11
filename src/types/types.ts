import { type Database } from "@/database.types";

export type ContentMeta = {
  start: number;
  end: number;
}[];

export type ImagesMeta = boolean;

export type PostMetadata = {
  content_hidden: ContentMeta;
  images_hidden: ImagesMeta;
};

export type Theme = "system" | "dark" | "light";

export type PostType = "FEED" | "DETAIL";

export type PostEntity = Omit<
  Database["public"]["Tables"]["post"]["Row"],
  "metadata"
> & {
  metadata: PostMetadata;
};

export type Post = PostEntity & {
  author: ProfileEntity;
  isLiked: boolean;
  commentCount: number;
};

export type ProfileEntity = Database["public"]["Tables"]["profile"]["Row"];

export type CommentEntity = Database["public"]["Tables"]["comment"]["Row"];

export type CommentItem = CommentEntity & {
  author: ProfileEntity;
};

export type NestedComment = CommentItem & {
  parentComment?: CommentItem;
  children: NestedComment[];
};

export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
