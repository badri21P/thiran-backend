import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject } from "zod";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  req.body = result.data;
  next();
};