import defaultProfile from "@/assets/default-profile.png";
import { cn } from "@/lib/utils";

export default function ProfileAvatar({
  src,
  size = 10,
  className,
}: {
  src?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={src || defaultProfile}
      alt="유저 프로필"
      className={cn(
        `h-${size} w-${size}`,
        "rounded-full object-cover text-gray-100 ring-1 ring-current",
        className,
      )}
    />
  );
}
