import { getFileDataUrl, getFileUri } from "./fileStorage";

export async function loadContentImages(content) {
  const images = [];

  for (const file of content?.attachments || []) {
    if (!file) continue;

    const isImage =
      file.mimeType?.startsWith("image/") || file.type?.startsWith("image/");

    if (!isImage) continue;

    try {
      let src = null;

      if (file.path) {
        src =
          (await getFileDataUrl(file.path, file.mimeType)) ||
          (await getFileUri(file.path));
      } else {
        src = file.uri || file.dataUrl || null;
      }

      if (src) {
        images.push({ src, name: file.name || "تصویر" });
      }
    } catch (error) {
      console.error("Load image error:", error);
    }
  }

  return images;
}
