import { z } from "zod";

import {
  juiceProductSchema,
  juiceProductSearchResponseSchema,
} from "../schemas/product.schema";

export type JuiceProduct = z.infer<typeof juiceProductSchema>;

export type JuiceProductsResponse = z.infer<
  typeof juiceProductSearchResponseSchema
>;
