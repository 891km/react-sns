import { deleteImagesInPath, getUploadedImageUrl } from "@/api/image-api";
import supabase from "@/lib/supabase";
import { getRandomNickname } from "@/lib/random-nickname";

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .insert({
      id: userId,
      nickname: getRandomNickname(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile({
  userId,
  nickname,
  bio,
  avatarImageFile,
}: {
  userId: string;
  nickname?: string;
  bio?: string;
  avatarImageFile?: File | null;
}) {
  let newAvatarImageUrl;
  await deleteImagesInPath(`${userId}/avatar`);

  if (avatarImageFile) {
    const fileExtension = avatarImageFile.name.split(".").pop() || "webp";
    const filePath = `${userId}/avatar/${new Date().getTime()}-${crypto.randomUUID()}.${fileExtension}`;

    newAvatarImageUrl = await getUploadedImageUrl({
      file: avatarImageFile,
      filePath,
    });
  }

  const { data, error } = await supabase
    .from("profile")
    .update({
      nickname,
      bio,
      avatar_image_url: Boolean(avatarImageFile) ? newAvatarImageUrl : null,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function isNicknameTaken(nickname: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("nickname")
    .eq("nickname", nickname)
    .limit(1);

  if (error) throw error;
  return Boolean(data.length > 0);
}
