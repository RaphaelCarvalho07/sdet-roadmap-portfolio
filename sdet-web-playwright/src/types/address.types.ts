import { z } from "zod";

import {
  juiceAddAddressPayloadSchema,
  juiceAddressSchema,
  juiceAddressResponseSchema,
} from "../schemas/address.schema";

export type JuiceAddressPayload = z.infer<typeof juiceAddAddressPayloadSchema>;

export type JuiceAddress = z.infer<typeof juiceAddressSchema>;

export type JuiceAddressResponse = z.infer<typeof juiceAddressResponseSchema>;
