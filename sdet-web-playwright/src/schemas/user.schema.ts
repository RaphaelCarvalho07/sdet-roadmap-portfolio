import { z } from "zod";

/**
 * Contract for the Juice Shop User registration payload (POST /api/Users/)
 */
export const juiceUserRegistrationPayloadSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  repeatPassword: z.string().min(1),
  securityQuestion: z.object({
    id: z.number().positive(),
    question: z.string().min(1),
  }),
  securityAnswer: z.string().min(1),
});

/**
 * Validation contract for the Juice Shop User registration response (POST /api/Users/)
 */
export const juiceUserRegistrationResponseSchema = z.object({
  status: z.string().min(1),
  data: z.object({
    id: z.number().positive(),
    email: z.email(),
    role: z.string().min(1),
    isActive: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
});

/**
 * Contract for the Juice Shop login payload
 */
export const juiceUserLoginPayloadSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

/**
 * Validation contract for the Juice Shop User login response (POST /rest/user/login)
 */
export const juiceUserLoginResponseSchema = z.object({
  authentication: z.object({
    token: z.string().min(1),
    bid: z.number().positive(),
    umail: z.email(),
  }),
});
