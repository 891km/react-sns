import AuthLayout from "@/layouts/auth-layout";
import ForgetPasswordPage from "@/pages/forget-password-page";
import IndexPage from "@/pages/index-page";
import LoginPage from "@/pages/login-page";
import NotFoundPage from "@/pages/not-found-page";
import PostDetailPage from "@/pages/post-detail-page";
import ProfilePage from "@/pages/profile-page";
import SignupPage from "@/pages/signup-page";
import { Route, Routes } from "react-router";

export default function RootRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
      </Route>

      <Route path="/" element={<IndexPage />} />
      <Route path="/post/:postId" element={<PostDetailPage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
