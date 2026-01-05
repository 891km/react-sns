import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useLoginWithPassword } from "@/hooks/mutations/auth/use-login-with-password";
import { useLoginWithOAuth } from "@/hooks/mutations/auth/use-login-with-oauth";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import githubLogo from "@/assets/github-mark.svg";
import githubLogoWhite from "@/assets/github-mark-white.svg";
import { toast } from "sonner";
import { getAuthErrorMessageKo } from "@/lib/error-code-ko";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import { useIsDarkTheme } from "@/store/theme";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isDark = useIsDarkTheme();

  const { mutate: loginWithPassword, isPending: isLoginWithPasswordPending } =
    useLoginWithPassword({
      onError: (error) => {
        const message = getAuthErrorMessageKo(error);
        toast.error(message);
        setEmail("");
        setPassword("");
      },
      onSuccess: () => {
        navigate(ROUTES.HOME);
      },
    });

  const { mutate: loginWithOAuth, isPending: isLoginWithOAuthPending } =
    useLoginWithOAuth({
      onError: (error) => {
        const message = getAuthErrorMessageKo(error);
        toast.error(message);
      },
    });

  const handleLoginWithPasswordClick = () => {
    if (isEmptyInput) return;
    loginWithPassword({ email, password });
  };

  const handleLoginWithGithubClick = () => {
    loginWithOAuth("github");
  };

  const handleLoginWithTestClick = () => {
    loginWithPassword({
      email: "test@test.com",
      password: "123456",
    });
  };

  const isEmptyInput = !email.trim() || !password.trim();
  const isLoginPending = isLoginWithPasswordPending || isLoginWithOAuthPending;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8 pb-20">
      <h2 className="pt-6 text-center text-xl font-bold">로그인</h2>

      <div className="flex flex-col gap-4">
        <FloatingLabelInput
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoginPending}
        />
        <FloatingLabelInput
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoginPending}
        />
        <Button
          className="w-full py-6"
          onClick={handleLoginWithPasswordClick}
          disabled={isEmptyInput || isLoginPending}
        >
          {isLoginWithPasswordPending ? <Spinner /> : "로그인"}
        </Button>
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="line-height mx-auto text-sm hover:underline"
        >
          비밀번호를 잊어버리셨나요?
        </Link>
      </div>

      <div className="text-muted-foreground mx-auto flex items-center gap-2">
        아직 계정이 없다면?
        <Link to={ROUTES.SIGNUP} className="text-foreground hover:underline">
          회원가입
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-muted-foreground before:text-border after:text-border flex items-center justify-center gap-2 text-sm before:flex-1 before:border-t before:content-[''] after:flex-1 after:border-t after:content-['']">
          또는
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full py-6"
            onClick={handleLoginWithGithubClick}
          >
            <img
              src={isDark ? githubLogoWhite : githubLogo}
              alt=""
              className="h-5 w-5"
            />
            Github로 로그인
          </Button>
          <Button
            variant="outline"
            className="w-full py-6"
            onClick={handleLoginWithTestClick}
          >
            테스트 계정으로 로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
