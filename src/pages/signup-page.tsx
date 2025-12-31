import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import { useSignupWithPassword } from "@/hooks/mutations/auth/use-signup-with-password";
import { getAuthErrorMessageKo } from "@/lib/error-code-ko";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signupWithPassword, isPending: isSignupPending } =
    useSignupWithPassword({
      onError: (error) => {
        const message = getAuthErrorMessageKo(error);
        toast.error(message);

        setEmail("");
        setPassword("");
      },
    });

  const handleSignupWithPasswordClick = () => {
    if (isEmptyInput) return;
    signupWithPassword({ email, password });
  };

  const isEmptyInput = !email.trim() || !password.trim();

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8 pb-20">
      <h2 className="pt-6 text-center text-xl font-bold">회원가입</h2>

      <div className="flex flex-col gap-4">
        <FloatingLabelInput
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSignupPending}
        />
        <FloatingLabelInput
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSignupPending}
        />
        <Button
          className="w-full py-6"
          onClick={handleSignupWithPasswordClick}
          disabled={isEmptyInput || isSignupPending}
        >
          {isSignupPending ? <Spinner /> : "회원가입"}
        </Button>
      </div>

      <div className="text-muted-foreground mx-auto flex items-center gap-2">
        이미 계정이 있다면?
        <Link to={ROUTES.LOGIN} className="text-black hover:underline">
          로그인
        </Link>
      </div>
    </div>
  );
}
