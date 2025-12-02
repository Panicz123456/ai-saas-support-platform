import { z } from 'zod';

export const chatFormSchema = z.object({
	message: z.string().min(1, 'Message is required'),
});

export type chatFormSchemaType = z.infer<typeof chatFormSchema>;