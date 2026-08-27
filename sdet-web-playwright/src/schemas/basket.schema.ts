import { z } from "zod";

/**
 * Schema for the payload sent when adding an item to the basket (POST /api/BasketItems/)
 */
export const juiceAddBasketItemPayloadSchema = z.object({
  ProductId: z.number().positive(),
  BasketId: z.string().or(z.number()),
  quantity: z.number().positive(),
});

/**
 * Schema for Basket Items
 */
export const juiceBasketItemSchema = z.object({
  id: z.number().positive(),
  ProductId: z.number().positive(),
  BasketId: z.string().or(z.number()),
  quantity: z.number().positive(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/**
 * Contract for the basket items responses
 */
export const juiceBasketItemResponseSchema = z.object({
  status: z.string().min(1),
  data: juiceBasketItemSchema,
});
