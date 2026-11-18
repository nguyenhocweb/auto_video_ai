import axiosClient from "@/src/core/api/axios-instance";
import {
  CreateCapCutDesktopResponse,
  LaunchCapCutResponse,
  ParsedTemplateResult,
  SavedTemplateDbItem,
  SavedTemplateDbListResponse,
  TemplateItem,
  TemplateListResponse,
  TemplateRenderPayload,
  TemplateRenderResponse,
} from "../type/templates.types";

export const getTemplatesService = async (): Promise<TemplateListResponse> => {
  const response = await axiosClient.get<TemplateListResponse>("/api/v1/creator/templates");
  return response.data;
};

export const getTemplateDetailService = async (templateId: string): Promise<TemplateItem> => {
  const response = await axiosClient.get<TemplateItem>(`/api/v1/creator/templates/${templateId}`);
  return response.data;
};

export const getDbTemplatesService = async (): Promise<SavedTemplateDbListResponse> => {
  const response = await axiosClient.get<SavedTemplateDbListResponse>("/api/v1/creator/templates/db");
  return response.data;
};

export const saveTemplateToDbService = async (
  payload: SavedTemplateDbItem
): Promise<SavedTemplateDbItem> => {
  const response = await axiosClient.post<SavedTemplateDbItem>(
    "/api/v1/creator/templates/db",
    payload
  );
  return response.data;
};

export const deleteDbTemplateService = async (
  templateId: string
): Promise<{ success: boolean; template_id: string; message: string }> => {
  const response = await axiosClient.delete<{
    success: boolean;
    template_id: string;
    message: string;
  }>(`/api/v1/creator/templates/db/${templateId}`);
  return response.data;
};

export const renderTemplateService = async (
  payload: TemplateRenderPayload
): Promise<TemplateRenderResponse> => {
  const formData = new FormData();
  formData.append("template_id", payload.template_id);

  if (payload.slot_files) {
    Object.entries(payload.slot_files).forEach(([slotId, file]) => {
      if (file) {
        formData.append(`slot_${slotId}`, file);
      }
    });
  }

  if (payload.video_file) {
    formData.append("video_file", payload.video_file);
  }
  if (payload.image_file) {
    formData.append("image_file", payload.image_file);
  }
  if (payload.audio_file) {
    formData.append("audio_file", payload.audio_file);
  }

  const response = await axiosClient.post<TemplateRenderResponse>(
    "/api/v1/creator/templates/render",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const parseTemplateService = async (
  urlOrId?: string,
  draftFile?: File | null
): Promise<ParsedTemplateResult> => {
  const formData = new FormData();
  if (urlOrId) {
    formData.append("url_or_id", urlOrId);
  }
  if (draftFile) {
    formData.append("draft_file", draftFile);
  }

  const response = await axiosClient.post<ParsedTemplateResult>(
    "/api/v1/creator/templates/parse",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const exportToCapCutDesktopService = async (payload: {
  template_id: string;
  template_url?: string | null;
  project_title?: string | null;
  slot_files?: Record<number, File | null>;
}): Promise<CreateCapCutDesktopResponse> => {
  const formData = new FormData();
  formData.append("template_id", payload.template_id);
  if (payload.template_url) {
    formData.append("template_url", payload.template_url);
  }
  if (payload.project_title) {
    formData.append("project_title", payload.project_title);
  }
  if (payload.slot_files) {
    Object.entries(payload.slot_files).forEach(([slotId, file]) => {
      if (file) {
        formData.append(`slot_${slotId}`, file);
      }
    });
  }

  const response = await axiosClient.post<CreateCapCutDesktopResponse>(
    "/api/v1/creator/templates/export-to-capcut-pc",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const launchCapCutService = async (
  projectPath?: string
): Promise<LaunchCapCutResponse> => {
  const response = await axiosClient.post<LaunchCapCutResponse>(
    "/api/v1/creator/templates/launch-capcut",
    { project_path: projectPath }
  );
  return response.data;
};

