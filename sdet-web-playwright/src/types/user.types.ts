import { z } from "zod";
import {
  juiceUserRegistrationPayloadSchema,
  juiceUserRegistrationResponseSchema,
  juiceUserLoginPayloadSchema,
  juiceUserLoginResponseSchema,
} from "../schemas/user.schema";

export type JuiceUserRegistrationPayload = z.infer<
  typeof juiceUserRegistrationPayloadSchema
>;
export type JuiceUserRegistrationResponse = z.infer<
  typeof juiceUserRegistrationResponseSchema
>;
export type JuiceUserLoginPayload = z.infer<typeof juiceUserLoginPayloadSchema>;
export type JuiceUserLoginResponse = z.infer<
  typeof juiceUserLoginResponseSchema
>;
