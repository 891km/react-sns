import { getUploadedImageUrl } from "@/api/image-api";
import supabase from "@/lib/supabase";
import type { PostEntity } from "@/types/types";

export async function fetchPosts({
  from,
  to,
  userId,
}: {
  from: number;
  to: number;
  userId?: string;
}) {
  const query = supabase
    .from("post")
    .select("*, author: profile!author_id (*), isLiked: like!post_id (*)")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (userId) {
    query.eq("like.user_id", userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.map((post) => ({
    ...post,
    isLiked: userId ? post.isLiked && post.isLiked.length > 0 : false,
  }));
}

export async function fetchPostById({
  postId,
  userId,
}: {
  postId: number;
  userId?: string;
}) {
  const query = supabase
    .from("post")
    .select("*, author: profile!author_id (*), isLiked: like!post_id (*)")
    .eq("id", postId);

  if (userId) {
    query.eq("like.user_id", userId);
  }

  const { data, error } = await query.single();

  if (error) throw error;
  return {
    ...data,
    isLiked: userId ? data.isLiked && data.isLiked.length > 0 : false,
  };
}

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

export async function togglePostLike({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { data, error } = await supabase.rpc("toggle_post_like", {
    p_post_id: postId,
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}
