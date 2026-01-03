export const QUERY_KEYS = {
  profile: {
    all: ["profile"],
    list: ["profile", "list"],
    byId: (userId?: string) => ["profile", "list", userId],
  },

  post: {
    all: ["post"],
    list: ["post", "list"],
    userList: (authorId?: string) => ["post", "userList", authorId],
    byId: (postId?: number) => ["post", "list", postId],
  },

  comment: {
    all: ["comment"],
    list: ["comment", "list"],
    byPost: (postId?: number) => ["comment", "list", postId],
  },
};

export const BUCKET_NAME = "uploads";

export const POST_CONTENT_LENGTH_SHORT = 180;
export const POST_CONTENT_LENGTH_MAX = 800;
export const POST_COMMENT_LENGTH_MAX = 400;
export const NICKNAME_LENGTH_MIN = 2;
export const NICKNAME_LENGTH_MAX = 14;
export const BIO_LENGTH_MIN = 180;
