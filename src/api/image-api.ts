import supabase from "@/lib/supabase";
import { BUCKET_NAME } from "@/constants/constants";

export async function getUploadedImageUrl({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImagesInPath(filePath: string) {
  const { data: files, error: fetchFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(filePath);

  if (fetchFilesError) throw fetchFilesError;

  const { error: removeFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(files.map((file) => `${filePath}/${file.name}`));

  if (removeFilesError) throw removeFilesError;
}
