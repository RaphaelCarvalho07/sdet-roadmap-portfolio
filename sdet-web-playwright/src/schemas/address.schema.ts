import { z } from "zod";
import { dateStringSchema } from "./common.schema";

/**
 * Schema for the payload sent when creating an address (POST /api/Addresses/)
 */
export const juiceAddAddressPayloadSchema = z.object({
  fullName: z.string().min(1),
  mobileNum: z.number().positive(),
  zipCode: z.string().max(8),
  streetAddress: z.string().max(160),
  city: z.string().min(2),
  state: z.string().min(2).optional(),
  country: z.string().min(2),
});

/**
 * Schema for the response body of the create address API request (POST /api/Addresses/)
 */
export const juiceAddressSchema = juiceAddAddressPayloadSchema.extend({
  id: z.number().positive(),
  UserId: z.number().positive(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

/**
 * Contract for the Address API response payload (POST /api/Addresses/)
 */
export const juiceAddressResponseSchema = z.object({
  status: z.string().min(1),
  data: juiceAddressSchema,
});
