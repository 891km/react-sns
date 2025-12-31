import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useUpdatePassword } from "@/hooks/mutations/auth/use-update-password";
import { getAuthErrorMessageKo } from "@/lib/error-code-ko";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router";
import { ROUTES } from "@/constants/routes";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const { mutate: updatePassword, isPending } = useUpdatePassword({
    onError: (error) => {
      const message = getAuthErrorMessageKo(error);
      toast.error(message);
      setPassword("");
    },

    onSuccess: () => {
      toast.info("비밀번호가 변경되었습니다.");
      setPassword("");
      navigate(ROUTES.HOME);
    },
  });

  const handleUpdatePasswordClick = () => {
    if (isEmptyInput) return;
    updatePassword(password);
  };

  const isEmptyInput = !password.trim();

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8 pb-20">
      <h2 className="pt-6 text-center text-xl font-bold">비밀번호 변경하기</h2>

      <p className="mx-auto text-center">새로운 비밀번호를 입력해 주세요.</p>

      <div className="flex flex-col gap-4">
        <FloatingLabelInput
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
        <Button
          className="w-full py-6"
          onClick={handleUpdatePasswordClick}
          disabled={isEmptyInput || isPending}
        >
          {isPending ? <Spinner /> : "변경하기"}
        </Button>
      </div>
    </div>
  );
}
