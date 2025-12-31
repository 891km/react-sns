import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function UserOnlyLayout() {
  const session = useSession();
  if (!session) return <Navigate to="/login" replace={true} />;
  return <Outlet />;
}
