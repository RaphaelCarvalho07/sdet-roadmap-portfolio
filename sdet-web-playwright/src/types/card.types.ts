import { z } from "zod";

import {
  juiceAddCardPayloadSchema,
  juiceCardSchema,
  juiceCardResponseSchema,
} from "../schemas/card.schema";

export type JuiceCardPayload = z.infer<typeof juiceAddCardPayloadSchema>;

export type JuiceCard = z.infer<typeof juiceCardSchema>;

export type JuiceCardResponse = z.infer<typeof juiceCardResponseSchema>;
