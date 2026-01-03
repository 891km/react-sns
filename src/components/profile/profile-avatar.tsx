import defaultProfile from "@/assets/default-profile.png";
import { cn } from "@/lib/utils";

export default function ProfileAvatar({
  src,
  size = 10,
  className,
}: {
  src?: string | null;
  /** tailwindcss 사이즈 기준 */
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={src || defaultProfile}
      alt="유저 프로필"
      style={{ width: size * 4, height: size * 4 }}
      className={cn(
        "rounded-full object-cover text-gray-100 ring-1 ring-current",
        className,
      )}
    />
  );
}
