import { z } from 'zod';

export const authFormSchema = z.object({ 
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address")
})

export type authFormSchemaType = z.infer<typeof authFormSchema>;

export const chatFormSchema = z.object({ 
  message: z.string().min(1, "Message is required")
})

export type chatFormSchemaType = z.infer<typeof chatFormSchema>