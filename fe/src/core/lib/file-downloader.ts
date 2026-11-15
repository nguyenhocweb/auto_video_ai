/**
 * Tiện ích tải file hỗ trợ File System Access API (showSaveFilePicker)
 * cho phép người dùng tự chọn thư mục lưu trữ trên máy tính.
 */
export async function downloadFileWithPicker(
  fullUrl: string,
  suggestedName: string,
  ext: string
): Promise<void> {
  try {
    const res = await fetch(fullUrl);
    const blob = await res.blob();

    if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName,
          types: [{ description: ext.toUpperCase(), accept: { "*/*": [`.${ext}`] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (e: any) {
        if (e.name === "AbortError") return;
      }
    }

    const bUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = bUrl;
    a.download = suggestedName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(bUrl);
  } catch (err) {
    console.error("Lỗi khi tải file:", err);
  }
}

