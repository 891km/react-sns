import { signupWithPassword } from "@/api/auth-api";
import type { UseMutationCallback } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

export const useSignupWithPassword = (callback?: UseMutationCallback) => {
  return useMutation({
    mutationFn: signupWithPassword,
    onError: (error) => callback?.onError?.(error),
    onSuccess: () => callback?.onSuccess?.(),
    onMutate: () => callback?.onMutate?.(),
    onSettled: () => callback?.onSettled?.(),
  });
};
