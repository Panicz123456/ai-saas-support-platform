import { z } from 'zod'

export const vapiSchema = z.object({
	publicApiKey: z.string().min(1, { message: 'Public API Key is required' }),
	privateApiKey: z.string().min(1, { message: 'Privet API Key is required' }),
});

export type vapiSchemaType = z.infer<typeof vapiSchema>