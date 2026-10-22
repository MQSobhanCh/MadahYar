import { Filesystem, Directory } from "@capacitor/filesystem";
const FOLDER_NAME = "MaddahYar";
 function fileToBase64(
  file,
) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("فایلی انتخاب نشده است."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result;
        if (typeof result !== "string") {
          reject(new Error("خواندن فایل ناموفق بود."));
          return;
        }
        const commaIndex = result.indexOf(",");
        if (commaIndex === -1) {
          reject(new Error("فرمت فایل قابل پردازش نیست."));
          return;
        }
        resolve(result.substring(commaIndex + 1));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(new Error("خطا در خواندن فایل."));
    };
    reader.readAsDataURL(file);
  });
}
 function createSafeFileName(
  fileName,
) {
  const safeName = String(fileName || "file")
    .replace(/[^\w.\u0600-\u06FF-]/g, "_")
    .replace(/_+/g, "_");
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
}
 export async function saveFile(
  file,
) {
  if (!file) {
    throw new Error("فایلی انتخاب نشده است.");
  }
  const base64 = await fileToBase64(file);
  const fileName = createSafeFileName(file.name);
  const path = `${FOLDER_NAME}/${fileName}`;
  try {
    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Data,
      recursive: true,
    });
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      path,
    };
  } catch (error) {
    console.error("Save file error:", error);
    throw new Error("ذخیره فایل روی دستگاه انجام نشد.");
  }
}
 export async function saveFileToDevice(
  file,
) {
  return saveFile(file);
}
 export async function deleteStoredFile(
  path,
) {
  if (!path) {
    return;
  }
  try {
    await Filesystem.deleteFile({ path, directory: Directory.Data });
  } catch (error) {
    console.warn("Delete stored file warning:", error);
  }
}
 export async function getFileUri(
  path,
) {
  if (!path) {
    return null;
  }
  try {
    const result = await Filesystem.getUri({ path, directory: Directory.Data });
    return result?.uri || null;
  } catch (error) {
    console.error("Get file URI error:", error);
    return null;
  }
}
 export async function getFileDataUrl(
  path,
  mimeType,
) {
  if (!path) {
    return null;
  }
  try {
    const result = await Filesystem.readFile({
      path,
      directory: Directory.Data,
    });
    if (!result?.data) {
      return null;
    }
    let base64Data = result.data;
    if (typeof base64Data !== "string") {
      return null;
    }
     if (
      base64Data.startsWith("data:")
    ) {
      return base64Data;
    }
    const type = mimeType || "application/octet-stream";
    return `data:${type};base64,${base64Data}`;
  } catch (error) {
    console.error("Get file data URL error:", error);
    return null;
  }
}
 export async function fileExists(
  path,
) {
  if (!path) {
    return false;
  }
  try {
    await Filesystem.stat({ path, directory: Directory.Data });
    return true;
  } catch {
    return false;
  }
}
 export async function getStoredFileInfo(
  path,
) {
  if (!path) {
    return null;
  }
  try {
    const result = await Filesystem.stat({ path, directory: Directory.Data });
    return result;
  } catch (error) {
    console.error("Get stored file info error:", error);
    return null;
  }
}
