import { getUploadedImageUrl } from "@/api/image-api";
import supabase from "@/lib/supabase";
import type { PostEntity } from "@/types/types";

export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(id: number) {
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createPostWithImages({
  content,
  imageFiles,
  userId,
}: {
  content: string;
  imageFiles: File[];
  userId: string;
}) {
  const post = await createPost(content);
  if (imageFiles.length === 0) return;

  try {
    // 이미지 bucket에 업로드 -> imageUrls
    const imageUrls = await Promise.all(
      imageFiles.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp";
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${userId}/${post.id}/${fileName}`;

        return getUploadedImageUrl({
          file: image,
          filePath,
        });
      }),
    );

    // 포스트 테이블에 imageUrls 추가
    const updatedPost = await updatePost({
      id: post.id,
      image_urls: imageUrls,
    });
    return updatedPost;
  } catch (error) {
    await deletePost(post.id);
    throw error;
  }
}
