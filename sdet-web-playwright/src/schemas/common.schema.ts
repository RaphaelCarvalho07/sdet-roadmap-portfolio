import { z } from "zod";

export const dateStringSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  });
