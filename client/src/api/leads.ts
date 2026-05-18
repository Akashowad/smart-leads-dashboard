import { http } from "./http";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type { Lead, LeadFilters, LeadPayload } from "../types/lead";

const buildParams = (filters: LeadFilters): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("sort", filters.sort);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.search) params.set("search", filters.search);
  return params;
};

export const leadsApi = {
  list: async (filters: LeadFilters): Promise<PaginatedResponse<Lead[]>> => {
    const { data } = await http.get<PaginatedResponse<Lead[]>>(`/leads?${buildParams(filters)}`);
    return data;
  },
  create: async (payload: LeadPayload): Promise<Lead> => {
    const { data } = await http.post<ApiResponse<Lead>>("/leads", payload);
    return data.data;
  },
  update: async (id: string, payload: LeadPayload): Promise<Lead> => {
    const { data } = await http.patch<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return data.data;
  },
  remove: async (id: string): Promise<void> => {
    await http.delete(`/leads/${id}`);
  },
  exportCsv: async (filters: LeadFilters): Promise<Blob> => {
    const { data } = await http.get(`/leads/export?${buildParams(filters)}`, { responseType: "blob" });
    return data as Blob;
  }
};
