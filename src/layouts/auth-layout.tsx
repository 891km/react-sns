import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <>
      <header>Auth</header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
