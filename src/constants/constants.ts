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
};

export const BUCKET_NAME = "uploads";
