import supabase from "@/lib/supabase";
import { getRandomNickname } from "@/lib/utils";

export async function fetchProfileData(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createProfileData(userId: string) {
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

export async function isNicknameTaken(nickname: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("nickname")
    .eq("nickname", nickname)
    .limit(1);

  if (error) throw error;
  return Boolean(data.length > 0);
}
