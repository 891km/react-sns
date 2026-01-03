import supabase from "@/lib/supabase";

export async function fetchCommentsByPost(postId: number) {
  const { data, error } = await supabase
    .from("comment")
    // .select("*, author: profile!author_id (*)")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createComment({
  postId,
  content,
}: {
  postId: number;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comment")
    .insert({
      post_id: postId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateComment({
  commentId,
  content,
}: {
  commentId: number;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comment")
    .update({
      content,
    })
    .eq("id", commentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: number) {
  const { data, error } = await supabase
    .from("comment")
    .delete()
    .eq("id", commentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
