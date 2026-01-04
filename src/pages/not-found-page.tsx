import { TriangleAlert } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="fixed top-0 left-0 z-9999 flex h-screen w-screen items-center justify-center bg-white/40">
      <div className="flex flex-col items-center justify-center gap-3">
        <TriangleAlert className="h-7 w-7 text-red-400" />
        <div className="text-center whitespace-pre-line">
          페이지를 찾을 수 없습니다.
        </div>
      </div>
    </div>
  );
}
