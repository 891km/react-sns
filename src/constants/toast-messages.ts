export const TOAST_MESSAGES_POST = {
  CREATE: {
    SUCCESS: "포스트를 게시했습니다.",
    ERROR: "포스트 게시에 실패했습니다.",
  },
  UPDATE: {
    SUCCESS: "포스트를 수정했습니다.",
    ERROR: "포스트 수정에 실패했습니다.",
  },
  DELETE: {
    SUCCESS: "포스트를 삭제했습니다.",
    ERROR: "포스트 삭제에 실패했습니다.",
  },
} as const;

export const TOAST_MESSAGES_PROFILE = {
  UPDATE: {
    SUCCESS: "프로필을 수정했습니다.",
    ERROR: "프로필 수정에 실패했습니다.",
  },
};
