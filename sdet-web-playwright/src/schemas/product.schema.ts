import { z } from "zod";

import { dateStringSchema } from "./common.schema";

/**
 * Schema for an individual Juice Shop product item
 */
export const juiceProductSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  deluxePrice: z.number().positive(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  deletedAt: z.string().nullable(),
});

/**
 * Contract for the product search API response payload (GET /rest/products/search?q=...)
 */

export const juiceProductSearchResponseSchema = z.object({
  status: z.string().min(1),
  data: z.array(juiceProductSchema),
});
