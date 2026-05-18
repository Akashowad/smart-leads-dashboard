import { z } from "zod";
import { leadSources, leadStatuses } from "../types/enums.js";

export const leadIdSchema = z.object({
  params: z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid lead id") })
});

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().toLowerCase(),
    status: z.enum(leadStatuses).default("New"),
    source: z.enum(leadSources)
  })
});

export const updateLeadSchema = leadIdSchema.extend({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      email: z.string().trim().email().toLowerCase().optional(),
      status: z.enum(leadStatuses).optional(),
      source: z.enum(leadSources).optional()
    })
    .refine((value) => Object.keys(value).length > 0, "Provide at least one field to update")
});

export const listLeadsSchema = z.object({
  query: z.object({
    status: z.enum(leadStatuses).optional(),
    source: z.enum(leadSources).optional(),
    search: z.string().trim().max(100).optional(),
    sort: z.enum(["latest", "oldest"]).default("latest"),
    page: z.coerce.number().int().positive().default(1)
  })
});
