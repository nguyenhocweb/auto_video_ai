import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDbTemplateService,
  exportToCapCutDesktopService,
  getDbTemplatesService,
  getTemplateDetailService,
  getTemplatesService,
  launchCapCutService,
  parseTemplateService,
  renderTemplateService,
  saveTemplateToDbService,
} from "../service/templates.service";
import { SavedTemplateDbItem, TemplateRenderPayload } from "../type/templates.types";

export const useGetTemplates = () => {
  return useQuery({
    queryKey: ["creator", "templates"],
    queryFn: getTemplatesService,
    staleTime: 60 * 1000,
  });
};

export const useGetDbTemplates = () => {
  return useQuery({
    queryKey: ["creator", "templates", "db"],
    queryFn: getDbTemplatesService,
    staleTime: 60 * 1000,
  });
};

export const useGetTemplateDetail = (templateId: string) => {
  return useQuery({
    queryKey: ["creator", "templates", templateId],
    queryFn: () => getTemplateDetailService(templateId),
    enabled: !!templateId,
    staleTime: 60 * 1000,
  });
};

export const useSaveTemplateToDb = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SavedTemplateDbItem) => saveTemplateToDbService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator", "templates", "db"] });
    },
  });
};

export const useDeleteDbTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => deleteDbTemplateService(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator", "templates", "db"] });
    },
  });
};

export const useRenderTemplate = () => {
  return useMutation({
    mutationFn: (payload: TemplateRenderPayload) => renderTemplateService(payload),
  });
};

export const useParseTemplate = () => {
  return useMutation({
    mutationFn: ({ urlOrId, draftFile }: { urlOrId?: string; draftFile?: File | null }) =>
      parseTemplateService(urlOrId, draftFile),
  });
};

export const useExportToCapCutDesktop = () => {
  return useMutation({
    mutationFn: exportToCapCutDesktopService,
  });
};

export const useLaunchCapCut = () => {
  return useMutation({
    mutationFn: (projectPath?: string) => launchCapCutService(projectPath),
  });
};

