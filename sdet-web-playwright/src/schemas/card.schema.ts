import { z } from "zod";
import { dateStringSchema } from "./common.schema";

/**
 * Schema for the payload sent when creating a card (POST /api/Cards/)
 */
export const juiceAddCardPayloadSchema = z.object({
  fullName: z.string().min(1),
  cardNum: z.number().min(1000000000000000).max(9999999999999999),
  expMonth: z.number().min(1).max(12),
  expYear: z.number().min(2080).max(2099),
});

/**
 * Schema for the response body of the create card API request (POST /api/Cards/)
 */
export const juiceCardSchema = juiceAddCardPayloadSchema.extend({
  id: z.number().positive(),
  UserId: z.number().positive(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

/**
 * Contract for the Card API response payload (POST /api/Cards/)
 */
export const juiceCardResponseSchema = z.object({
  status: z.string().min(1),
  data: juiceCardSchema,
});
