import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Spinner } from "@/components/ui/spinner";
import { useRequestResetPasswordEmail } from "@/hooks/mutations/auth/use-request-reset-password-email";
import { toast } from "sonner";
import { getAuthErrorMessageKo } from "@/lib/error-code-ko";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const { mutate: requestResetPasswordEmail, isPending } =
    useRequestResetPasswordEmail({
      onSuccess: () => {
        toast.info("인증 메일이 발송되었습니다.");
        setEmail("");
      },
      onError: (error) => {
        const message = getAuthErrorMessageKo(error);
        toast.error(message);
        setEmail("");
      },
    });

  const handleRequestEmailClick = () => {
    if (isEmptyInput) return;
    requestResetPasswordEmail(email);
  };

  const isEmptyInput = !email.trim();

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8 pb-20">
      <h2 className="pt-6 text-center text-xl font-bold">비밀번호 찾기</h2>

      <p className="mx-auto text-center">
        가입했던 이메일을 입력해 주세요. <br />
        비밀번호 재설정 링크를 보내드립니다.
      </p>

      <div className="flex flex-col gap-4">
        <FloatingLabelInput
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
        <Button
          className="w-full py-6"
          onClick={handleRequestEmailClick}
          disabled={isEmptyInput || isPending}
        >
          {isPending ? <Spinner /> : "인증 메일 요청하기"}
        </Button>
      </div>
    </div>
  );
}
