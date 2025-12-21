import { Route, Routes } from "react-router";
import "@/App.css";
import IndexPage from "@/pages/index-page";
import LoginPage from "@/pages/login-page";
import SignupPage from "@/pages/signup-page";
import AuthLayout from "@/layouts/auth-layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}

export default App;
