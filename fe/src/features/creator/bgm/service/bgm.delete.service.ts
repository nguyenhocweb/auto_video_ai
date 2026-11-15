import axiosClient from "@/src/core/api/axios-instance";

export const deleteBgmTrack = async (id: string): Promise<{ message: string }> => {
  const res = await axiosClient.delete<{ message: string }>(`/api/v1/creator/bgm/${id}`);
  return res.data;
};

