import axiosClient from "@/src/core/api/axios-instance";
import {
  VideoExtractPayload,
  VideoMetadataResponse,
  VideoSavePayload,
  VideoRecordItem,
  VideoPaginationResponse,
  VideoHistoryParams,
} from "../type/video.type";

export const extractDouyinVideoService = async (
  payload: VideoExtractPayload
): Promise<VideoMetadataResponse> => {
  const res = await axiosClient.post<VideoMetadataResponse>(
    "/api/v1/creator/video/extract",
    payload
  );
  return res.data;
};

export const saveVideoToLibraryService = async (
  payload: VideoSavePayload
): Promise<VideoRecordItem> => {
  const res = await axiosClient.post<VideoRecordItem>(
    "/api/v1/creator/video/save",
    payload
  );
  return res.data;
};

export const getDownloadedVideosService = async (
  params?: VideoHistoryParams
): Promise<VideoPaginationResponse> => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const res = await axiosClient.get<VideoPaginationResponse>(
    `/api/v1/creator/video/history?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const deleteDownloadedVideoService = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await axiosClient.delete<{ success: boolean; message: string }>(
    `/api/v1/creator/video/${id}`
  );
  return res.data;
};

export const getProxyDownloadUrl = (targetUrl: string, filename: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
  return `${baseURL}/api/v1/creator/video/proxy-download?url=${encodeURIComponent(
    targetUrl
  )}&filename=${encodeURIComponent(filename)}`;
};

export const getProxyStreamUrl = (targetUrl: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
  return `${baseURL}/api/v1/creator/video/proxy-download?url=${encodeURIComponent(
    targetUrl
  )}&inline=true`;
};

