import { cn } from "@/lib/utils";

export default function ImageHider({
  isHidden = false,
}: {
  isHidden: boolean;
}) {
  return (
    <div
      className={cn(
        "text-foreground/70 isHidden absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center gap-0.5",
        isHidden
          ? "bg-muted/30 backdrop-blur-xl"
          : "bg-transparent backdrop-blur-none",
        "pointer-events-none transition-colors duration-150",
      )}
    >
      {isHidden && (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 19.3955V11.3955C20 6.97723 16.4183 3.39551 12 3.39551C7.58172 3.39551 4 6.97723 4 11.3955V19.3955" />
            <path d="M1 20.6045H23" />
            <path d="M8.39551 9.72363H8.40551" />
            <path d="M15.5967 9.72363H15.6067" />
            <path d="M11.7778 10.9453H12.2223" />
          </svg>
          <span className="text-center text-sm font-medium">스포일러 방지</span>
        </>
      )}
    </div>
  );
}
