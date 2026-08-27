import { z } from "zod";

import {
  juiceAddBasketItemPayloadSchema,
  juiceBasketItemSchema,
  juiceBasketItemResponseSchema,
} from "../schemas/basket.schema";

export type JuiceAddBasketItemPayload = z.infer<
  typeof juiceAddBasketItemPayloadSchema
>;

export type JuiceBasketItem = z.infer<typeof juiceBasketItemSchema>;

export type JuiceBasketItemResponse = z.infer<
  typeof juiceBasketItemResponseSchema
>;
