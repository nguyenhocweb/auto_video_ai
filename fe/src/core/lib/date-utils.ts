/**
 * Tiện ích định dạng thời gian thực chuẩn múi giờ Việt Nam (Asia/Ho_Chi_Minh - UTC+7).
 * Sử dụng thuần native JavaScript Date (Tuyệt đối không dùng thư viện ngoài).
 */

export function formatVietnamTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "Chưa cập nhật";

  try {
    let dateStr = typeof dateInput === "string" ? dateInput.trim() : dateInput.toISOString();
    if (!dateStr) return "Chưa cập nhật";

    // Nếu chuỗi ISO chưa có Z hoặc offset (+/-), tự động coi là UTC và thêm Z
    if (!dateStr.endsWith("Z") && !dateStr.includes("+") && !dateStr.slice(10).includes("-")) {
      dateStr += "Z";
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateInput);

    return d.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    });
  } catch {
    return String(dateInput);
  }
}

export function formatVietnamDateOnly(dateInput?: string | Date | null): string {
  if (!dateInput) return "Chưa cập nhật";

  try {
    let dateStr = typeof dateInput === "string" ? dateInput.trim() : dateInput.toISOString();
    if (!dateStr.endsWith("Z") && !dateStr.includes("+") && !dateStr.slice(10).includes("-")) {
      dateStr += "Z";
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateInput);

    return d.toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return String(dateInput);
  }
}

export function formatVietnamShortTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "Chưa chạy";

  try {
    let dateStr = typeof dateInput === "string" ? dateInput.trim() : dateInput.toISOString();
    if (!dateStr) return "Chưa chạy";

    // Nếu chuỗi ISO chưa có Z hoặc offset (+/-), tự động coi là UTC và thêm Z
    if (!dateStr.endsWith("Z") && !dateStr.includes("+") && !dateStr.slice(10).includes("-")) {
      dateStr += "Z";
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateInput);

    return d.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      hour12: false,
    });
  } catch {
    return String(dateInput);
  }
}

