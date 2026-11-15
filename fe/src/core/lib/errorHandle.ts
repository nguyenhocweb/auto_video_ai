export const extractErrorMessage = (error: any, defaultMessage = "Có lỗi xảy ra"): string => {
  if (typeof error === "string") return error;
  if (error?.response?.data?.detail) {
    if (typeof error.response.data.detail === "string") {
      return error.response.data.detail;
    }
    if (Array.isArray(error.response.data.detail)) {
      return error.response.data.detail.map((d: any) => d.msg || d.message).join(", ");
    }
  }
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return defaultMessage;
};

