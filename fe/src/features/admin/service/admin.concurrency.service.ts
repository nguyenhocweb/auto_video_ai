import axiosClient from "@/src/core/api/axios-instance";
import {
  ConcurrencySettingsResponse,
  UpdateConcurrencyPayload,
} from "../type/admin.concurrency.type";

export const getConcurrencySettingsService = async (): Promise<ConcurrencySettingsResponse> => {
  const res = await axiosClient.get<ConcurrencySettingsResponse>(
    "/api/v1/admin/settings/concurrency"
  );
  return res.data;
};

export const updateConcurrencySettingsService = async (
  payload: UpdateConcurrencyPayload
): Promise<{ message: string; settings: any }> => {
  const res = await axiosClient.patch<{ message: string; settings: any }>(
    "/api/v1/admin/settings/concurrency",
    payload
  );
  return res.data;
};

