const STORAGE_KEY = "maddahyar_data";
const defaultData = { folders: [] };
function getDefaultData() {
  return { folders: [] };
}
export function loadStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return getDefaultData();
    }
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return getDefaultData();
    }
    const parsedData = JSON.parse(data);
    if (!parsedData || typeof parsedData !== "object") {
      return getDefaultData();
    }
    return {
      folders: Array.isArray(parsedData.folders) ? parsedData.folders : [],
    };
  } catch (error) {
    console.error("Storage load error:", error);
    return getDefaultData();
  }
}
export function saveStorage(data) {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    const safeData = {
      folders: Array.isArray(data?.folders) ? data.folders : [],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    return true;
  } catch (error) {
    console.error("Storage save error:", error);
    return false;
  }
}
export function clearStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Storage clear error:", error);
    return false;
  }
}
export { STORAGE_KEY, defaultData };
