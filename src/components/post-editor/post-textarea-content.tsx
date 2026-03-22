import { splitContentByMeta } from "@/lib/content-meta";
import type { ContentMeta } from "@/types/types";

export default function PostTextareaContent({
  content,
  contentMeta,
}: {
  content: string;
  contentMeta?: ContentMeta;
}) {
  const contentItems = splitContentByMeta({ content, contentMeta });

  return (
    <>
      {contentItems.map((item, index) => {
        if (item.type === "hidden") {
          return (
            <span
              key={`${item.type}-${index}`}
              className="bg-muted-foreground/30 rounded-xs"
            >
              {item.value}
            </span>
          );
        } else {
          return <span key={`${item.type}-${index}`}>{item.value}</span>;
        }
      })}
    </>
  );
}
