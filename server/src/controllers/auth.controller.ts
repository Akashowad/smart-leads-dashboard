import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { signToken } from "../utils/jwt.js";

const buildAuthResponse = (user: { id: string; name: string; email: string; role: "Admin" | "Sales User" }) => ({
  user,
  token: signToken(user)
});

export const register = async (req: Request, res: Response): Promise<void> => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw new AppError("Email is already registered", 409);

  const user = await User.create({ ...req.body, role: "Sales User" });
  res.status(201).json({
    success: true,
    data: buildAuthResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  res.json({
    success: true,
    data: buildAuthResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: { user: req.user } });
};
