import { createPortal } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

export default function AppLoader() {
  return createPortal(
    <div className="bg-background/40 fixed top-0 left-0 z-100 flex h-screen w-screen items-center justify-center select-none">
      <Spinner className="h-8 w-8" />
    </div>,
    document.body,
  );
}
