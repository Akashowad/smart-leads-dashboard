import type { FilterQuery, SortOrder } from "mongoose";
import type { Request, Response } from "express";
import { Lead, type ILead } from "../models/Lead.js";
import { AppError } from "../utils/AppError.js";
import { toCsv } from "../utils/csv.js";

const PAGE_LIMIT = 10;

const buildLeadFilter = (req: Request): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};
  const { status, source, search } = req.query as {
    status?: string;
    source?: string;
    search?: string;
  };

  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  if (req.user?.role !== "Admin") filter.owner = req.user?.id;
  return filter;
};

export const listLeads = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page ?? 1);
  const sort = req.query.sort === "oldest" ? 1 : -1;
  const filter = buildLeadFilter(req);
  const total = await Lead.countDocuments(filter);
  const leads = await Lead.find(filter)
    .populate("owner", "name email role")
    .sort({ createdAt: sort as SortOrder })
    .skip((page - 1) * PAGE_LIMIT)
    .limit(PAGE_LIMIT);

  res.json({
    success: true,
    data: leads,
    meta: {
      page,
      limit: PAGE_LIMIT,
      total,
      totalPages: Math.ceil(total / PAGE_LIMIT),
      hasNextPage: page * PAGE_LIMIT < total,
      hasPreviousPage: page > 1
    }
  });
};

export const getLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id).populate("owner", "name email role");
  if (!lead) throw new AppError("Lead not found", 404);
  if (req.user?.role !== "Admin" && String(lead.owner._id) !== req.user?.id) {
    throw new AppError("You do not have permission", 403);
  }
  res.json({ success: true, data: lead });
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.create({ ...req.body, owner: req.user?.id });
  res.status(201).json({ success: true, data: lead });
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const filter: FilterQuery<ILead> = { _id: req.params.id };
  if (req.user?.role !== "Admin") filter.owner = req.user?.id;

  const lead = await Lead.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
  if (!lead) throw new AppError("Lead not found", 404);
  res.json({ success: true, data: lead });
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  const filter: FilterQuery<ILead> = { _id: req.params.id };
  if (req.user?.role !== "Admin") filter.owner = req.user?.id;

  const lead = await Lead.findOneAndDelete(filter);
  if (!lead) throw new AppError("Lead not found", 404);
  res.status(204).send();
};

export const exportLeads = async (req: Request, res: Response): Promise<void> => {
  const filter = buildLeadFilter(req);
  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  const csv = toCsv(
    ["Name", "Email", "Status", "Source", "Created At"],
    leads.map((lead) => [lead.name, lead.email, lead.status, lead.source, lead.createdAt])
  );

  res.header("Content-Type", "text/csv");
  res.attachment(`leads-${Date.now()}.csv`);
  res.send(csv);
};
