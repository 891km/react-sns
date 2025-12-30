import { Spinner } from "@/components/ui/spinner";

export default function AppLoader() {
  return (
    <div className="fixed top-0 left-0 z-9999 flex h-screen w-screen items-center justify-center bg-white/40">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
