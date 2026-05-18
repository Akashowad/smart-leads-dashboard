import { Router } from "express";
import {
  createLead,
  deleteLead,
  exportLeads,
  getLead,
  listLeads,
  updateLead
} from "../controllers/lead.controller.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createLeadSchema, leadIdSchema, listLeadsSchema, updateLeadSchema } from "../schemas/lead.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const leadRouter = Router();

leadRouter.use(protect);
leadRouter.get("/", validate(listLeadsSchema), asyncHandler(listLeads));
leadRouter.get("/export", validate(listLeadsSchema), asyncHandler(exportLeads));
leadRouter.post("/", validate(createLeadSchema), asyncHandler(createLead));
leadRouter.get("/:id", validate(leadIdSchema), asyncHandler(getLead));
leadRouter.patch("/:id", validate(updateLeadSchema), asyncHandler(updateLead));
leadRouter.delete("/:id", authorize("Admin"), validate(leadIdSchema), asyncHandler(deleteLead));
